# Learner accounts and owner dashboard

Live routes after deployment:

- `/#register` — email/password registration with email verification, or Google sign-in.
- `/#login` — learner login.
- `/#profile` — nickname, explorer avatar, 106-mission progress, gems and password-reset email.
- `/#admin` — dedicated owner sign-in and usage dashboard.

The verified Firebase account with email `csunpandian@gmail.com` can read the dashboard. Use **Continue with Google** with that account; no shared or hard-coded admin password exists. A learner cannot become an admin by editing their profile or navigating to the admin URL. Firestore enforces the same owner check as the interface.

## Data and access

Firebase project: `vetri-6cdab`. Default Firestore database: Mumbai (`asia-south1`). The project remains on standard Firebase Authentication; no paid Identity Platform upgrade is needed. Email/password and Google are enabled; `vetri-pi.vercel.app` is authorized.

Each `/learners/{uid}` document stores email, nickname, avatar, completed mission IDs for three levels, supported Level 1 answers, explored chapters, session count and timestamps. Each verified learner can read/write only their own document. The owner can read all learner documents, but cannot edit other learners' progress from the client. Other paths are denied. Points are derived from unique completed mission IDs (10 per mission). This is a learning tracker, not a tamper-proof competitive scoring service.

Guest progress stays in the original browser namespace. Account progress uses separate UID namespaces and merges with Firestore transactions, preserving progress from other devices. Guest points are not automatically claimed by a new account on a shared device. Sign-out flushes pending progress; failed cloud saves show an error and retry option. Account mission completion is retained; missions can be replayed without deleting gems.

The dashboard shows loaded profiles, active profiles in the last seven days, session starts, mission completion by chapter, and searchable learner details. A session starts on opening/reloading a verified account. It does not claim precise study time. It paginates 100 profiles at a time, and labels the scope of totals. Guest analytics are not collected.

## Build and verification

`npm ci` then `npm run build` bundles the Firebase SDK into `dist/accounts.bundle.js`. Vercel uses the checked-in `vercel.json` build/output settings. Firebase's public web configuration is in `accounts/config.js`; no service-account keys or CLI tokens are included in the site.

- `npm test` — all 106 maths answers, experiments, teaching coverage and account model checks.
- `npm run test:rules` — isolated emulator rules tests, including two learners, verified owner, denied role/email escalation, all 106 mission IDs, duplicates and malformed data.
- Local browser account testing uses `http://localhost:4319` with the Authentication emulator on 9099 and Firestore emulator on 8080. That exact localhost port selects the emulator; production URLs always use the real project.

Browser checks cover profile editing, earning/saving gems, reopening, second-learner isolation, safe logout, denied learner admin access, and owner analytics. Test users and test points exist only in the local emulators.

Deploy rules with `firebase deploy --only firestore:rules --project vetri-6cdab`, or the equivalent `node scripts/deploy-rules.cjs` using an authorized Firebase CLI login. `node scripts/deploy-rules.cjs verify` compares deployed source to the tested local file. Setup scripts do not print credentials.
