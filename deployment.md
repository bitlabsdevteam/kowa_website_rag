# Deployment Runbook — Kowa Website RAG on Sakura VPS

Execution runbook for moving this site from your **local machine** to the **already-provisioned** Sakura VPS in `CLAUDE.md`'s "Hosting / Infrastructure" section, and cutting the `kowatrade.com` domain over from its current host (a Sakura *rental server*) to that VPS. `web_hosting.md` explains *why* this plan was chosen (VPS vs. shared hosting, SMTP relay rationale) — this document is the *how*.

> **Status: unverified against the real box.** Commands below are correct per current official Sakura/Docker/Certbot docs as of this writing, but have not yet been run end-to-end on this VPS. Treat this as a checklist to validate on first real deploy, not a proven transcript — update this file with any deviations you hit.

**The shape of the whole job, in order:**
1. **Local machine** — build/lint clean, push to GitHub (Steps 1–2 below are VPS access/firewall; the code itself moves via `git`, see Step 4).
2. **New environment (①  VPS)** — bring the Sakura VPS from "stopped, SSH-only" to "app running on port 3000" (Steps 1–6).
3. **Domain (② Domain Setting)** — point `kowatrade.com`, which is currently attached to a **さくらのレンタルサーバ スタンダード** plan, at the VPS instead, without breaking mail (Step 7).
4. **Go live & operate** — TLS, post-deploy checks, ongoing update flow (Steps 8–9).

---

## Prerequisites — what you already have

### ① Domain — currently on さくらのレンタルサーバ (Standard plan)

