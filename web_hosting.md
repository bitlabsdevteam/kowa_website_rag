# Sakura Internet Hosting Plan — Kowa Trade Website

## TL;DR recommendation

| Need | Sakura product | Minimum plan | Why |
|---|---|---|---|
| App runtime (Next.js SSR + API routes) | **さくらのVPS** (VPS) | **2GB plan** (3 vCPU / 2GB RAM / 100GB SSD) | This app is *not* static — see "Why not shared rental server" below |
| Contact-form SMTP relay | **さくらのメールボックス** (mail-only add-on) | Cheapest tier (~¥110/mo, 12-month term) | Gives you an authenticated `smtp.sakura.ad.jp` account without needing a full mail-hosting rental server |
| Domain | Existing (or さくらのドメイン if new) | — | Point DNS A record at the VPS, MX at the mailbox service |

Estimated minimum recurring cost: **~¥1,850–¥2,100/month** (VPS 2GB + mailbox), before domain renewal and TLS (TLS is free via Let's Encrypt on the VPS).

---

## Why not Sakura's shared "rental server" (さくらのレンタルサーバ)

Sakura's shared hosting plans (Lite / Standard / Business) are built for static sites and PHP apps. They explicitly:

- **Prohibit long-running/resident processes.** A Next.js production server (`next start`, or any Node process that stays alive to serve SSR pages and API routes) is exactly the kind of resident process they forbid — it can be killed without notice if flagged.
- **Don't officially support Node.js.** SSH is available on Standard-and-up plans and you *can* manually install Node.js, but Sakura explicitly does not support or guarantee it — it's a hobbyist workaround, not something to run a client-facing B2B site on.

This project needs a real Node runtime because it has:
- SSR / App Router pages (not exportable as static HTML — the site uses dynamic routes, locale negotiation, and server components)
- API routes that must run server-side: `app/api/chat`, `app/api/assistant`, `app/api/ingest`, `app/api/news`, `app/api/telegram`, `app/api/admin`, `app/api/runtime`
- A Telegram webhook adapter and an admin inbox — both require a persistent, addressable server process, not a static file host

**Conclusion:** you need **さくらのVPS** (or Sakura's managed container/App Run product, if you want to avoid OS maintenance — see optional note below), not the shared レンタルサーバ line.

---

## Recommended VPS spec

**さくらのVPS 2GBプラン**

| Spec | Value |
|---|---|
| vCPU | 3 core |
| Memory | 2GB |
| Storage | 100GB SSD |
| Transfer | Unlimited |
| Price | ~¥1,738–¥1,958/mo (tax incl., varies by region/term; cheaper with 12-month prepay) |

Why 2GB and not the cheaper 512MB/1GB tiers:
- `next build` (production build) commonly spikes well past 512MB–1GB RAM, especially with React 19 + Three.js/`@react-three/fiber` in the bundle. On the 512MB/1GB plans the build itself is likely to OOM.
- Even if you build in CI and only `next start` on the box, you still need headroom for: the Node process, PM2 (process manager) or Docker daemon, Nginx/Caddy reverse proxy, and OS overhead — 1GB leaves almost nothing spare for traffic spikes or a second deploy running side-by-side during zero-downtime releases.
- The 2GB plan's 3 vCPU also lets Next.js's image optimization and SSR handle concurrent requests without the app becoming the bottleneck.

If budget is the primary constraint and you're comfortable building exclusively in CI/CD (e.g., GitHub Actions) and only running the built `.next` output + `next start` on the box, the **1GB plan** is a viable fallback — but 2GB is the safer minimum for a client-facing site with an admin console and a chatbot.

### What runs on the VPS
- Node.js (LTS, matching `package.json` engine requirement — check `next` major version compatibility)
- Reverse proxy (Nginx or Caddy) terminating TLS via Let's Encrypt, proxying to `next start` (or a Docker container, since the repo already has `docker compose up --build` for the local stack — you can reuse that Compose file in production with a prod env file)
- Process supervision: PM2, systemd unit, or Docker Compose `restart: unless-stopped`
- Firewall: only 80/443 (and 22 for SSH, ideally key-only + non-default port or Sakura's packet filter) exposed

Supabase and Dify remain **external SaaS** — the VPS only needs outbound HTTPS to reach them, no local database or vector store to host.

---

## SMTP for the contact form

Do **not** try to send mail directly from the VPS's own IP with a bare Node `nodemailer` + port 25 setup — Sakura VPS (like most cloud providers) blocks or heavily restricts outbound port 25 (OP25B) to fight spam, and an unauthenticated/unverified sending IP will get flagged by receiving mail servers (SPF/DKIM/reputation issues).

Instead, use Sakura's own mailbox product as an **authenticated SMTP relay**:

1. Add **さくらのメールボックス** (mail-only service, separate from the VPS) — cheapest tier is enough since you only need 1 mailbox for the relay account (e.g. `noreply@kowatrade.com` or `contact@kowatrade.com`).
2. Point your domain's MX record at that mailbox service (only if you also want to *receive* replies there — if a different system already receives mail for the domain, you can skip MX and just use the mailbox purely for outbound SMTP auth).
3. From the Next.js API route handling the contact form (`app/api/...`), send via `smtp.sakura.ad.jp:587` using SMTP AUTH (STARTTLS) with `nodemailer` or similar, using the mailbox's username/password as env vars.

### What you need to tell Sakura / set up in their control panel

1. **A domain** already delegated to Sakura's DNS (or willing to add the DNS records they give you) — needed for SPF/DKIM to validate against your sending domain.
2. Sign up for **さくらのメールボックス**, and inside it create a mail account under your domain, e.g. `noreply@kowatrade.com`.
3. Ask Sakura (or configure yourself in the panel) to add:
   - **SPF record**: `v=spf1 include:_spf.sakura.ne.jp ~all` (exact include host per Sakura's current docs — confirm in the mailbox control panel, it's shown there)
   - **DKIM**: enable DKIM signing for the domain in the mailbox control panel; add the generated DKIM TXT record to your DNS
   - **DMARC** (recommended, optional but improves deliverability): a `_dmarc` TXT record, e.g. `v=DMARC1; p=quarantine; rua=mailto:you@kowatrade.com`
4. Note the **SMTP connection details** they issue:
   - Host: `smtp.sakura.ad.jp`
   - Port: `587` (STARTTLS) — do not use 25
   - Auth: username = full mail address (or the mailbox login ID they assign), password = the mailbox password
5. Confirm **outbound send-rate limits** on the mailbox plan you pick (shared mail infra typically caps messages/hour to control abuse) — ask support what the cap is on the tier you choose, since contact-form volume plus any transactional mail (e.g. admin notifications) needs to stay under it.

### Env vars to add (per this repo's convention — never commit these)
```
SMTP_HOST=smtp.sakura.ad.jp
SMTP_PORT=587
SMTP_USER=noreply@kowatrade.com
SMTP_PASS=<mailbox password>
SMTP_FROM="Kowa Trade and Commerce <noreply@kowatrade.com>"
```

---

## Deployment notes specific to this repo

- `npm run build` then `npm run lint` should both pass in CI before deploying to the VPS.
- The repo already has a `docker compose up --build` path for the local stack — reusing that Compose setup on the VPS (rather than a bare `next start` + PM2) keeps parity between local/dev and prod and simplifies zero-downtime restarts.
- Required env vars per `CLAUDE.md` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DIFY_API_KEY`, `DIFY_BASE_URL`) plus the new `SMTP_*` vars above must be set on the VPS via a `.env` file outside version control, or Sakura VPS's secret/env mechanism if using their managed container product.
- TLS: use Let's Encrypt (via Caddy's automatic HTTPS, or `certbot` + Nginx) — no extra cost, renews automatically.

## Optional: lower-ops alternative

If you'd rather not manage OS patching/security on a raw VPS, Sakura also offers **さくらのクラウド (SAKURA Cloud)**, which has managed container/app-run style products with similar entry pricing to the VPS line. It's worth a look if you want auto-scaling or don't want to own systemd/Nginx config — but for a single marketing site with predictable B2B traffic, the VPS 2GB plan above is the simpler, cheaper baseline and is what this document recommends starting with.

---

## Sources
- [さくらのレンタルサーバでNode.jsは利用できますか](https://faq.sakura.ad.jp/s/article/000001892)
- [料金・仕様一覧｜VPS（仮想専用サーバー）はさくらインターネット](https://vps.sakura.ad.jp/specification/)
- [セキュリティ対策を強化したメールサーバー専用プラン](https://rs.sakura.ad.jp/plan/mail/)
- [メールソフト（メーラー）の設定内容を知りたい](https://help.sakura.ad.jp/mail/2114/)
