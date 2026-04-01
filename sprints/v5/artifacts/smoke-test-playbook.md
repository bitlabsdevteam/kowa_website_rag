# v5 Smoke-Test Playbook

## 1. Landing and top navigation
1. Open `/`.
2. Confirm heading `Kowa Trade & Commerce` is visible.
3. Confirm top menu links resolve to real routes.
4. Confirm CTA `Ask the assistant` is visible.

## 2. Login and admin auth gate
1. Open `/login`.
2. Confirm heading `Admin login` appears with email/password fields.
3. Open `/admin` as logged-out user.
4. Confirm `Admin authentication required` appears.

## 3. Grounded chat trust UX
1. Return to `/#assistant`.
2. Click prompt `When was Kowa established?`.
3. Confirm grounded status appears.
4. Confirm citation card renders metadata (domain/source host).
5. Ask unsupported question: `Quantum lettuce orbital tariff`.
6. Confirm no-answer recovery guidance is shown.

## 4. Runtime health and eval gate
1. Request `/api/runtime/health` and confirm required env list is returned.
2. Run `npm run eval:retrieval`.
3. Confirm summary `pass: true` before release.