| Item | Value |
|---|---|
| Domain | `kowatrade.com` |
| Panel path | さくらのレンタルサーバ スタンダード トップページ → **契約中のドメイン一覧** → **ドメインコントロールパネル** |
| 初期ドメイン (initial/default domain) | `kowa-trade.sakura.ne.jp` |
| ホスト名 (host name) | `www2897.sakura.ne.jp` |
| Confirmed live DNS (via `dig`/`whois`) | NS: `NS1.DNS.NE.JP` / `NS2.DNS.NE.JP` (Sakura's own DNS — no registrar change needed); apex A: `49.212.198.107`; MX: `10 kowatrade.com.`; SPF: `v=spf1 a:www2897.sakura.ne.jp mx ~all` |

`www2897.sakura.ne.jp` and `kowa-trade.sakura.ne.jp` both resolve to `49.212.198.107` — same rental-server box, two names for it. This matters for the MX handling in Step 7.

### ② VPS — new environment

| Item | Value |
|---|---|
| Sakura member ID | `ycs55280` |
| VPS control panel | `https://secure.sakura.ad.jp/vps/` |
| Service | さくらのVPS(v5), **8G plan**, OS03 (Ubuntu 24.04 amd64), 大阪第3 (Osaka Zone 3) |
| Service code | `113801641248` |
| Hostname | `os3-318-48513.vs.sakura.ne.jp` |
| IPv4 | `49.212.128.17` |
| IPv6 | `2403:3a00:202:1204:49:212:128:17` |
| Trial period | Free through **2026-08-06**; official billing starts **2026-08-07** — **scale-up (RAM/CPU) is unavailable during trial** |
| Initial SSH password | Set by whoever completed signup — get this from the client/whoever ran through provisioning. Sakura does not store/reset it; if lost, OS reinstall is the only recovery path. |

**Admin SSH username:** Sakura's own manual states the admin username varies by OS image. For Ubuntu, it is `ubuntu`. If the OS image on this box is ever changed/reinstalled, re-check [Sakura's admin-user login manual](https://manual.sakura.ad.jp/vps/support/info/administrative-userl-login.html) before assuming `ubuntu` still applies.

**There is no VPS-side "add domain" step.** Unlike the rental server (which registers domains into its own control panel under ドメイン/SSL), a VPS is just a raw IP address. You don't register `kowatrade.com` anywhere on the VPS panel — you point DNS at its IP (Step 7) and let Nginx's `server_name` + Certbot handle the rest (Step 7). Don't go hunting for a domain-add screen in the VPS control panel; it doesn't exist there.

Do **not** write the real SSH password, `SMTP_PASS`, `DIFY_API_KEY`, or any other secret into this file or commit it anywhere — env values below are placeholders.

---

## Step 1 — Start the server & first login

1. Log into the VPS control panel (`https://secure.sakura.ad.jp/vps/`). New VPS instances ship **stopped** — start it from the panel before anything else will respond.
2. SSH in as the admin user:
   ```bash
   ssh ubuntu@49.212.128.17
   ```
   Authenticate with the setup password.
3. Immediately harden access:
   ```bash
   sudo apt update && sudo apt -y upgrade
   ```
4. Create an SSH keypair locally (if you don't already have one you want to use) and copy the public key to the server:
   ```bash
   ssh-copy-id ubuntu@49.212.128.17
   ```
5. Disable password auth once key login is confirmed working (test the key login in a **second terminal** before closing your current session):
   ```bash
   sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
   sudo systemctl restart ssh
   ```
6. **Recovery note:** if key-based SSH ever locks you out, use the VPS control panel's **VNC/serial console** to log in directly and fix `sshd_config` — the only other recovery path is a full OS reinstall.

---

## Step 2 — Firewall: Sakura packet filter + in-OS firewall

Sakura VPS ships with the control-panel **packet filter** allowing only SSH inbound. This is separate from any in-OS firewall (e.g. `ufw`) — Sakura's own manual warns the two can behave redundantly/conflict if both are configured independently, so pick one as the primary perimeter.

**Recommended: packet filter as the perimeter, `ufw` left inactive.**

1. In the VPS control panel, open **パケットフィルター設定** (Packet Filter settings) for this server.
2. Confirm the existing SSH rule (keep it — don't lock yourself out).
3. Add a **Web** rule (or custom TCP 80/443) so HTTP/HTTPS traffic reaches the box.
4. Leave `ufw` disabled on the OS side (`sudo ufw status` should show inactive) to avoid the documented double-firewall conflict. If you prefer `ufw` as the primary instead, make the two rule sets match exactly and pick one as the source of truth.
5. If you later change the SSH port from default 22, update the packet filter's custom rule to match — do this *before* restarting `sshd` on the new port.

---

## Step 3 — Runtime: install Docker (primary path)

The repo already ships a `Dockerfile` + `docker-compose.yml` targeting this exact flow (`docker_compose.sh build|up|down` locally) — reuse it in production for local/prod parity.

```bash
# Official Docker apt repo, Ubuntu 24.04 (noble)
sudo apt -y install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Run docker without sudo
sudo usermod -aG docker ubuntu
# log out/in (or `newgrp docker`) for group change to take effect

docker --version
docker compose version
```

**Alternative (not the default path):** bare Node 22 LTS + PM2/systemd, if you'd rather avoid the Docker daemon. Not covered in detail here since the repo's own tooling assumes Docker Compose.

---

## Step 4 — Get the code from your local machine onto the server

This is the actual "local → new environment" path — the app doesn't get copied by hand, it goes through GitHub:

1. **On your local machine**, before pushing anything you intend to deploy:
   ```bash
   npm run build && npm run lint
   ```
   Fix anything that fails here — don't push broken code and debug it on the server.
2. Commit and push to the branch/remote this repo deploys from (`git push`).
3. **On the VPS**, clone the repo the first time:
   ```bash
   sudo mkdir -p /opt/kowa_website_rag
   sudo chown ubuntu:ubuntu /opt/kowa_website_rag
   git clone https://github.com/bitlabsdevteam/kowa_website_rag.git /opt/kowa_website_rag
   cd /opt/kowa_website_rag
   ```

Kept manual (git clone + pull) for v1. A GitHub Actions deploy pipeline is a reasonable future improvement but out of scope here. Subsequent updates just repeat "push locally → `git pull` on the server" — see Step 9.

---

## Step 5 — Production `.env`

Create `/opt/kowa_website_rag/.env` (never committed — already gitignored) with the vars required by `CLAUDE.md` / `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DIFY_API_KEY=
DIFY_BASE_URL=

KOWA_ASSISTANT_TELEGRAM_ENABLED=true
KOWA_ASSISTANT_TELEGRAM_DELIVERY_ENABLED=false
TELEGRAM_WEBHOOK_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BASE_URL=https://api.telegram.org

RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=kowa@kowatrade.com

# Sakura mailbox SMTP relay — see web_hosting.md for SPF/DKIM/DMARC setup
SMTP_HOST=smtp.sakura.ne.jp
SMTP_PORT=587
SMTP_USER=noreply@kowatrade.com
SMTP_PASS=
SMTP_FROM="Kowa Trade and Commerce <kowa@kowatrade.com>"
```

Fill in real values from the Supabase project, Dify workspace, Telegram bot, and Sakura mailbox — do not repoint `CONTACT_TO_EMAIL` away from `kowa@kowatrade.com`.

---

## Step 6 — Build & run

```bash
cd /opt/kowa_website_rag
docker compose up --build -d
```

Notes:
- The repo's `docker_compose.sh` script is a **local-dev convenience** — its port-3000-kill logic exists for iterating locally, not needed (and shouldn't be run blindly) on the server. Use plain `docker compose` commands in production.
- Confirm the container is listening internally on port `3000`:
  ```bash
  curl -I http://127.0.0.1:3000
  ```

---

## Step 7 — Staged verification before touching live DNS

**`kowatrade.com` is a live production site today** (the legacy site referenced in `CLAUDE.md`), running on an older Sakura shared rental server, distinct from this VPS. Do not cut the apex domain over until the new stack is verified end-to-end on this VPS.

**How to reach the DNS zone editor** (the panel path from the ① Domain prerequisites above, one level deeper):
会員メニュー (`https://secure.sakura.ad.jp/menu/`) → **契約中のドメイン一覧** → **ドメインコントロールパネル** → select `kowatrade.com` → open its zone → **編集** (edit). This panel manages A/AAAA/CNAME/MX/NS/TXT/CAA records for any domain on Sakura's own nameserver service — which `kowatrade.com` already is (confirmed by the NS lookup above). The rental server auto-generated this zone when the domain was attached to it; you're editing that existing zone, not creating a second one.

**Confirmed DNS facts** (via `dig`/`whois`, so this is no longer a TODO):
```
NS:      NS1.DNS.NE.JP / NS2.DNS.NE.JP   → zone is already hosted at Sakura's own DNS — no registrar/NS change needed
Apex A:  49.212.198.107   (TTL 3600)      → the rental server, reachable as both www2897.sakura.ne.jp and kowa-trade.sakura.ne.jp
www:     CNAME → kowatrade.com → same IP
MX:      10 kowatrade.com.                → mail shares the apex A record — this is the main risk, see below
SPF:     v=spf1 a:www2897.sakura.ne.jp mx ~all
```

**Mail must be decoupled from the apex before any A-record change.** Because MX points at `kowatrade.com` itself rather than a dedicated mail hostname, flipping the apex A record would silently redirect inbound mail for `kowa@kowatrade.com` to a box running no mail server:
1. In the zone editor, change the MX record from `10 kowatrade.com.` to `10 kowa-trade.sakura.ne.jp.` — the rental server's own Sakura-issued hostname, confirmed above to resolve to the same IP as the apex today. Prefer this over inventing a custom `mail.kowatrade.com` record: Sakura keeps `kowa-trade.sakura.ne.jp` pointed at the rental server across any future IP changes on their end, so this stays correct without maintenance.
2. Wait a full TTL cycle (3600s), then send a test email to `kowa@kowatrade.com` from an external account to confirm delivery still works.
3. SPF is unaffected: its `mx` mechanism resolves whatever the MX record points to, and `kowa-trade.sakura.ne.jp` resolves to the same IP the `mx` mechanism already authorized. Only touch SPF/DKIM later if outbound relay moves to this stack's `SMTP_HOST` (see `web_hosting.md`); that's a separate follow-up, not part of this cutover.

This step is fully reversible, has zero effect on the website, and can be done well ahead of the web cutover date.

1. **Install Nginx**:
   ```bash
   sudo apt -y install nginx
   ```
2. **Stand up a staging host first** — point DNS for a subdomain (e.g. `new.kowatrade.com` or `staging.kowatrade.com`) at `49.212.128.17`, while the apex continues serving the legacy site, using the ドメインコントロールパネル zone editor above (add an A record for the subdomain, don't touch the apex yet).
3. Add an Nginx server block for the staging host, proxying to the app:
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
4. **Verify the full site over plain HTTP** on the staging host: homepage, `/company_profile`, `/access`, `/products`, `/news`, `/contact_us`, chat widget, `/api/contact` (confirms SMTP relay works), `/admin`. Also confirm the legacy redirect map (`next.config.ts` `redirects()`) works: `curl -I http://new.kowatrade.com/access1.html` etc. should 301 to the corresponding new path for every row in the table below.

   | Legacy path | New route |
   |---|---|
   | `/`, `/index.html` | `/` |
   | `/access1.html` | `/access` |
   | `/history1.html` | `/company_profile` |
   | `/new1.html` | `/news` |
   | `/productsindex2.html` | `/products` |
   | `/form1.html` | `/contact_us` |

5. **Issue TLS for the staging host**:
   ```bash
   sudo apt -y install certbot python3-certbot-nginx
   sudo certbot --nginx -d new.kowatrade.com
   ```
   HTTP-01 validation works fine here since the subdomain already resolves to the box.
6. **Only after staging passes and mail has been decoupled from the apex** (see the MX section above):
   1. **Lower the apex TTL** to 300s in the ドメインコントロールパネル zone editor, and wait one full old-TTL period (3600s) before proceeding — this shrinks the propagation/rollback window to ~5 minutes.
   2. **Keep the legacy rental server running and serving** through the entire cutover window — do not stop/decommission it yet.
   3. Flip the **apex** DNS (A → `49.212.128.17`, AAAA → `2403:3a00:202:1204:49:212:128:17`) in the same zone editor.
   4. Issue the apex cert, either:
      - re-run `certbot --nginx -d kowatrade.com -d www.kowatrade.com` (brief HTTP-only window while HTTP-01 validates), or
      - pre-issue the apex cert earlier via a **DNS-01** challenge if a zero-downtime cutover (no HTTP-only window) is required.
   5. **Verify externally** (not from the VPS itself): `dig +short A kowatrade.com` shows the new IP, `curl -I https://kowatrade.com` and `https://www.kowatrade.com` return 200 over valid TLS, and 2–3 redirect-map paths resolve correctly on the live apex.
   6. **Rollback plan**: if anything is wrong, re-point the apex A record back to the legacy IP `49.212.198.107` (there is no legacy AAAA record, so nothing to roll back there) — with the lowered TTL this takes effect in minutes.
   7. Only after external verification passes, decommission/stop the legacy rental server contract.
   8. Restore the apex TTL to a normal value (e.g. 3600s) a day or two after cutover is confirmed stable.

> Sakura's own hostname `os3-318-48513.vs.sakura.ne.jp` cannot get a Let's Encrypt cert for public use (Sakura controls that DNS zone) — it's only useful for reachability testing (`curl`/SSH), not for serving the site.

---

## Step 8 — Process resilience & post-deploy checklist

- `docker compose` with the existing `docker-compose.yml` restarts containers per its restart policy; confirm the Docker daemon itself is enabled on boot:
  ```bash
  sudo systemctl enable docker
  ```
- **Supabase readiness**: confirm the external Supabase project has all migrations under `supabase/migrations/` applied, in order:
  `0001_core.sql → 0002_source_runtime.sql → 0003_v10_multilingual_auth_rag.sql → 0004_v11_assistant_foundation.sql → 0005_v13_handoff_queue.sql → 0006_v14_admin_inbox.sql → 0007_v15_assistant_ops.sql → 0008_v16_telegram_adapter.sql → 0009_v17_news_pipeline.sql`
  and that `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` point at that project. If migrations are behind, the admin inbox, Telegram adapter, and news pipeline will partially break even though the marketing pages render fine.
- **Post-deploy checklist**: site loads over HTTPS on the live domain; `/api/contact` delivers to `kowa@kowatrade.com`; chat/assistant responds via Dify; `/admin` inbox loads and shows handoff/queue data.

---

## Step 9 — Ongoing ops

- **Deploying an update**:
  ```bash
  cd /opt/kowa_website_rag
  git pull
  docker compose up --build -d
  ```
- **Trial period**: free through **2026-08-06**; converts to a paid contract automatically starting **2026-08-07**. Scale-up (more RAM/CPU) is unavailable until the trial ends — if the site needs more headroom before then, that upgrade has to wait.
- **Backups**: there's no managed database on this box — Supabase holds persistent data externally. The main backup surface here is the production `.env` file (and any locally stored uploads, if added later); keep a secure copy of `.env` outside the server (e.g. a password manager or encrypted secrets store), since it's gitignored and exists nowhere else.
- **SSH lockout recovery**: if key-only SSH ever locks you out after Step 1, use the VPS control panel's VNC/serial console to log in directly — the only alternative is a full OS reinstall.

---

## Sources
- [Sakura VPS — administrative user login](https://manual.sakura.ad.jp/vps/support/info/administrative-userl-login.html)
- [Sakura VPS — packet filter manual](https://manual.sakura.ad.jp/vps/network/packetfilter.html)
- [Sakura VPS — packet filter feature overview](https://vps.sakura.ad.jp/feature/packetfilter.html)
- [Docker Engine install — Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Certbot — Nginx on Ubuntu](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)
- [ドメインコントロールパネルについて知りたい](https://help.sakura.ad.jp/domain/2712/) — what the domain control panel manages and how to reach it
- [ドメインのゾーン情報を編集したい](https://help.sakura.ad.jp/domain/2302/) — zone editor navigation and record types (A/AAAA/CNAME/MX/TXT), incl. the "don't re-register an auto-generated zone" note
- [独自ドメインを利用する際のDNSレコードを知りたい](https://help.sakura.ad.jp/domain/2865/) — rental-server auto-generated record patterns (MX target format, SPF)
- See also: `web_hosting.md` (plan rationale, SMTP/SPF/DKIM setup), `CLAUDE.md` (canonical spec/env-var reference)

> Note: the FAQ topic-index links originally supplied (`faq.sakura.ad.jp/s/topic/...`) are Salesforce-backed pages that render client-side and returned only a loading shell to automated fetches — the specific `help.sakura.ad.jp` articles above (found via search) were used instead and cross-checked against live `dig`/`whois` output for this domain.
