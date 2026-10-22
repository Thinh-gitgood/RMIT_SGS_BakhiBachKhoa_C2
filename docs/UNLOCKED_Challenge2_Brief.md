# UNLOCKED — RMIT x Tide Hackathon, Challenge 2

> Source: https://tide.org/unlocked/#challenge
> Challenge 2 of the RMIT hackathon · RMIT | Tide · 2026
> Tagline: **What would you build if trust stopped being the bottleneck?**
> Build a small working prototype with **TideCloak** integrated that shows one compelling possibility.
> No cybersecurity or cryptography experience needed.

---

## Quick Reference (TL;DR for agents)

- **Goal:** Build a small working prototype with TideCloak integrated, demonstrating ONE new possibility that exists because no single admin, organisation, or AI can unilaterally override the rules protecting people's data and decisions.
- **Data:** Use synthetic data and mocked systems.
- **Deliverables (both in a public GitHub repo):**
  1. Public GitHub repository: working prototype code + demo video (`.mp4`, under 100 MB, ~2 minutes).
  2. README project overview at the top of the README: one-sentence description + answers to 5 prompts, **300 words or fewer**. Setup instructions go in a separate section.
- **Submission:** Submit the repository link via the Google Form.
- **Deadline:** Melbourne: Fri, 23 Oct, 10:00 am AEDT · Vietnam: Thu, 22 Oct, 6:00 pm · Malaysia: Thu, 22 Oct, 6:00 pm.
- **Key judging test:** If the app would work exactly the same with ordinary login and backend permissions, develop the idea further. TideCloak should change what it can credibly do.
- **You don't need a finished product.** Focus on one convincing demonstration.

---

## 01. Your Mission

**Build what's possible, without a trust bottleneck.**

Some of our biggest ideas ask us to give someone too much power. Hospitals could discover more together, but who controls the shared records? AI could do more for us, but how much access should it have? Communities could govern shared resources, but who gets the final say?

Choose a possibility held back by that trade-off. Build a prototype using TideCloak where no single administrator, organisation or AI can unilaterally override the rules protecting people's data and decisions. Show how that changes what your app makes possible.

Bring a working prototype with TideCloak integrated. Demonstrate one new possibility and explain why removing unilateral control makes it possible.

---

## 02. Your Tool: TideCloak

TideCloak is a drop-in system for user authentication, permissions and data protection.

It uses **Emergent Authority** to let your app perform sensitive actions without giving any one administrator, server or vendor the power to override its protections on their own.

## 03. Your New Superpower: Emergent Authority

**Authority for an action, with no master key to keep.**

In a conventional system, someone or something ultimately holds the power to unlock data, approve access or change the rules. Emergent Authority means nobody holds that power alone. It only emerges when the right **identity**, **policy** and **approvals** line up.

---

## Four Steps from Idea to Demo

### 1. Choose a possibility
Pick something useful that a trust, privacy or security constraint holds back today.
- Browse example ideas (see "Example Ideas" below)
- Test it with Hackbot

### 2. Connect your coding agent
Add Tide's MCP server to your AI coding agent. It gives the agent the tools and instructions to integrate TideCloak into your app.
- Works with Claude Code, Cursor, VS Code and other MCP-compatible agents.
- MCP not cooperating? Use the TideCloak Quickstart (Plan B).

### 3. Build with TideCloak
Describe your app and its rules to your agent. Build a small prototype with TideCloak integrated, using synthetic data and mocked systems.

### 4. Demo and submit
Show the new possibility working, and TideCloak's role in it. Record your two-minute video and prepare your repository.

> You don't need a finished product. Focus on one convincing demonstration.

---

## Build Kit

### Connect your coding agent to Tide's MCP
Connect Tide's MCP server to your AI coding agent, then describe your app and how access should work. The server gives your agent the integration tools and instructions; TideCloak provides the protections in the app it builds.

Works with Claude Code, Cursor, VS Code and other MCP-compatible agents.

### Plan B: MCP giving you trouble, or prefer to go old-school?
Start from the **TideCloak Quickstart**. It sets up a working template site with TideCloak already integrated, and you build your idea on top. It works with any model or editor, or with no AI at all.

### Resources: Build with TideCloak
- **TideCloak overview** — What TideCloak gives your app, in plain terms.
- **TideCloak documentation** — Background and reference for when you want the detail.

### Resources: Understand the challenge
- **Tide blog (Start here): "Beyond cybersecurity: how to think about Emergent Authority"** — The best explanation of Emergent Authority, and the kinds of products it opens up.
- **Tide blog: "How Tide works: the RMIT presentation"** — More inspiration: Emergent Authority in the AI era.

### Hackbot, the UNLOCKED assistant
Bounce your idea off Hackbot. Explore what Emergent Authority could make possible, and sharpen your demo and README. For code, ask your coding agent with Tide's MCP.

---

