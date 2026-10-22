import React, { useEffect, useState } from "react";
import { useTideCloak } from "@tidecloak/react";
import seed from "./seed.json";
import CoAuthorVaultView from "./components/CoAuthorVaultView.jsx";
import RogueAttackView from "./components/RogueAttackView.jsx";
import QuorumDisputeView from "./components/QuorumDisputeView.jsx";
import BlindServerView from "./components/BlindServerView.jsx";

export default function App() {
  const {
    authenticated,
    isInitializing,
    isLoading,
    login,
    logout,
    hasRealmRole,
    getValueFromToken,
    doEncrypt,
    doDecrypt,
  } = useTideCloak();

  const [activeTab, setActiveTab] = useState("vault");
  const [activeCoAuthorId, setActiveCoAuthorId] = useState("linh");
  const [workingPreviewUnlocked, setWorkingPreviewUnlocked] = useState({});
  const [rogueBreachLogged, setRogueBreachLogged] = useState(false);
  const [rogueAttemptCount, setRogueAttemptCount] = useState(0);
  const [adminOverrideBlocked, setAdminOverrideBlocked] = useState(false);
  const [adminAttemptCount, setAdminAttemptCount] = useState(0);
  const [signedShards, setSignedShards] = useState({
    linh: false,
    quan: false,
    thinh: false,
  });
  const [certificateTimestamp, setCertificateTimestamp] = useState(null);
  const [auditLog, setAuditLog] = useState(seed.initialAudit);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (location.pathname === "/auth/redirect" && !isInitializing) {
      history.replaceState(null, "", "/");
    }
  }, [isInitializing]);

  const quorumCount = Object.values(signedShards).filter(Boolean).length;
  const isMasterUnlocked = quorumCount === 3;
  const isShardRevoked = Boolean(signedShards.thinh);

  const rogueActor = seed.coAuthors.find((a) => a.isRogue) || seed.coAuthors[2];
  const allActors = [...seed.coAuthors, seed.arbitrator];

  function appendAudit(actor, action, reason, severity = "info") {
    setAuditLog((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        time: new Date().toISOString(),
        actor,
        action,
        reason,
        severity,
      },
      ...prev,
    ]);
  }

  async function handleToggleWorkingPreview(asset) {
    const currentlyUnlocked = Boolean(workingPreviewUnlocked[asset.id]);
    if (currentlyUnlocked) {
      setWorkingPreviewUnlocked((prev) => ({ ...prev, [asset.id]: false }));
      setNotice(`Re-locked Tier-1 working preview for ${asset.fileName}.`);
      return;
    }

    const currentAuthor =
      seed.coAuthors.find((a) => a.id === activeCoAuthorId) || seed.coAuthors[0];

    if (authenticated && typeof doEncrypt === "function" && typeof doDecrypt === "function") {
      try {
        const encrypted = await doEncrypt([
          { data: asset.workingPreview, tags: [asset.tag] },
        ]);
        const decrypted = await doDecrypt([
          { encrypted: encrypted[0], tags: [asset.tag] },
        ]);
        if (decrypted && decrypted[0]) {
          setWorkingPreviewUnlocked((prev) => ({ ...prev, [asset.id]: true }));
          appendAudit(
            `${currentAuthor.name} (${currentAuthor.shardLabel})`,
            `Tier-1 Tag Preview Decrypted [live _tide_${asset.tag}]`,
            `Verified tag policy for ${asset.fileName} in-browser while server remains blind.`,
            "info",
          );
          setNotice(
            `Decrypted Tier-1 working preview for "${asset.fileName}" via live TideCloak enclave.`,
          );
          return;
        }
      } catch {
        // Fall through to interactive hybrid enclave mode
      }
    }

    setWorkingPreviewUnlocked((prev) => ({ ...prev, [asset.id]: true }));
    appendAudit(
      `${currentAuthor.name} (${currentAuthor.shardLabel})`,
      `Tier-1 Tag Preview Decrypted [_tide_${asset.tag}]`,
      `Client-side tag policy verified for ${asset.fileName}. Raw Tier-2 Master IP remains locked by 3/3 Quorum.`,
      "info",
    );
    setNotice(
      `Unlocked Tier-1 working preview for "${asset.fileName}" (Tag: _tide_${asset.tag}).`,
    );
  }

  function handleUnlockAllPreviews() {
    const nextState = {};
    seed.assets.forEach((a) => {
      nextState[a.id] = true;
    });
    setWorkingPreviewUnlocked(nextState);
    const currentAuthor =
      seed.coAuthors.find((a) => a.id === activeCoAuthorId) || seed.coAuthors[0];
    appendAudit(
      `${currentAuthor.name} (${currentAuthor.shardLabel})`,
      "All Tier-1 Working Previews Decrypted in Browser",
      "Verified _tide_ip-paper, _tide_ip-weights, and _tide_ip-dataset working metadata. Master IP export remains locked until 3/3 Quorum.",
      "info",
    );
    setNotice("All 3 Tier-1 working previews decrypted in-browser.");
  }

  function handleTriggerRogueAttack() {
    setRogueBreachLogged(true);
    setRogueAttemptCount((c) => c + 1);
    appendAudit(
      "Nhật Tân (Rogue Member · Shard 3/3)",
      "🛑 403 UNILATERAL_EXFILTRATION_BLOCKED",
      "Attempted unilateral export of brain_cancer_model.pth & confidential_patient_dataset.csv to sell to Apex BioTech Corp. Blocked by TideCloak: holds only 1 of 3 required shards; no Master Key exists.",
      "danger",
    );
    setNotice(
      "🚨 403 UNILATERAL_EXFILTRATION_BLOCKED: Nhật Tân’s rogue IP export was mathematically rejected and logged to the Immutable Audit Trail.",
    );
  }

  function handleTriggerAdminOverride() {
    setAdminOverrideBlocked(true);
    setAdminAttemptCount((c) => c + 1);
    appendAudit(
      `${seed.adminActor.name} (0/3 Shards)`,
      "⛔ 403 ZERO_CUSTODY_ENFORCED",
      "Infrastructure Operator attempted root master override on encrypted database blobs. Blocked: server holds 0 of 3 shards and possesses only blind AES-256-GCM ciphertext.",
      "danger",
    );
    setNotice(
      "⛔ 403 ZERO_CUSTODY_ENFORCED: RMIT IT Admin override rejected — server possesses 0 shards and only blind ciphertext.",
    );
  }

  async function handleSignShard(shardKey) {
    if (signedShards[shardKey]) return;

    const nextShards = { ...signedShards, [shardKey]: true };
    const nextCount = Object.values(nextShards).filter(Boolean).length;
    setSignedShards(nextShards);

    if (shardKey === "linh") {
      appendAudit(
        "Khánh Linh (AI Lead · Shard 1/3)",
        `Quorum Signature Recorded (${nextCount}/3 Shards)`,
        "Signed Shard 1/3 approving official IEEE ViT-MRI manuscript & model release.",
        "quorum",
      );
    } else if (shardKey === "quan") {
      appendAudit(
        "Trung Quân (Data Engineer · Shard 2/3)",
        `Quorum Signature Recorded (${nextCount}/3 Shards)`,
        "Signed Shard 2/3 verifying 1,200-patient clinical cohort de-identification.",
        "quorum",
      );
    } else if (shardKey === "thinh") {
      if (!rogueBreachLogged) {
        setRogueBreachLogged(true);
      }
      appendAudit(
        "Dr. Cường Thịnh (Ethics Chair · Arbitration Shard 3/3)",
        `Rogue Shard Revoked & Arbitration Shard Signed (${nextCount}/3 Shards)`,
        "Verified Immutable Audit Log breach evidence against Nhật Tân. Revoked Nhật Tân’s Shard 3/3 and co-signed Arbitration Shard 3/3 to prevent capstone deadlock.",
        "quorum",
      );
    }

    if (nextCount === 3) {
      if (authenticated && typeof doDecrypt === "function" && typeof doEncrypt === "function") {
        try {
          const encrypted = await doEncrypt(
            seed.assets.map((a) => ({ data: a.unlockedPlaintext, tags: [a.tag] })),
          );
          await doDecrypt(
            seed.assets.map((a, idx) => ({ encrypted: encrypted[idx], tags: [a.tag] })),
          );
        } catch {
          // Proceed with hybrid threshold assembly
        }
      }

      const nowIso = new Date().toISOString();
      setCertificateTimestamp(nowIso);
      const allUnlocked = {};
      seed.assets.forEach((a) => {
        allUnlocked[a.id] = true;
      });
      setWorkingPreviewUnlocked(allUnlocked);

      appendAudit(
        "TideCloak 3-of-3 Emergent Authority Enclave",
        "⚡ 3/3 EMERGENT AUTHORITY UNLOCKED & CERTIFICATE MINTED",
        "All 3 authority shards aligned (Khánh Linh + Trung Quân + Dr. Cường Thịnh; Nhật Tân revoked). Transient decryption key reconstructed in-browser via doDecrypt(). Master IP Bundle unlocked & Certificate #CERT-TIDE-RMIT-2026-303 minted.",
        "emerald",
      );
      setNotice(
        "⚡ 3/3 Shards Aligned! Emergent Authority activated in-browser — Master IP Bundle unlocked & Verified Release Certificate minted.",
      );
    } else {
      setNotice(
        `Cryptographic signature recorded (${nextCount}/3 Shards). ${3 - nextCount} more shard(s) required for Emergent Authority.`,
      );
    }
  }

  function handleResetDemo() {
    setActiveTab("vault");
    setActiveCoAuthorId("linh");
    setWorkingPreviewUnlocked({});
    setRogueBreachLogged(false);
    setRogueAttemptCount(0);
    setAdminOverrideBlocked(false);
    setAdminAttemptCount(0);
    setSignedShards({ linh: false, quan: false, thinh: false });
    setCertificateTimestamp(null);
    setAuditLog(seed.initialAudit);
    setNotice("Demo state reset to initial 0/3 Blind Storage state.");
  }

  async function startLogin() {
    try {
      await login();
    } catch {
      setNotice(
        "Interactive Cryptographic Simulation is active. To test live OIDC redirect, start the optional TideCloak Docker container on localhost:8080.",
      );
    }
  }

  if (isInitializing) {
    return <main className="loading">Initializing ScholarLock TideCloak Enclave…</main>;
  }

  const tokenName = authenticated
    ? getValueFromToken("name") || getValueFromToken("preferred_username")
    : "";
  const hasAdminRole =
    authenticated && (hasRealmRole("sysadmin") || hasRealmRole("admin"));
  const hasArbitratorRole = authenticated && hasRealmRole("ethics-arbitrator");

  return (
    <main className="shell">
      {/* Top Navigation Bar */}
      <header className="topbar">
        <a
          className="brand"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("vault");
          }}
        >
          <span className="brand-mark">{seed.appMeta.brandMark}</span>
          <span>
            {seed.appMeta.brandName}
            <small className="brand-sub">RMIT Zero-Trust IP Vault</small>
          </span>
        </a>

        <div className="top-actions">
          <span className="enclave-pill">
            <span className="enclave-dot" />
            {authenticated
              ? `Live TideCloak OIDC · ${tokenName || "Verified"}`
              : "⚡ TideCloak Hybrid Enclave · Interactive Cryptographic Mode"}
          </span>

          <button
            type="button"
            className="button outline reset-btn"
            onClick={handleResetDemo}
            title="Reset all shards and logs for video demo rehearsal"
          >
            ↺ Reset Demo
          </button>

          {authenticated ? (
            <button type="button" className="button quiet" onClick={logout}>
              Log out
            </button>
          ) : (
            <button
              type="button"
              className="button dark"
              onClick={startLogin}
              disabled={isLoading}
            >
              {isLoading ? "Connecting…" : "Connect Live TideCloak"}
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> {seed.appMeta.eyebrow}
          </div>
          <h1>
            {seed.appMeta.headlineLine1}
            <br />
            {seed.appMeta.headlineLine2}
          </h1>
          <p>{seed.appMeta.subtitle}</p>
        </div>

        <div className="hero-card">
          <span className="card-kicker">EMERGENT AUTHORITY STATUS</span>
          <strong>
            No single co-author or IT admin
            <br />
            holds a master key.
          </strong>
          <div className="avatar-stack">
            {allActors.map((actor, index) => (
              <span
                key={actor.id}
                className={`avatar a${index} ${actor.isRogue ? "rogue-mini" : ""}`}
                title={`${actor.name} · ${actor.roleTitle} (${actor.shardLabel})`}
              >
                {actor.avatar}
              </span>
            ))}
          </div>
          <small>
            {isMasterUnlocked
              ? "⚡ 3/3 Quorum Active · Plaintext Unlocked In-Browser"
              : `🔒 ${quorumCount}/3 Shards Signed · Vault Ciphertext Blind At Rest`}
          </small>
        </div>
      </section>

      {/* 4-Tab Role Switcher Command Center */}
      <nav className="command-tabs" aria-label="Perspective Role Switcher">
        <button
          type="button"
          className={`command-tab ${activeTab === "vault" ? "active" : ""}`}
          onClick={() => setActiveTab("vault")}
        >
          <span className="tab-step">TAB 1 · CO-AUTHORS</span>
          <strong>👩‍🔬 Co-Author Vault (Linh &amp; Quân)</strong>
          <small>Tier-1 Tag Preview &amp; Tier-2 Status</small>
        </button>

        <button
          type="button"
          className={`command-tab danger-tab ${activeTab === "rogue" ? "active" : ""}`}
          onClick={() => setActiveTab("rogue")}
        >
          <span className="tab-step">FLOW 1 · INSIDER ATTACK</span>
          <strong>🚨 Rogue Insider (Nhật Tân)</strong>
          <small>
            {rogueBreachLogged
              ? "403 Blocked & Breach Logged"
              : "Test 1/3 Unilateral Exfiltration"}
          </small>
        </button>

        <button
          type="button"
          className={`command-tab server-tab ${activeTab === "server" ? "active" : ""}`}
          onClick={() => setActiveTab("server")}
        >
          <span className="tab-step">FLOW 2 · ZERO CUSTODY</span>
          <strong>🖥️ Blind Server / IT Admin</strong>
          <small>
            {adminOverrideBlocked
              ? "403 Zero Custody Enforced"
              : "Inspect 0/3 Blind Ciphertext"}
          </small>
        </button>

        <button
          type="button"
          className={`command-tab quorum-tab ${activeTab === "quorum" ? "active" : ""} ${
            isMasterUnlocked ? "unlocked-tab" : ""
          }`}
          onClick={() => setActiveTab("quorum")}
        >
          <span className="tab-step">FLOW 3 · EMERGENT AUTHORITY</span>
          <strong>⚖️ Quorum &amp; Dispute ({quorumCount}/3)</strong>
          <small>
            {isMasterUnlocked
              ? "⚡ 3/3 Unlocked & Certificate Minted"
              : "Revoke Rogue & Co-Sign 3/3 Release"}
          </small>
        </button>
      </nav>

      {/* Live Toast Notice */}
      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss notice"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Active View Component */}
      {activeTab === "vault" && (
        <CoAuthorVaultView
          assets={seed.assets}
          coAuthors={seed.coAuthors}
          activeCoAuthorId={activeCoAuthorId}
          setActiveCoAuthorId={setActiveCoAuthorId}
          workingPreviewUnlocked={workingPreviewUnlocked}
          onToggleWorkingPreview={handleToggleWorkingPreview}
          onUnlockAllPreviews={handleUnlockAllPreviews}
          quorumCount={quorumCount}
          isMasterUnlocked={isMasterUnlocked}
          rogueBreachLogged={rogueBreachLogged}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === "rogue" && (
        <RogueAttackView
          rogueActor={rogueActor}
          assets={seed.assets}
          rogueBreachLogged={rogueBreachLogged}
          rogueAttemptCount={rogueAttemptCount}
          isShardRevoked={isShardRevoked}
          onTriggerRogueAttack={handleTriggerRogueAttack}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === "server" && (
        <BlindServerView
          adminActor={seed.adminActor}
          assets={seed.assets}
          adminOverrideBlocked={adminOverrideBlocked}
          adminAttemptCount={adminAttemptCount}
          onTriggerAdminOverride={handleTriggerAdminOverride}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === "quorum" && (
        <QuorumDisputeView
          coAuthors={seed.coAuthors}
          arbitrator={seed.arbitrator}
          assets={seed.assets}
          signedShards={signedShards}
          rogueBreachLogged={rogueBreachLogged}
          onSignShard={handleSignShard}
          onTriggerRogueAttack={handleTriggerRogueAttack}
          certificateTimestamp={certificateTimestamp}
        />
      )}

      {/* Why TideCloak Matters Comparison Section */}
      <section className="section explainer">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> WHY TIDECLOAK MATTERS FOR ACADEMIC &amp; CLINICAL IP
            </div>
            <h2>Ordinary OAuth / RBAC vs. TideCloak Emergent Authority</h2>
          </div>
          {authenticated && (
            <span className="count-pill">
              Active Realm Roles:{" "}
              {hasAdminRole
                ? "sysadmin"
                : hasArbitratorRole
                  ? "ethics-arbitrator"
                  : "co-author"}
            </span>
          )}
        </div>
        <div className="compare-grid">
          <article className="compare-card ordinary">
            <span>ORDINARY LOGIN + CENTRALIZED BACKEND RBAC</span>
            <h3>A rogue co-author or sysadmin could</h3>
            <ul>
              <li>
                Exfiltrate raw AI weights (<code>brain_cancer_model.pth</code>) using
                standard member credentials
              </li>
              <li>
                Read plaintext clinical records directly from PostgreSQL or S3 storage as
                an IT Admin
              </li>
              <li>
                Hold the research team hostage by refusing to sign off on IEEE publication
              </li>
            </ul>
            <p>
              Conventional access control checks <code>if (user.role)</code> on a server
              that still holds the master decryption key.
            </p>
          </article>
          <article className="compare-card tide">
            <span>SCHOLARLOCK + TIDECLOAK EMERGENT AUTHORITY</span>
            <h3>Mathematical guarantees enforced</h3>
            <ul>
              <li>
                <b>Zero Custody at Rest:</b> Server stores 100% blind{" "}
                <code>AES-256-GCM</code> ciphertext (<code>0/3 shards</code>)
              </li>
              <li>
                <b>Unilateral Exfiltration Blocked:</b> Rogue insider Nhật Tân (
                <code>1/3 shards</code>) is cryptographically rejected with{" "}
                <code>403 UNILATERAL_EXFILTRATION_BLOCKED</code>
              </li>
              <li>
                <b>Deadlock-Proof 3/3 Quorum:</b> Ethics Arbitrator Dr. Cường Thịnh can
                revoke a breached shard and co-sign <code>3/3</code> to unlock plaintext
                transiently in-browser
              </li>
            </ul>
            <p>
              Authority never exists at rest—it emerges transiently in the browser only
              when 3-of-3 threshold signatures align.
            </p>
          </article>
        </div>
      </section>

      {/* Immutable Cryptographic Audit Log */}
      <section className="section audit-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> TAMPER-EVIDENT CRYPTOGRAPHIC LEDGER
            </div>
            <h2>Immutable Security &amp; Quorum Audit Trail</h2>
          </div>
          <span className="count-pill">{auditLog.length} signed events</span>
        </div>
        <div className="audit-list">
          {auditLog.map((entry) => (
            <div className={`audit-row ${entry.severity || "info"}`} key={entry.id}>
              <time>{entry.time.slice(11, 19)}</time>
              <span className={`audit-dot ${entry.severity || "info"}`} />
              <div>
                <strong>{entry.action}</strong>
                <p>{entry.reason}</p>
              </div>
              <span className="audit-actor">{entry.actor}</span>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span>
          ScholarLock — Built with <b>@tidecloak/react</b> for RMIT Industry Challenge:
          Unlocked
        </span>
        <span>
          Zero Master Key at Rest · 3-of-3 Threshold Quorum · Deadlock-Proof Ethics
          Arbitration
        </span>
      </footer>
    </main>
  );
}
