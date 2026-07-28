# Production Domain Deployment — Migrating `kowatrade.com` to the New Sakura VPS

A single, linear runbook for moving the live site from its current host (Sakura Rental Server) to the new Sakura VPS, **while reusing the existing `kowatrade.com` domain** — no new domain, no registrar change. This consolidates the operational steps already detailed in `deployment.md` and `web_hosting.md` into one execute-in-order checklist; those two files remain the source of truth for full command blocks and rationale — this doc is the orchestration layer on top.

> **Status: unverified against the real box**, same caveat as `deployment.md` — treat as a checklist to validate on first real run, not a proven transcript.

---

## 1. Overview

Today `kowatrade.com` is served by a **Sakura Rental Server (Standard plan)**. The new Next.js site runs in Docker on a **Sakura VPS (v5, 8G plan)** at `49.212.128.17`. The migration moves the running application to the VPS and then repoints the same domain at it. Guiding principle: **verify everything on a staging subdomain before touching the live apex domain**, and **keep the legacy rental server running after cutover** — it stays load-bearing as the mail host and DNS rollback target.

---

## 2. Can we reuse `kowatrade.com`? — Yes

**Yes.** No new domain purchase, no registrar transfer, no nameserver change. Here's why:

- `kowatrade.com`'s DNS zone is already hosted at Sakura's own nameservers (`NS1.DNS.NE.JP` / `NS2.DNS.NE.JP`), and that zone exists independently of which server it currently points to.
- "Migrating the domain" = **editing that same zone's A/AAAA records** so they point at the new VPS IPs instead of the old rental server IP. The domain itself, its registration, and its DNS zone don't move anywhere.
- The zone editor is reached via: 会員メニュー (`https://secure.sakura.ad.jp/menu/`) → **契約中のドメイン一覧** → **ドメインコントロールパネル** → select `kowatrade.com` → **編集**.

**The one hazard**: the current **MX record** points at the apex itself (`10 kowatrade.com.`), not at a dedicated mail hostname. Because of that, flipping the apex A record without first fixing MX would silently redirect inbound mail for `kowa@kowatrade.com` to the new VPS — which runs no mail server. This is handled explicitly in Phase 3 below, *before* the apex is touched.

Confirmed current DNS facts (via live `dig`/`whois`):
```
NS:      NS1.DNS.NE.JP / NS2.DNS.NE.JP
Apex A:  49.212.198.107   (TTL 3600)   → old rental server, aka www2897.sakura.ne.jp / kowa-trade.sakura.ne.jp
www:     CNAME → kowatrade.com
MX:      10 kowatrade.com.
SPF:     v=spf1 a:www2897.sakura.ne.jp mx ~all
```

---

## 3. Pre-migration checklist

- [ ] Confirm the VPS is **started** in the Sakura VPS control panel (new instances ship stopped) and reachable via `ssh ubuntu@49.212.128.17`.
- [ ] Local machine: `npm run build && npm run lint` both pass before anything is pushed/deployed.
- [ ] Collect real values for all required env vars (see `.env.example` / `deployment.md` Step 5): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DIFY_API_KEY`, `DIFY_BASE_URL`, `KOWA_ASSISTANT_TELEGRAM_ENABLED`, `KOWA_ASSISTANT_TELEGRAM_DELIVERY_ENABLED`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BASE_URL`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (must stay `kowa@kowatrade.com`), `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- [ ] **Fix a real gap before first deploy**: `docker-compose.yml` currently only passes through 4 env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DIFY_API_KEY`, `DIFY_BASE_URL`) into the container's `environment:` block. The `SMTP_*`, `TELEGRAM_*`, and `RESEND_API_KEY` vars are **not** wired through, so the contact form and Telegram adapter will silently misbehave in production even with a correct `.env` file. Add the missing vars to `docker-compose.yml`'s `environment:` block before the first `docker compose up --build -d` on the VPS.

---

## 4. Phase 1 — Stand up the new environment

Full command blocks: `deployment.md` Steps 1–6. Summary:

1. **SSH access & hardening** — log in as `ubuntu@49.212.128.17`, `apt update && upgrade`, set up key-based auth, disable password auth.
2. **Firewall** — Sakura packet filter as the perimeter (SSH + a Web/80+443 rule); leave `ufw` inactive to avoid conflicting with the packet filter.
3. **Install Docker CE** (official Docker apt repo for Ubuntu 24.04/noble) — the repo already ships a `Dockerfile` + `docker-compose.yml`, reuse it for local/prod parity.
4. **Get the code onto the server** — code moves via GitHub, not by hand:
   ```bash
   sudo mkdir -p /opt/kowa_website_rag && sudo chown ubuntu:ubuntu /opt/kowa_website_rag
   git clone https://github.com/bitlabsdevteam/kowa_website_rag.git /opt/kowa_website_rag
   cd /opt/kowa_website_rag
   ```
5. **Production `.env`** — create `/opt/kowa_website_rag/.env` (gitignored, never committed) with the values collected in the pre-migration checklist above.
6. **Build & run**:
   ```bash
   cd /opt/kowa_website_rag
   docker compose up --build -d
   curl -I http://127.0.0.1:3000   # confirm the app is listening internally
   ```

---

## 5. Phase 2 — Verify on a staging subdomain

Do **not** touch the live apex yet — validate the whole stack on a throwaway subdomain first.

1. Install Nginx: `sudo apt -y install nginx`.
2. In the ドメインコントロールパネル zone editor, add an **A record for a staging subdomain** (e.g. `new.kowatrade.com`) pointing at `49.212.128.17` — the apex keeps serving the legacy site untouched.
3. Add an Nginx reverse-proxy server block for the staging host:
   ```nginx
   server {
       listen 80;
       server_name new.kowatrade.com;
       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. **Verify the full site** over `http://new.kowatrade.com`: homepage, `/company_profile`, `/access`, `/products`, `/news`, `/contact_us`, the chat widget, `/api/contact` (confirms SMTP relay works end-to-end), `/admin`.
