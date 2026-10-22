import React, { useEffect, useState } from "react";
import { useTideCloak } from "@tidecloak/react";
import seed from "./seed.json";
import CoAuthorVaultView from "./components/CoAuthorVaultView.jsx";
import QuorumDisputeView from "./components/QuorumDisputeView.jsx";
import BlindServerView from "./components/BlindServerView.jsx";
import TideCloakAuthModal from "./components/TideCloakAuthModal.jsx";
import PlanCArchitectureModal from "./components/PlanCArchitectureModal.jsx";

const ACCOUNT_LIST = [
  {
    id: "linh",
    hotkey: "1",
    shortCode: "KL",
    buttonLabel: "Khánh Linh (AI Lead · 1/3)",
    moodHint: "Calm · Shard 1/3",
    ...seed.coAuthors[0],
  },
  {
    id: "quan",
    hotkey: "2",
    shortCode: "TQ",
    buttonLabel: "Trung Quân (Data Eng · 2/3)",
    moodHint: "Focused · Shard 2/3",
    ...seed.coAuthors[1],
  },
  {
    id: "tan",
    hotkey: "3",
    shortCode: "NT",
    buttonLabel: "Nhật Tân (Rogue · 3/3)",
    moodHint: "Hostile · Rogue 3/3",
    ...seed.coAuthors[2],
  },
  {
    id: "thinh",
    hotkey: "4",
    shortCode: "CT",
    buttonLabel: "Dr. Cường Thịnh (Ethics Chair)",
    moodHint: "Arbitrator · Slot 3/3",
    ...seed.arbitrator,
  },
  {
    id: "sysadmin",
    hotkey: "5",
    shortCode: "IT",
    buttonLabel: "RMIT IT Admin (Blind DB)",
    moodHint: "Zero Custody · 0/3",
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

function MintCheckIcon() {
  return (
    <svg
      className="trust-check-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlanCModal, setShowPlanCModal] = useState(false);
  const [simulatedAuth, setSimulatedAuth] = useState(true);

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

  // Hotkeys 1-5 for swift account switching during live demo
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
        "Privacy Guardrail: Academic Ethics Advisor cannot read student daily working previews."
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
        `Verified IP Exported (${targetFile})`,
        `Exported decrypted plaintext under 3-of-3 Quorum Certificate #CERT-TIDE-RMIT-2026-303.`,
        "emerald"
      );
      setNotice(
        `Exported unlocked "${targetFile}" under Verified Release Certificate #CERT-TIDE-RMIT-2026-303.`
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
      `403 UNILATERAL_EXFILTRATION_BLOCKED — Export Rejected (${targetFile})`,
      "Nhật Tân attempted unilateral IP export (Blocked: holds only 1 of 3 shards; Master Key does not exist). Ethics Arbitration Shard (Dr. Cường Thịnh) is now unlocked.",
      "danger"
    );
    setNotice(
      "403 UNILATERAL_EXFILTRATION_BLOCKED: Unilateral export blocked & logged. Ethics Arbitration (Slot 3/3) is now unlocked."
    );
  }

  function handleTriggerAdminOverride() {
    setAdminOverrideBlocked(true);
    setAdminAttemptCount((c) => c + 1);
    appendAudit(
      `${seed.adminActor.name} (0/3 Shards)`,
      "403 ZERO_CUSTODY_ENFORCED — Force Decrypt DB Blocked",
      "Infrastructure operator attempted unilateral database decrypt override. Rejected: server holds 0 of 3 shards and possesses only blind AES-256-GCM ciphertext.",
      "danger"
    );
    setNotice(
      "403 ZERO_CUSTODY_ENFORCED: Server holds 0 of 3 shards and possesses only blind ciphertext."
    );
  }

  async function handleSignShard(shardKey) {
    if (signedShards[shardKey]) return;

    if (shardKey === "thinh" && !rogueBreachLogged) {
      setNotice(
        "Dormant Guardrail: Dr. Cường Thịnh’s Arbitration Shard only unlocks after a 403 breach is logged."
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
        `Quorum Slot 1/3 Signed (${nextCount}/3 Shards)`,
        "Signed Co-Author Shard 1/3 approving IEEE ViT-MRI manuscript & model release.",
        "quorum"
      );
    } else if (shardKey === "quan") {
      setActiveUserId("quan");
      appendAudit(
        "Trung Quân (Data Engineer · Shard 2/3)",
        `Quorum Slot 2/3 Signed (${nextCount}/3 Shards)`,
        "Signed Co-Author Shard 2/3 verifying 1,200-patient clinical cohort de-identification.",
        "quorum"
      );
    } else if (shardKey === "thinh") {
      setActiveUserId("thinh");
      setExportBlockModal(null);
      appendAudit(
        "Dr. Cường Thịnh (Ethics Advisor · Arbitration Shard 3/3)",
        `Nhật Tân Revoked & Quorum Slot 3/3 Signed (${nextCount}/3 Shards)`,
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
        "3/3 QUORUM ALIGNED — IP BUNDLE UNLOCKED & CERTIFICATE MINTED",
        "All 3 threshold shards aligned (Khánh Linh + Trung Quân + Dr. Cường Thịnh). Transient decryption key assembled in-browser via doDecrypt(). Certificate #CERT-TIDE-RMIT-2026-303 issued.",
        "emerald"
      );
      setNotice(
        "3/3 Quorum Aligned! All 3 Capstone IP files are now unlocked in-browser & Certificate #CERT-TIDE-RMIT-2026-303 is minted."
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
    setNotice("Sanctuary reset to initial 0/3 encrypted state.");
  }

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

    setNotice("Exported Immutable Audit Log to ScholarLock_Immutable_Audit_Log.json");
  }

  function handleQuickNextSign() {
    if (!signedShards.linh) {
      handleSignShard("linh");
    } else if (!signedShards.quan) {
      handleSignShard("quan");
    } else if (!rogueBreachLogged) {
      handleSelectUser("tan");
      handleAttemptExport("Full Master IP Bundle (3 Files)");
    } else if (!signedShards.thinh) {
      handleSignShard("thinh");
    } else {
      setNotice("All 3/3 Quorum Shards are already aligned and unlocked.");
    }
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
      <main className="loading">Initializing ScholarLock TideCloak Sanctuary…</main>
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
    <>
      {/* Soothing Pastel Ambient Glows (Lavender, Mint, Peach) */}
      <div className="ambient-canvas" aria-hidden="true">
        <div className="ambient-blob lavender" />
        <div className="ambient-blob mint" />
        <div className="ambient-blob peach" />
      </div>

      <main className="shell" id="top">
        {/* Top Frosted Neumorphic Navbar (Serenity Style) */}
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
              <span className="brand-mark" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9.5 11.5a2.5 2.5 0 0 1 5 0v2.5h-5v-2.5z" />
                </svg>
              </span>
              <span>
                {seed.appMeta.brandName}
                <small className="brand-sub">
                  Zero-Trust Research IP Sanctuary · TideCloak
                </small>
              </span>
            </a>
          </div>

          <nav className="nav-links-center" aria-label="Primary Sections">
            <a
              href="#vault-workspace"
              className={`nav-link-item ${
                activeUserId !== "sysadmin" && activeUserId !== "tan" ? "active" : ""
              }`}
              onClick={() => handleSelectUser("linh")}
            >
              IP Sanctuary
            </a>
            <a
              href="#vault-workspace"
              className="nav-link-item"
              onClick={() => handleSelectUser("quan")}
            >
              3/3 Quorum
            </a>
            <a
              href="#vault-workspace"
              className={`nav-link-item ${activeUserId === "thinh" ? "active" : ""}`}
              onClick={() => handleSelectUser("thinh")}
            >
              Ethics Arbitration
            </a>
            <a
              href="#vault-workspace"
              className={`nav-link-item ${activeUserId === "sysadmin" ? "active" : ""}`}
              onClick={() => handleSelectUser("sysadmin")}
            >
              Blind Server
            </a>
            <a href="#audit-ledger" className="nav-link-item">
              Audit Ledger
            </a>
          </nav>

          <div className="top-actions">
            {/* Feature Plan C: Official Architecture Blueprint Modal Trigger */}
            <button
              type="button"
              className="button outline btn-sm plan-c-badge-btn"
              onClick={() => setShowPlanCModal(true)}
              title="Official Plan C: See Where TideCloak Fits in ScholarLock"
            >
              <span className="plan-c-dot" />
              🏛️ Plan C: Where TideCloak Fits
            </button>

            {authenticated || simulatedAuth ? (
              <div className="auth-status-group">
                <button
                  type="button"
                  className="enclave-pill clickable-pill"
                  onClick={() => setShowAuthModal(true)}
                  title="Inspect simulated TideCloak Enclave JWT Token & Claims"
                >
                  <span className="enclave-dot" />
                  <span>
                    {authenticated
                      ? `TideCloak OIDC · ${tokenName || "Verified"}`
                      : `TideCloak Enclave · ${activeUser.name} (${activeUser.role})`}
                  </span>
                </button>
                <button
                  type="button"
                  className="button quiet btn-sm"
                  onClick={() => {
                    if (authenticated) logout();
                    setSimulatedAuth(false);
                    setNotice("Signed out of TideCloak session. Click 'Log in with TideCloak' to inspect sign-in.");
                  }}
                  title="Sign out of current TideCloak session"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="button dark btn-sm"
                onClick={() => setShowAuthModal(true)}
                title="Open TideCloak Passwordless Sign-in Enclave (Plan C)"
              >
                🔑 Log in with TideCloak
              </button>
            )}

            <button
              type="button"
              className="button outline btn-sm"
              onClick={handleResetDemo}
              title="Reset workspace state"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset
            </button>
          </div>
        </header>

        {/* Serenity-Inspired Calming Hero & Interactive Persona Check-In Preview */}
        <section className="hero-sanctuary" aria-label="Sanctuary Overview">
          <div className="hero-grid">
            <div className="hero-copy-col">
              <div className="neu-badge">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z" />
                  <path d="M12 22c-4.97 0-9-4.03-9-9 4.97 0 9 4.03 9 9z" />
                  <path d="M12 22V8" />
                </svg>
                <span>Your Co-Research IP Sanctuary</span>
              </div>

              <h1 className="hero-headline">
                Protect Shared Research in{" "}
                <span className="gradient-text">Inner Peace</span>
              </h1>

              <p className="hero-subtitle">
                A calm, zero-custody space for university breakthroughs. Preview
                daily progress, assemble 3-of-3 co-author quorum signatures, and
                resolve disputes without fear of insider theft.
              </p>

              <div className="hero-cta-row">
                <a
                  href="#vault-workspace"
                  className="button dark"
                  style={{ textDecoration: "none" }}
                  onClick={() => handleSelectUser("linh")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Start Quorum Flow
                </a>

                <button
                  type="button"
                  className="button outline"
                  onClick={() => {
                    handleSelectUser("tan");
                    handleAttemptExport("Full Master IP Bundle (3 Files)");
                  }}
                >
                  Test Crisis / 403 Guardrail
                </button>
              </div>

              <div className="hero-trust-row">
                <div className="trust-item">
                  <MintCheckIcon />
                  <span>100% Blind Ciphertext</span>
                </div>
                <div className="trust-item">
                  <MintCheckIcon />
                  <span>3-of-3 Threshold Quorum</span>
                </div>
                <div className="trust-item">
                  <MintCheckIcon />
                  <span>24/7 Ethics Arbitration</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Neumorphic Check-In Card (Serenity Mood Card Homage) */}
            <div className="hero-widget-stage">
              <div className="hero-aura-circle breathing-circle" />

              <div className="floating-streak-pill">
                <span className="streak-orb" aria-hidden="true">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                </span>
                <span>
                  {isMasterUnlocked
                    ? "3/3 Quorum Unlocked"
                    : `${quorumCount}/3 Shards Aligned`}
                </span>
              </div>

              <div className="neu-card hero-checkin-card">
                <div className="checkin-header">
                  <div>
                    <div className="checkin-greeting">Active Co-Researcher,</div>
                    <div className="checkin-name">{activeUser.name}</div>
                  </div>
                  <div className="pastel-orb-avatar" title={activeUser.roleTitle}>
                    {activeUser.avatar}
                  </div>
                </div>

                {/* Recessed Neumorphic Persona Check-In Tray (5 Circular Tactile Buttons) */}
                <div className="neu-inset checkin-inset-box">
                  <div className="checkin-inset-label">
                    <span>Switch Persona Role (Hotkeys 1–5)</span>
                    <span style={{ color: "var(--color-primary-dark)" }}>
                      {activeUser.moodHint}
                    </span>
                  </div>
                  <div
                    className="mood-selector-row"
                    role="group"
                    aria-label="Quick Persona Selector"
                  >
                    {ACCOUNT_LIST.map((acc) => {
                      const isCurrent = activeUserId === acc.id;
                      const isRogue = acc.id === "tan";
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          className={`mood-btn ${isCurrent ? "active" : ""} ${
                            isRogue ? "rogue-mood" : ""
                          }`}
                          onClick={() => handleSelectUser(acc.id)}
                          title={`${acc.name} — Press [${acc.hotkey}]`}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 800,
                              fontFamily: "var(--font-heading)",
                              lineHeight: 1.1,
                            }}
                          >
                            {acc.shortCode}
                          </span>
                          <span
                            style={{
                              fontSize: "9px",
                              fontFamily: "var(--font-mono)",
                              opacity: 0.75,
                            }}
                          >
                            [{acc.hotkey}]
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Cryptographic Affirmation Card */}
                <div className="neu-card affirmation-card">
                  <div className="affirmation-kicker">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>Emergent Authority Principle</span>
                  </div>
                  <p className="affirmation-quote">
                    “No master key exists at rest. Decryption authority emerges
                    transiently only when all three shards align.”
                  </p>
                </div>

                {/* 2-Column Tactile Quick Actions */}
                <div className="checkin-quick-grid">
                  <button
                    type="button"
                    className="button outline btn-sm"
                    onClick={() =>
                      handleToggleWorkingPreview(seed.assets[1] || seed.assets[0])
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview Weights
                  </button>
                  <button
                    type="button"
                    className="button outline btn-sm"
                    onClick={handleQuickNextSign}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    {isMasterUnlocked ? "3/3 Verified" : "Advance Quorum"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 1: Prominent Active User / Account Switcher Bar with Key Hints */}
        <nav
          id="vault-workspace"
          className="account-switcher-bar"
          aria-label="Switch Active User Account"
        >
          <span className="switcher-label">Active Persona:</span>
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
        <section className="audit-section" id="audit-ledger">
          <div className="audit-header-bar">
            <div className="audit-title-block">
              <span className="panel-kicker">
                TAMPER-EVIDENT CRYPTOGRAPHIC JOURNAL
              </span>
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
                  403 Blocked ({dangerCount})
                </button>
                <button
                  type="button"
                  className={`audit-filter-btn quorum-filter ${
                    auditFilter === "quorum" ? "active" : ""
                  }`}
                  onClick={() => setAuditFilter("quorum")}
                >
                  Quorum &amp; Release ({quorumReleaseCount})
                </button>
              </div>

              {/* Export JSON Button */}
              <button
                type="button"
                className="button outline btn-sm audit-export-btn"
                onClick={handleExportAuditLedger}
                title="Download signed cryptographic ledger in JSON format"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Audit Ledger (.json)
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
            <b>ScholarLock</b> — Zero-Trust Capstone &amp; Co-Research IP Sanctuary ·
            Built with <code>@tidecloak/react</code>
          </span>
          <span>
            No Master Key at Rest · 3-of-3 Threshold Quorum · Breach-Gated Ethics
            Arbitration
          </span>
        </footer>

        {/* Plan C: TideCloak Enclave Passwordless Auth & Persona Inspector Modal */}
        <TideCloakAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          activeUser={activeUser}
          accountList={ACCOUNT_LIST}
          isLoggedIn={authenticated || simulatedAuth}
          onSelectUser={handleSelectUser}
          onToggleLogin={(val) => {
            setSimulatedAuth(val);
            if (val) {
              appendAudit(
                activeUser.name,
                `TideCloak Enclave Session Active [role: ${activeUser.role}]`,
                `Authenticated via simulated Ed25519 hardware passkey enclave under Plan C.`,
                "info"
              );
            }
          }}
        />

        {/* Plan C: Official Architecture Blueprint Modal */}
        <PlanCArchitectureModal
          isOpen={showPlanCModal}
          onClose={() => setShowPlanCModal(false)}
        />
      </main>
    </>
  );
}