## Submit: What to Submit

Two things, both in your GitHub repository. Submit the repository link through the Google Form.

**Industry challenge submission deadline**
- Melbourne: Fri, 23 Oct, 10:00 am AEDT
- Vietnam: Thu, 22 Oct, 6:00 pm
- Malaysia: Thu, 22 Oct, 6:00 pm

### 1. A public GitHub repository
The code for your working prototype, with TideCloak integrated, plus your demo video. Set the repository to **public**.

**Required: README project overview.** Copy the template to the top of your README, add a one-sentence description, then answer the five prompts. They match the judging criteria.

Keep it to **300 words or fewer**. Short paragraphs or bullet points are fine. Put setup instructions in a separate section.

#### README prompts

1. **Vision & originality**
   What new product, service, experience or way of working are you proposing? What makes your idea distinctive?

2. **Trust constraint insight**
   What is difficult, risky or impossible today because trust, privacy or security gets in the way? Explain what becomes possible when that constraint is removed.

3. **Value & impact**
   Who would benefit, and how would their lives or work improve? Give a concrete example of why this matters.

4. **Why TideCloak matters**
   How does your application use TideCloak, and how does that integration help enable your idea? Connect the technology to the possibility you are demonstrating.

5. **Prototype & storytelling**
   What does your prototype demonstrate today? Describe the key interaction judges should look for.

#### README template skeleton

```markdown
# <Project Name>

<One-sentence description>

## Vision & originality
...

## Trust constraint insight
...

## Value & impact
...

## Why TideCloak matters
...

## Prototype & storytelling
...

---
## Setup
(setup instructions go here, separate from the overview)
```

### 2. A two-minute demo video
Show the possibility working. Save it as an `.mp4` file in your GitHub repository, **under 100 MB** (GitHub's file limit).

**Suggested structure:**
1. **The possibility** — What did you choose to build?
2. **The constraint** — What trust problem holds it back today?
3. **The prototype** — Show it working, and TideCloak's role.
4. **What changes** — What's now possible for the people using it?

---

## Judging: How Your App Will Be Judged

| Weight | Criterion | What judges look for |
|---|---|---|
| 25% | Vision & originality | A fresh, ambitious answer to the challenge. |
| 20% | Trust constraint insight | Show exactly what trust, privacy, custody or authority prevents today. |
| 20% | Value & impact | Create meaningful value for people, organisations or society. |
| 20% | Why TideCloak matters | Show how TideCloak materially changes what your product can credibly do. |
| 15% | Prototype & storytelling | Make the idea understandable and show it working. |

Judges read your README project overview alongside your demo.

> **If your app would work exactly the same with ordinary login and backend permissions, develop the idea further. TideCloak should change what it can credibly do.**

---

## Optional Inspiration: Example Ideas

These are inspiration, not mandatory tracks. Build in any domain.

| Idea | Description | Domain |
|---|---|---|
| Care Passport | Share selected health records with specific clinicians, with the patient controlling access. | Health |
| Research Consent Vault | Let participants share research data with approved researchers and withdraw future access. | Research |
| Rental Application Passport | Reuse rental documents and disclose only what each property manager needs. | Housing |
| Blind Portfolio Review | Review work before revealing identity, with access controlled by the stage of the review. | Education |
| Unreleased | Share unreleased creative work with collaborators without giving the platform access to every asset. | Creative work |
| Supplier Evidence Exchange | Give customers and auditors access to different packages of supplier evidence. | Industry |
| Matter Room | Bring clients, lawyers and experts into a matter with different access to its documents. | Professional services |
| Dual-Control Expense Desk | Require designated approvals for high-value expenses and protect who can become an approver. | Finance |
| Guild Treasury | Manage shared community credits and purchases without giving one moderator control. | Gaming |
| Coalition Intel Exchange | Share synthetic reports across fictional agencies according to release rules. | Public sector |
| CreatorVault | Release encrypted creator content according to a subscriber's entitlement. | Creators |
| Community Ballot | Help communities vote without giving one operator control over the election. | Community decisions |

---

## Help

- **Ask Hackbot** — Quick answers on your idea, the rules and what's due.
- **Ask the Tide team on Discord** — Stuck on setup? Post in `#support` with your error and what you've tried.
- **Ask Tide's MCP in your coding agent** — Once it's connected, your agent can answer coding and TideCloak integration questions. Can't get it connected? Start from the TideCloak Quickstart instead.

---

## FAQ (questions only; answers were collapsed on the page)

- Do I need cybersecurity or cryptography experience?
- Can I use AI coding tools?
- Do I have to use Tide's MCP?
- Can we use synthetic or mocked data?
- How complete does the prototype need to be?
- Do we have to use one of the example ideas?
- What do we submit, and when?
- What should we avoid?
- Where do I get help?

---

*UNLOCKED is Tide's challenge for the RMIT hackathon: Challenge 2.*
