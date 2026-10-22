[![Built with TideCloak](https://tide.org/badges/built-with-tidecloak.svg)](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked)

# ScholarLock

_A zero-trust academic IP vault where no rogue co-author, university administrator, or cloud server can unilaterally steal, decrypt, or commercialize shared research breakthroughs._

## Vision & originality
ScholarLock introduces **cryptographic co-ownership** for university capstone and research teams. High-value assets (`research_paper_final.pdf`, `brain_cancer_model.pth`, `confidential_patient_dataset.csv`) are protected in an **Emergent Authority** vault where decryption and commercialization authority never exists at rest—emerging transiently only when co-author identities, tag policies, and quorum signatures align.

## Trust constraint insight
Today, collaborative research is held back by insider theft and centralized custody: any teammate with drive access can secretly exfiltrate code or sell AI weights, while university IT admins hold master keys to unpublished IP. Removing unilateral control lets researchers collaborate on sensitive datasets and proprietary models without trusting a central operator or risking a single rogue insider.

## Value & impact
Student innovators, co-researchers, and university incubators gain verifiable sovereignty over joint IP. If a rogue member ("Charlie") attempts to unilaterally export the team's brain-cancer AI model to a corporate buyer, ScholarLock blocks the theft (`1 of 3 shards`) and enables an ethics-arbitrated dispute quorum so honest co-authors are never deadlocked.

## Why TideCloak matters
Conventional RBAC only checks if a server *permits* an action while the server still holds plaintext keys. ScholarLock uses TideCloak (`@tidecloak/react`, `useTideCloak`, `hasRealmRole`, and tag-bound E2EE `doEncrypt`/`doDecrypt`) to keep storage cryptographically blind (`AES-256-GCM`), making unilateral insider or admin overrides mathematically impossible.

## Prototype & storytelling
Judges can test two contrasting flows:
1. **Rogue & Admin Attack (Blocked):** Click Charlie’s **Attempt Unilateral IP Export** (`403 UNILATERAL_EXFILTRATION_BLOCKED` — `1/3` shards) and verify in **Blind Server View** that IT admins see only ciphertext (`0/3` shards).
2. **Emergent Authority Release (Unlocked):** Alice, Bob, and Supervisor Dr. Nguyen co-sign a **3-of-3 Quorum** to revoke Charlie’s shard, unlock the encrypted IP bundle, and issue a verified release certificate.

---

## Setup & Demo Guide

### Quick Start (Works Immediately Out-of-the-Box)

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev
# Open http://localhost:5137 in your browser
```

### Hybrid TideCloak Integration
ScholarLock uses a **Hybrid TideCloak Architecture** designed for both frictionless judge evaluation and live decentralized authentication:
- **Zero-Friction Judge Mode (Default):** Runs out-of-the-box without requiring Docker setup. Interactive role switching lets judges immediately test TideCloak policy enforcement, tag-bound E2EE (`TIDE_E2EE_V1` / `AES-256-GCM`), and 3-of-3 emergent authority quorum flows.
- **Live TideCloak Mode (`@tidecloak/react`):** When `public/tidecloak.json` is configured against a running TideCloak instance, ScholarLock binds directly to live `useTideCloak()` hooks (`login`, `logout`, `authenticated`, `hasRealmRole`, `doEncrypt`, `doDecrypt`).

```bash
# (Optional) Launch a local TideCloak container for live OIDC + E2EE authentication
docker run -d -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=password \
  tideorg/tidecloak-dev:latest
# Export your client adapter config from http://localhost:8080 and place it at public/tidecloak.json
```

### Demo Actors & Protected IP Assets

| Actor / Asset | Role / Type | Authority / Tag Policy | Custody Status |
| :--- | :--- | :--- | :--- |
| **Alice (AI Lead)** | Co-Author (`co-author`) | Holds **Shard 1/3** | Authorized for working previews; requires 3/3 quorum for full IP export |
| **Bob (Data Engineer)** | Co-Author (`co-author`) | Holds **Shard 2/3** | Authorized for working previews; requires 3/3 quorum for full IP export |
| **Charlie (Rogue Insider)** | Co-Author (`co-author`) | Holds **Shard 3/3** (Revocable on breach) | Blocked from unilateral IP export (`403 UNILATERAL_EXFILTRATION_BLOCKED`) |
| **Dr. Nguyen (Ethics Chair)** | Academic Supervisor (`ethics-arbitrator`) | Conditional **Arbitration Shard (3/3)** | Can co-sign only when an immutable breach log proves insider misconduct |
| **RMIT IT Admin / Server** | Infrastructure Operator (`sysadmin`) | Holds **0/3 Shards** | **Blind Storage** — sees only `AES-256-GCM` ciphertext (`no Master Key`) |
| `research_paper_final.pdf` | IEEE Manuscript Draft | Tag: `ip-paper` | E2EE Locked (`TIDE_E2EE_V1[ip-paper]`) |
| `brain_cancer_model.pth` | Proprietary AI Weights (96.4% Acc) | Tag: `ip-weights` | E2EE Locked (`TIDE_E2EE_V1[ip-weights]`) |
| `confidential_patient_dataset.csv` | 1,200 Clinical Records | Tag: `ip-dataset` | E2EE Locked (`TIDE_E2EE_V1[ip-dataset]`) |

### 3 Key Demo Interactions to Test
1. **Flow 1 — Rogue Insider Exfiltration Blocked (`Rogue Insider - Charlie` tab):**
   Click **"🚨 Charlie: Attempt Unilateral IP Export (Sell to Company)"**. TideCloak immediately blocks the request with `403 UNILATERAL_EXFILTRATION_BLOCKED` (`1 of 3 shards`) and records an immutable breach event in the Audit Log.
2. **Flow 2 — Blind Server & Admin Override Blocked (`Blind Server / IT Admin` tab):**
   Inspect the raw database state to verify all 3 assets are stored strictly as `TIDE_E2EE_V1` ciphertext. Click **"⛔ Attempt Admin Master Override"** to confirm infrastructure operators hold `0 of 3 shards` (`403 ZERO_CUSTODY_ENFORCED`).
3. **Flow 3 — 3-of-3 Emergent Authority Quorum (`Quorum & Dispute Panel` tab):**
   Following Charlie's logged breach, assemble the **3-of-3 Key Shards** from **Alice (Shard 1)**, **Bob (Shard 2)**, and **Dr. Nguyen (Ethics Arbitration Shard 3)**. Watch the decryption authority emerge transiently in-browser (`doDecrypt`) to unlock all 3 plaintext IP assets and generate the **Verified IP Release Certificate**.
