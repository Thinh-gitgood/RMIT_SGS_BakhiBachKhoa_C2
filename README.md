[![Built with TideCloak](https://tide.org/badges/built-with-tidecloak.svg)](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked)

## Project overview

_An Emergent Authority vault and multi-party approval platform where no single administrator, server, or operator can unilaterally unlock sensitive records or override governance rules._

Built with [TideCloak](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked).

### 1. Vision & originality

<!-- What new product, service, experience or way of working are you proposing? What makes your idea distinctive? -->
We propose a multi-stakeholder governance and data-access platform where sensitive records and exception approvals require collective 2-of-3 quorum consensus rather than trusting a single system administrator.

### 2. Trust constraint insight

<!-- What is difficult, risky or impossible today because trust, privacy or security gets in the way? Explain what becomes possible when that constraint is removed. -->
In conventional web applications, whoever holds the backend admin role or database key can unilaterally reorder queues, bypass rules, or read private records. Removing unilateral admin power allows participants, specialists, and organizations to collaborate without a single point of compromise.

### 3. Value & impact

<!-- Who would benefit, and how would their lives or work improve? Give a concrete example of why this matters. -->
Patients, students, and organizations gain verifiable fairness and privacy. For example, an emergency access exception or queue override cannot be quietly granted by a single administrator—it requires a public reason and 2-of-3 panel sign-off.

### 4. Why TideCloak matters

<!-- How does your application use TideCloak, and how does that integration help enable your idea? Connect the technology to the possibility you are demonstrating. -->
TideCloak provides keyless authentication (`useTideCloak`), realm role verification (`hasRealmRole`), and tag-bound end-to-end encryption (`doEncrypt` / `doDecrypt`) backed by Emergent Authority so that authority only emerges when identity, policy, and quorum align.

### 5. Prototype & storytelling

<!-- What does your prototype demonstrate today? Describe the key interaction judges should look for. -->
Judges can switch between **User / Participant**, **System Admin**, and **Approver Panel**, test **Attempt both overrides** to see unilateral admin actions blocked, and co-sign a **2-of-3 Quorum Request** with a public audit trail.

## Setup

```bash
cd "tidecloak-starter-kit"
# Start local TideCloak dev container (optional for live login)
docker run -d -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=password tideorg/tidecloak-dev:latest
# Open http://localhost:8080/, create new app, set URIs, download tidecloak.json to the public/ folder
# Install dependencies and start Vite dev server
npm.cmd install
npm.cmd run dev
# Open http://localhost:5137/
```
