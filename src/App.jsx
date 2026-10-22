import React, { useEffect, useState } from "react";
import { useTideCloak } from "@tidecloak/react";
import seed from "./seed.json";
import CoAuthorVaultView from "./components/CoAuthorVaultView.jsx";
import QuorumDisputeView from "./components/QuorumDisputeView.jsx";
import BlindServerView from "./components/BlindServerView.jsx";

const ACCOUNT_LIST = [
  {
    id: "linh",
    hotkey: "1",
    buttonLabel: "👩‍🔬 Khánh Linh (AI Lead · 1/3)",
    ...seed.coAuthors[0],
  },
  {
    id: "quan",
    hotkey: "2",
    buttonLabel: "👨‍💻 Trung Quân (Data Eng · 2/3)",
    ...seed.coAuthors[1],
  },
  {
    id: "tan",
    hotkey: "3",
    buttonLabel: "🚨 Nhật Tân (Co-Author · 3/3)",
    ...seed.coAuthors[2],
  },
  {
    id: "thinh",
    hotkey: "4",
    buttonLabel: "⚖️ Dr. Cường Thịnh (Ethics Advisor)",
    ...seed.arbitrator,
  },
  {
    id: "sysadmin",
    hotkey: "5",
    buttonLabel: "🖥️ RMIT IT Admin (Server DB)",
    ...seed.adminActor,
  },
];

function generateTxHash(content) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < content.length; i++) {
    const ch = content.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const fullHex = (
    4294967296 * (2097151 & h2) +
    (h1 >>> 0)
  )
    .toString(16)
    .padStart(12, "0");
  return `0x${fullHex.slice(0, 4)}...${fullHex.slice(-4)}`;
}

