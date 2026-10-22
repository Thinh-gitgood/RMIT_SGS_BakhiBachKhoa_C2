[![Built with TideCloak](https://tide.org/badges/built-with-tidecloak.svg)](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked)

## Project overview

_An Emergent Authority vault and collective governance platform where no single administrator, server, or AI agent can unilaterally unlock sensitive records or bypass approval rules._

Built with [TideCloak](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked).

### 1. Vision & originality

<!-- What new product, service, experience or way of working are you proposing? What makes your idea distinctive? -->
We propose a zero-trust, multi-stakeholder governance and data-access vault where cryptographic authority is never held at rest by any central entity or administrator. Instead, authority *emerges* transiently only when user identity, contextual tag policies, and multi-party quorum approvals align.

### 2. Trust constraint insight

<!-- What is difficult, risky or impossible today because trust, privacy or security gets in the way? Explain what becomes possible when that constraint is removed. -->
In traditional platforms, whoever operates the server, database, or admin account possesses unilateral master keys to read private records, alter queues, or bypass rules. Removing this single point of compromise enables cross-organizational collaboration, private record sharing, and high-stakes workflows without exposing a central honeypot.

### 3. Value & impact

<!-- Who would benefit, and how would their lives or work improve? Give a concrete example of why this matters. -->
Users, organizations, and compliance officers gain verifiable sovereignty over shared assets (e.g., patient records, financial approvals, or queue positions). For example, an emergency access exception cannot be quietly forced through by an admin—it mandates a reasoned public proposal and 2-of-3 panel co-signatures.

### 4. Why TideCloak matters

<!-- How does your application use TideCloak, and how does that integration help enable your idea? Connect the technology to the possibility you are demonstrating. -->
Conventional auth only checks whether a server *permits* an action while the server still holds master decryption keys. TideCloak replaces central keys with decentralized Emergent Authority via `@tidecloak/react` (`useTideCloak`, `hasRealmRole`) and tag-bound E2EE (`doEncrypt` / `doDecrypt`), making unilateral administrative overrides mathematically impossible.

### 5. Prototype & storytelling

<!-- What does your prototype demonstrate today? Describe the key interaction judges should look for. -->
Judges can switch between **User / Participant**, **System Admin**, and **Approver Panel**, test the **Attempt both overrides** button to verify that unilateral admin bypasses are blocked, co-sign a **2-of-3 Quorum Request**, and inspect the public, transparent audit trail.

## Setup

<!-- How to install and run the prototype. -->

```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev
# Open http://localhost:5137 in your browser

# 3. (Optional) Run local TideCloak dev container for live authentication
docker run -d -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=password tideorg/tidecloak-dev:latest
# Create your client in the TideCloak admin console and place tidecloak.json in the public/ directory
```