5. **Verify the legacy redirect map** (`next.config.ts` `redirects()`, all 301s):

   | Legacy path | New route |
   |---|---|
   | `/`, `/index.html` | `/` |
   | `/access1.html` | `/access` |
   | `/history1.html` | `/company_profile` |
   | `/new1.html` | `/news` |
   | `/productsindex2.html` | `/products` |
   | `/form1.html` | `/contact_us` |

   ```bash
   curl -I http://new.kowatrade.com/access1.html   # expect 301 → /access, etc.
   ```
6. **Issue TLS for the staging host**:
   ```bash
   sudo apt -y install certbot python3-certbot-nginx
   sudo certbot --nginx -d new.kowatrade.com
   ```

Only proceed to Phase 3 once staging passes every check above.

---

## 6. Phase 3 — Decouple mail before touching the apex

This is the domain-reuse hazard from Section 2, executed. Fully reversible, zero effect on the live website, and safe to do well ahead of the apex cutover.

1. In the zone editor, change the **MX record** from `10 kowatrade.com.` to `10 kowa-trade.sakura.ne.jp.` — the rental server's own stable Sakura-issued hostname (already confirmed to resolve to the same IP as the apex today). Prefer this over a custom `mail.kowatrade.com` record: Sakura keeps `kowa-trade.sakura.ne.jp` pointed at the rental server across any future IP changes on their end.
2. Wait one full TTL cycle (3600s), then send a test email to `kowa@kowatrade.com` from an external account to confirm delivery still works.
3. SPF is unaffected: its `mx` mechanism resolves whatever MX points to, and `kowa-trade.sakura.ne.jp` resolves to the same IP the `mx` mechanism already authorized. (Only touch SPF/DKIM later if outbound relay moves to this stack's `SMTP_HOST` — that's a separate follow-up, not part of this cutover.)

---

## 7. Phase 4 — Cut the apex over

The domain-reuse step itself — only proceed once Phase 2 (staging) passes and Phase 3 (mail decoupling) is confirmed.

1. **Lower the apex TTL** to 300s in the zone editor; wait one full old-TTL period (3600s) before proceeding, to shrink the rollback window to ~5 minutes.
2. **Keep the legacy rental server running** through the entire cutover window — do not stop or decommission it.
3. **Flip the apex DNS**: A → `49.212.128.17`, AAAA → `2403:3a00:202:1204:49:212:128:17`.
4. **Issue the apex TLS cert**, either:
   - re-run `sudo certbot --nginx -d kowatrade.com -d www.kowatrade.com` (brief HTTP-only window while HTTP-01 validates), or
   - pre-issue the cert earlier via a **DNS-01** challenge if a zero-downtime cutover (no HTTP-only window) is required.
5. **Verify externally** (not from the VPS itself):
   ```bash
   dig +short A kowatrade.com          # expect 49.212.128.17
   curl -I https://kowatrade.com       # expect 200 over valid TLS
   curl -I https://www.kowatrade.com
   ```
   Re-check 2–3 redirect-map paths on the live apex.
6. **Rollback plan**: if anything is wrong, re-point the apex A record back to `49.212.198.107` (no legacy AAAA record exists, so nothing to roll back there) — with the lowered TTL this takes effect within minutes.
7. **Restore the apex TTL** to a normal value (e.g. 3600s) a day or two after cutover is confirmed stable.

> Sakura's own VPS hostname `os3-318-48513.vs.sakura.ne.jp` cannot get a public Let's Encrypt cert (Sakura controls that DNS zone) — it's only useful for reachability testing, not for serving the site.

---

## 8. Post-migration checklist

- [ ] Site loads over HTTPS on `https://kowatrade.com` and `https://www.kowatrade.com`.
- [ ] `/api/contact` delivers to `kowa@kowatrade.com`.
- [ ] Chat/assistant responds via Dify.
- [ ] `/admin` inbox loads and shows handoff/queue data.
- [ ] Supabase migrations under `supabase/migrations/` are applied on the external Supabase project, in order: `0001_core.sql → 0002_source_runtime.sql → 0003_v10_multilingual_auth_rag.sql → 0004_v11_assistant_foundation.sql → 0005_v13_handoff_queue.sql → 0006_v14_admin_inbox.sql → 0007_v15_assistant_ops.sql → 0008_v16_telegram_adapter.sql → 0009_v17_news_pipeline.sql`, and that `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` point at that project.

---

## 9. What to keep running after cutover

- **Legacy rental server contract** — prepaid through **2027-03-31** (bank transfer / 12-month lump sum, next billing 2027-03-10, Service Code `112400574564`). **Do not cancel early** — it's the MX target (`kowa-trade.sakura.ne.jp`) and DNS rollback target post-cutover; stopping it doesn't save money before the paid-through date and forfeits the lump sum.
- **VPS trial period** — free through **2026-08-05**; first credit-card charge processes automatically **2026-08-06**. Scale-up (RAM/CPU) is unavailable until the trial ends.

---

## 10. Ongoing update flow (post-migration)

```bash
cd /opt/kowa_website_rag
git pull
docker compose up --build -d
```

---

## References

- `deployment.md` — full command-by-command VPS bootstrap + cutover runbook (source for all steps above).
- `web_hosting.md` — plan rationale (VPS vs. shared hosting) and SMTP relay/SPF/DKIM setup.
- `CLAUDE.md` — canonical hosting spec, required env vars, contact-form email policy.