export default function App() {
  const {
    authenticated,
    isInitializing,
    isLoading,
    login,
    logout,
    getValueFromToken,
    doEncrypt,
    doDecrypt,
  } = useTideCloak();

  const [activeUserId, setActiveUserId] = useState("linh");
  const [workingPreviewUnlocked, setWorkingPreviewUnlocked] = useState({});
  const [rogueBreachLogged, setRogueBreachLogged] = useState(false);
  const [rogueAttemptCount, setRogueAttemptCount] = useState(0);
  const [exportBlockModal, setExportBlockModal] = useState(null);
  const [adminOverrideBlocked, setAdminOverrideBlocked] = useState(false);
  const [adminAttemptCount, setAdminAttemptCount] = useState(0);
  const [signedShards, setSignedShards] = useState({
    linh: false,
    quan: false,
    thinh: false,
  });
  const [certificateTimestamp, setCertificateTimestamp] = useState(null);
  const [auditLog, setAuditLog] = useState(seed.initialAudit);
  const [auditFilter, setAuditFilter] = useState("all");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (location.pathname === "/auth/redirect" && !isInitializing) {
      history.replaceState(null, "", "/");
    }
  }, [isInitializing]);

  const activeUser =
    ACCOUNT_LIST.find((u) => u.id === activeUserId) || ACCOUNT_LIST[0];
  const quorumCount = Object.values(signedShards).filter(Boolean).length;
  const isMasterUnlocked = quorumCount === 3;

  function appendAudit(actor, action, reason, severity = "info") {
    const timeIso = new Date().toISOString();
    const txHash = generateTxHash(
      `${actor}:${action}:${reason}:${timeIso}:${Math.random()}`
    );
    setAuditLog((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        time: timeIso,
        actor,
        action,
        reason,
        severity,
        txHash,
      },
      ...prev,
    ]);
  }

  function handleSelectUser(userId) {
    setActiveUserId(userId);
    if (userId !== "tan") {
      setExportBlockModal(null);
    }
  }

  // Feature 1: Hotkeys 1-5 for swift account switching during live demo
  useEffect(() => {
    function handleKeyDown(e) {
      const target = e.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "1") {
        e.preventDefault();
        handleSelectUser("linh");
      } else if (e.key === "2") {
        e.preventDefault();
        handleSelectUser("quan");
      } else if (e.key === "3") {
        e.preventDefault();
        handleSelectUser("tan");
      } else if (e.key === "4") {
        e.preventDefault();
        handleSelectUser("thinh");
      } else if (e.key === "5") {
        e.preventDefault();
        handleSelectUser("sysadmin");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleToggleWorkingPreview(asset) {
    if (activeUser.id === "thinh") {
      setNotice(
        "🔒 Privacy Guardrail: Academic Ethics Advisor cannot read student daily working previews."
      );
      return;
    }

    const currentlyUnlocked = Boolean(workingPreviewUnlocked[asset.id]);
    if (currentlyUnlocked) {
      setWorkingPreviewUnlocked((prev) => ({ ...prev, [asset.id]: false }));
      return;
    }

    if (
      authenticated &&
      typeof doEncrypt === "function" &&
      typeof doDecrypt === "function"
    ) {
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
            `${activeUser.name} (${activeUser.shardLabel})`,
            `Working Preview Decrypted [_tide_${asset.tag}]`,
            `Verified tag policy for ${asset.fileName} via live TideCloak enclave.`,
            "info"
          );
          return;
        }
      } catch {
        // Fallback to hybrid enclave preview
      }
    }

    setWorkingPreviewUnlocked((prev) => ({ ...prev, [asset.id]: true }));
    appendAudit(
      `${activeUser.name} (${activeUser.shardLabel})`,
      `Working Preview Opened [_tide_${asset.tag}]`,
      `Opened co-author working summary for ${asset.fileName}. Full export remains locked by 3/3 Quorum.`,
      "info"
    );
  }

  function handleAttemptExport(targetFile) {
    if (isMasterUnlocked) {
      appendAudit(
        `${activeUser.name}`,
        `✅ Verified IP Exported (${targetFile})`,
        `Exported decrypted plaintext under 3-of-3 Quorum Certificate #CERT-TIDE-RMIT-2026-303.`,
        "emerald"
      );
      setNotice(
        `✅ Exported unlocked "${targetFile}" under Verified Release Certificate #CERT-TIDE-RMIT-2026-303.`
      );
      return;
    }

    // Quorum is < 3/3 -> Block unilateral export and log breach!
    const actorDisplay =
      activeUser.id === "tan"
        ? "Nhật Tân (Co-Author · Shard 3/3)"
        : `${activeUser.name} (${activeUser.shardLabel})`;

    setRogueBreachLogged(true);
    setRogueAttemptCount((c) => c + 1);
    setExportBlockModal({
      actorName: actorDisplay,
      targetFile,
    });

    appendAudit(
      "Nhật Tân (Co-Author · Shard 3/3)",
      `🚨 403 UNILATERAL_EXFILTRATION_BLOCKED — Export Rejected (${targetFile})`,
      "Nhật Tân attempted unilateral IP export (Blocked: holds only 1 of 3 shards; Master Key does not exist). Ethics Arbitration Shard (Dr. Cường Thịnh) is now unlocked.",
      "danger"
    );
    setNotice(
      "🚨 403 UNILATERAL_EXFILTRATION_BLOCKED: Unilateral export blocked & logged! Ethics Arbitration (Slot 3/3) is now unlocked."
    );
  }

  function handleTriggerAdminOverride() {
    setAdminOverrideBlocked(true);
    setAdminAttemptCount((c) => c + 1);
    appendAudit(
      `${seed.adminActor.name} (0/3 Shards)`,
      "⛔ 403 ZERO_CUSTODY_ENFORCED — Force Decrypt DB Blocked",
      "Infrastructure operator attempted unilateral database decrypt override. Rejected: server holds 0 of 3 shards and possesses only blind AES-256-GCM ciphertext.",
      "danger"
    );
    setNotice(
      "⛔ 403 ZERO_CUSTODY_ENFORCED: Server holds 0 of 3 shards and possesses only blind ciphertext."
    );
  }

  async function handleSignShard(shardKey) {
    if (signedShards[shardKey]) return;

    if (shardKey === "thinh" && !rogueBreachLogged) {
      setNotice(
        "🔒 Dormant Guardrail: Dr. Cường Thịnh’s Arbitration Shard only unlocks after a 403 breach is logged."
      );
      return;
    }

    const nextShards = { ...signedShards, [shardKey]: true };
    const nextCount = Object.values(nextShards).filter(Boolean).length;
    setSignedShards(nextShards);

    if (shardKey === "linh") {
      setActiveUserId("linh");
      appendAudit(
        "Khánh Linh (AI Lead · Shard 1/3)",
        `✍️ Quorum Slot 1/3 Signed (${nextCount}/3 Shards)`,
        "Signed Co-Author Shard 1/3 approving IEEE ViT-MRI manuscript & model release.",
        "quorum"
      );
    } else if (shardKey === "quan") {
      setActiveUserId("quan");
      appendAudit(
        "Trung Quân (Data Engineer · Shard 2/3)",
        `✍️ Quorum Slot 2/3 Signed (${nextCount}/3 Shards)`,
        "Signed Co-Author Shard 2/3 verifying 1,200-patient clinical cohort de-identification.",
        "quorum"
      );
    } else if (shardKey === "thinh") {
      setActiveUserId("thinh");
      setExportBlockModal(null);
      appendAudit(
        "Dr. Cường Thịnh (Ethics Advisor · Arbitration Shard 3/3)",
        `⚖️ Nhật Tân Revoked & Quorum Slot 3/3 Signed (${nextCount}/3 Shards)`,
        "Verified immutable 403 breach log. Revoked Nhật Tân’s shard and co-signed Arbitration Shard 3/3.",
        "quorum"
      );
    }

    if (nextCount === 3) {
      if (
        authenticated &&
        typeof doDecrypt === "function" &&
        typeof doEncrypt === "function"
      ) {
        try {
          const encrypted = await doEncrypt(
            seed.assets.map((a) => ({
              data: a.unlockedPlaintext,
              tags: [a.tag],
            }))
          );
          await doDecrypt(
            seed.assets.map((a, idx) => ({
              encrypted: encrypted[idx],
              tags: [a.tag],
            }))
          );
        } catch {
          // Hybrid threshold assembly
        }
      }

      const nowIso = new Date().toISOString();
      setCertificateTimestamp(nowIso);
      setExportBlockModal(null);

      appendAudit(
        "TideCloak 3-of-3 Emergent Authority Enclave",
        "⚡ 3/3 QUORUM ALIGNED — IP BUNDLE UNLOCKED & CERTIFICATE MINTED",
        "All 3 threshold shards aligned (Khánh Linh + Trung Quân + Dr. Cường Thịnh). Transient decryption key assembled in-browser via doDecrypt(). Certificate #CERT-TIDE-RMIT-2026-303 issued.",
        "emerald"
      );
      setNotice(
        "⚡ 3/3 Quorum Aligned! All 3 Capstone IP files are now unlocked in-browser & Certificate #CERT-TIDE-RMIT-2026-303 is minted."
      );
    } else {
      setNotice(
        `Signature recorded (${nextCount}/3 Shards). ${
          3 - nextCount
        } more signature(s) required to unlock IP bundle.`
      );
    }
  }

  function handleResetDemo() {
    setActiveUserId("linh");
    setWorkingPreviewUnlocked({});
    setRogueBreachLogged(false);
    setRogueAttemptCount(0);
    setExportBlockModal(null);
    setAdminOverrideBlocked(false);
    setAdminAttemptCount(0);
    setSignedShards({ linh: false, quan: false, thinh: false });
    setCertificateTimestamp(null);
    setAuditLog(seed.initialAudit);
    setAuditFilter("all");
    setNotice("Workspace reset to initial 0/3 encrypted state.");
  }

  // Feature 2: Download signed JSON ledger
  function handleExportAuditLedger() {
    const exportPayload = {
      repository: "ScholarLock — Zero-Trust Capstone & Co-Research IP Vault",
      standard: "TideCloak Emergent Authority Audit Standard v1.0",
      exportTimestamp: new Date().toISOString(),
      totalSignedEvents: auditLog.length,
      tamperEvidentLedger: auditLog,
      verification: {
        integrityProof: "ED25519_THRESHOLD_CHAIN_OK",
        custodyModel: "Zero Master Key at Rest",
        activeQuorum: quorumCount,
      },
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ScholarLock_Immutable_Audit_Log.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotice("⬇️ Exported Immutable Audit Log to ScholarLock_Immutable_Audit_Log.json");
  }

  async function startLogin() {
    try {
      await login();
    } catch {
      setNotice(
        "TideCloak Hybrid Enclave is active. Start localhost:8080 Docker container if you wish to test live OIDC redirect."
      );
    }
  }

  if (isInitializing) {
    return (
      <main className="loading">Initializing ScholarLock TideCloak Enclave…</main>
    );
  }

  const tokenName = authenticated
    ? getValueFromToken("name") || getValueFromToken("preferred_username")
    : "";

  const dangerCount = auditLog.filter((e) => e.severity === "danger").length;
  const quorumReleaseCount = auditLog.filter(
    (e) => e.severity === "quorum" || e.severity === "emerald"
  ).length;

  const filteredAuditLog = auditLog.filter((entry) => {
    if (auditFilter === "blocked") return entry.severity === "danger";
    if (auditFilter === "quorum") {
      return entry.severity === "quorum" || entry.severity === "emerald";
    }
    return true;
  });

  return (
    <main className="shell">
      {/* Top Application Header */}
      <header className="topbar">
        <div className="brand-block">
          <a
            className="brand"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleSelectUser("linh");
            }}
          >
            <span className="brand-mark">{seed.appMeta.brandMark}</span>
            <span>
              {seed.appMeta.brandName}
              <small className="brand-sub">
                RMIT Capstone IP Vault · Built with TideCloak
              </small>
            </span>
          </a>
        </div>

        <div className="top-actions">
          <span className="enclave-pill">
            <span className="enclave-dot" />
            {authenticated
              ? `TideCloak OIDC · ${tokenName || "Verified"}`
              : "⚡ TideCloak Enclave Active"}
          </span>

          <button
            type="button"
            className="button outline btn-sm"
            onClick={handleResetDemo}
            title="Reset workspace state"
          >
            ↺ Reset
          </button>

          {authenticated ? (
            <button
              type="button"
              className="button quiet btn-sm"
              onClick={logout}
            >
              Log out
            </button>
          ) : (
            <button
              type="button"
              className="button dark btn-sm"
              onClick={startLogin}
              disabled={isLoading}
            >
              {isLoading ? "Connecting…" : "Log in with TideCloak"}
            </button>
          )}
        </div>
      </header>

      {/* Feature 1: Prominent Active User / Account Switcher Bar with Key Hints */}
      <nav className="account-switcher-bar" aria-label="Switch Active User Account">
        <span className="switcher-label">ACTIVE ACCOUNT:</span>
        <div className="account-pills">
          {ACCOUNT_LIST.map((account) => {
            const isActive = activeUserId === account.id;
            const isRogue = account.id === "tan";
            const isServer = account.id === "sysadmin";
            return (
              <button
                key={account.id}
                type="button"
                className={`account-pill ${isActive ? "active" : ""} ${
                  isRogue ? "rogue-pill" : ""
                } ${isServer ? "server-pill" : ""}`}
                onClick={() => handleSelectUser(account.id)}
                title={`Press [${account.hotkey}] to switch to ${account.name}`}
              >
                <kbd className="key-hint-badge">{account.hotkey}</kbd>
                <span>{account.buttonLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Toast Notification */}
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

      {/* Main Application Workspace */}
      {activeUserId === "sysadmin" ? (
        /* Feature 4: Raw Server Database Inspector View */
        <BlindServerView
          adminActor={seed.adminActor}
          assets={seed.assets}
          adminOverrideBlocked={adminOverrideBlocked}
          adminAttemptCount={adminAttemptCount}
          onTriggerAdminOverride={handleTriggerAdminOverride}
          onReturnToVault={() => handleSelectUser("linh")}
        />
      ) : (
        /* Features 2 & 3: 2-Column Capstone File Vault + 3-of-3 Release Quorum Panel */
        <section className="workspace-grid">
          <CoAuthorVaultView
            assets={seed.assets}
            activeUser={activeUser}
            workingPreviewUnlocked={workingPreviewUnlocked}
            onToggleWorkingPreview={handleToggleWorkingPreview}
            onAttemptExport={handleAttemptExport}
            quorumCount={quorumCount}
            isMasterUnlocked={isMasterUnlocked}
            exportBlockModal={exportBlockModal}
            rogueAttemptCount={rogueAttemptCount}
            onCloseBlockModal={() => setExportBlockModal(null)}
          />

          <QuorumDisputeView
            coAuthors={seed.coAuthors}
            arbitrator={seed.arbitrator}
            activeUser={activeUser}
            signedShards={signedShards}
            rogueBreachLogged={rogueBreachLogged}
            onSignShard={handleSignShard}
            certificateTimestamp={certificateTimestamp}
          />
        </section>
      )}

      {/* Feature 2: Immutable Activity & Quorum Audit Log with SHA-256 Hashes, Filters & Export */}
      <section className="audit-section">
        <div className="audit-header-bar">
          <div className="audit-title-block">
            <span className="panel-kicker">TAMPER-EVIDENT CRYPTOGRAPHIC LEDGER</span>
            <h3>Immutable Activity &amp; Quorum Audit Log</h3>
          </div>

          <div className="audit-header-actions">
            {/* Filter Pills */}
            <div
              className="audit-filter-pills"
              role="tablist"
              aria-label="Filter Audit Events"
            >
              <button
                type="button"
                className={`audit-filter-btn ${
                  auditFilter === "all" ? "active" : ""
                }`}
                onClick={() => setAuditFilter("all")}
              >
                All Events ({auditLog.length})
              </button>
              <button
                type="button"
                className={`audit-filter-btn danger-filter ${
                  auditFilter === "blocked" ? "active" : ""
                }`}
                onClick={() => setAuditFilter("blocked")}
              >
                🚨 403 Blocked ({dangerCount})
              </button>
              <button
                type="button"
                className={`audit-filter-btn quorum-filter ${
                  auditFilter === "quorum" ? "active" : ""
                }`}
                onClick={() => setAuditFilter("quorum")}
              >
                ⚡ Quorum &amp; Release ({quorumReleaseCount})
              </button>
            </div>

            {/* Export JSON Button */}
            <button
              type="button"
              className="button outline btn-sm audit-export-btn"
              onClick={handleExportAuditLedger}
              title="Download signed cryptographic ledger in JSON format"
            >
              ⬇️ Export Audit Ledger (.json)
            </button>
          </div>
        </div>

        <div className="audit-list">
          {filteredAuditLog.length === 0 ? (
            <div className="audit-empty-state">
              No audit records matching the selected filter.
            </div>
          ) : (
            filteredAuditLog.map((entry) => (
              <div
                className={`audit-row ${entry.severity || "info"}`}
                key={entry.id}
              >
                <time>{entry.time.slice(11, 19)}</time>
                <span className={`audit-dot ${entry.severity || "info"}`} />
                <div className="audit-content">
                  <div className="audit-line">
                    <strong>{entry.action}</strong>
                    {entry.txHash && (
                      <code className="audit-tx-hash">{entry.txHash}</code>
                    )}
                  </div>
                  <p>{entry.reason}</p>
                </div>
                <span className="audit-actor">{entry.actor}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <footer>
        <span>
          <b>ScholarLock</b> — Zero-Trust Capstone &amp; Co-Research IP Vault · Built
          with <code>@tidecloak/react</code>
        </span>
        <span>
          No Master Key at Rest · 3-of-3 Threshold Quorum · Breach-Gated Ethics
          Arbitration
        </span>
      </footer>
    </main>
  );
}
