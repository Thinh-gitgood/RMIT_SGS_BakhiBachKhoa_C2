import React from "react";

export default function QuorumDisputeView({
  coAuthors = [],
  arbitrator = {},
  activeUser,
  signedShards = { linh: false, quan: false, thinh: false },
  rogueBreachLogged = false,
  onSignShard,
  certificateTimestamp,
}) {
  const linh = coAuthors.find((a) => a.id === "linh") || {
    name: "Khánh Linh",
    roleTitle: "AI Lead",
    avatar: "KL",
    shardLabel: "Shard 1/3",
  };
  const quan = coAuthors.find((a) => a.id === "quan") || {
    name: "Trung Quân",
    roleTitle: "Data Engineer",
    avatar: "TQ",
    shardLabel: "Shard 2/3",
  };
  const tan = coAuthors.find((a) => a.id === "tan") || {
    name: "Nhật Tân",
    roleTitle: "Rogue Member",
    avatar: "NT",
    shardLabel: "Shard 3/3 (Revocable)",
  };

  const quorumCount = Object.values(signedShards).filter(Boolean).length;
  const isMasterUnlocked = quorumCount === 3;
  const progressPercent = Math.round((quorumCount / 3) * 100);

  return (
    <aside className="quorum-column">
      <div className="panel-card quorum-panel-card">
        {/* Quorum Panel Header */}
        <div className="quorum-panel-header">
          <div>
            <span className="panel-kicker">EMERGENT AUTHORITY CONSENSUS ENGINE</span>
            <h2>🔐 3-of-3 Release Quorum</h2>
          </div>
          <span className={`status-pill ${isMasterUnlocked ? "emerald" : "amber"}`}>
            {isMasterUnlocked ? "⚡ 3/3 Unlocked" : `${quorumCount}/3 Shards`}
          </span>
        </div>

        {/* 3/3 Key Assembly Meter */}
        <div className="quorum-meter-box">
          <div className="quorum-meter-labels">
            <span>
              Threshold Key Assembly: <b>{quorumCount} of 3 Shards</b>
            </span>
            <span className={isMasterUnlocked ? "emerald-text" : "muted-text"}>
              {isMasterUnlocked
                ? "✓ Master Key Reconstructed via doDecrypt()"
                : `${3 - quorumCount} more signature(s) required to unlock`}
            </span>
          </div>
          <div className="quorum-progress-track">
            <div
              className={`quorum-progress-fill ${isMasterUnlocked ? "complete" : ""}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="quorum-steps-row">
            <span className={quorumCount >= 0 ? "step-active" : ""}>0/3 Sealed</span>
            <span className={quorumCount >= 1 ? "step-active" : ""}>1/3 (Khánh Linh)</span>
            <span className={quorumCount >= 2 ? "step-active" : ""}>2/3 (Trung Quân)</span>
            <span className={isMasterUnlocked ? "step-complete" : ""}>
              3/3 (Unlocked)
            </span>
          </div>
        </div>

        {/* 3 Signature Slots */}
        <div className="quorum-slots-list">
          {/* Slot 1: Khánh Linh */}
          <div
            className={`quorum-slot-card ${signedShards.linh ? "signed" : ""} ${
              activeUser?.id === "linh" ? "active-actor-slot" : ""
            }`}
          >
            <div className="slot-top">
              <div className="slot-person">
                <span className={`avatar mini ${signedShards.linh ? "signed-avatar" : ""}`}>
                  {linh.avatar}
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <strong>👩‍🔬 {linh.name}</strong>
                    {activeUser?.id === "linh" && (
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "1px 5px",
                          borderRadius: "4px",
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </div>
                  <small>{linh.roleTitle} · Shard 1/3</small>
                </div>
              </div>
              <span className={`shard-state ${signedShards.linh ? "signed" : "pending"}`}>
                {signedShards.linh ? "✓ SIGNED" : "SLOT 1/3"}
              </span>
            </div>

            {signedShards.linh ? (
              <div>
                <code className="slot-sig-hash">
                  Sig: 0x94a8f1c2...e71b309d (Ed25519 Verified)
                </code>
                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px",
                    color: "var(--emerald)",
                    marginTop: "4px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Approved IEEE ViT-MRI manuscript &amp; model weights release.
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="button dark full-width btn-sm"
                onClick={() => onSignShard("linh")}
                title="Khánh Linh co-signs approval with Shard 1/3"
              >
                ✍️ Sign Approval (1/3)
              </button>
            )}
          </div>

          {/* Slot 2: Trung Quân */}
          <div
            className={`quorum-slot-card ${signedShards.quan ? "signed" : ""} ${
              activeUser?.id === "quan" ? "active-actor-slot" : ""
            }`}
          >
            <div className="slot-top">
              <div className="slot-person">
                <span className={`avatar mini ${signedShards.quan ? "signed-avatar" : ""}`}>
                  {quan.avatar}
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <strong>👨‍💻 {quan.name}</strong>
                    {activeUser?.id === "quan" && (
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "1px 5px",
                          borderRadius: "4px",
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </div>
                  <small>{quan.roleTitle} · Shard 2/3</small>
                </div>
              </div>
              <span className={`shard-state ${signedShards.quan ? "signed" : "pending"}`}>
                {signedShards.quan ? "✓ SIGNED" : "SLOT 2/3"}
              </span>
            </div>

            {signedShards.quan ? (
              <div>
                <code className="slot-sig-hash">
                  Sig: 0x3c7d09b4...a82f614e (Ed25519 Verified)
                </code>
                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px",
                    color: "var(--emerald)",
                    marginTop: "4px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Verified 1,200-patient clinical cohort de-identification.
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="button dark full-width btn-sm"
                onClick={() => onSignShard("quan")}
                title="Trung Quân co-signs approval with Shard 2/3"
              >
                ✍️ Sign Approval (2/3)
              </button>
            )}
          </div>

          {/* Slot 3: Dynamic Dispute & Ethics Arbitration Slot */}
          <div
            className={`quorum-slot-card slot3-card ${
              signedShards.thinh
                ? "signed"
                : rogueBreachLogged
                  ? "eligible-card"
                  : "dormant-card"
            } ${activeUser?.id === "thinh" ? "active-actor-slot" : ""}`}
          >
            {/* Original Shard 3 Holder Status (Nhật Tân) */}
            <div className="rogue-slot-status">
              <div>
                <span>
                  🚨 <b>{tan.name}</b>
                </span>
                <small style={{ display: "block", fontSize: "10px", color: "var(--muted)" }}>
                  Original Co-Author · Shard 3/3
                </small>
              </div>
              <span
                className={`rogue-status-chip ${
                  signedShards.thinh
                    ? "revoked"
                    : rogueBreachLogged
                      ? "breach"
                      : "hostile"
                }`}
              >
                {signedShards.thinh
                  ? "🚫 SHARD REVOKED"
                  : rogueBreachLogged
                    ? "🚨 403 BREACH LOGGED"
                    : "⚠️ Refusing to Co-Sign"}
              </span>
            </div>

            {/* Ethics Arbitrator (Dr. Cường Thịnh) */}
            <div className="slot-top arbitrator-top">
              <div className="slot-person">
                <span
                  className={`avatar mini ${signedShards.thinh ? "signed-avatar" : ""}`}
                >
                  {arbitrator.avatar || "CT"}
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <strong>⚖️ {arbitrator.name}</strong>
                    {activeUser?.id === "thinh" && (
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "1px 5px",
                          borderRadius: "4px",
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </div>
                  <small>Ethics Arbitrator · Arbitration Shard 3/3</small>
                </div>
              </div>
              <span
                className={`shard-state ${
                  signedShards.thinh
                    ? "signed"
                    : rogueBreachLogged
                      ? "eligible"
                      : "dormant"
                }`}
              >
                {signedShards.thinh
                  ? "✓ SIGNED"
                  : rogueBreachLogged
                    ? "⚡ UNLOCKED"
                    : "🔒 DORMANT"}
              </span>
            </div>

            <p className="arbitrator-rule-note">
              {signedShards.thinh
                ? "Nhật Tân’s shard revoked via Audit Log proof; Arbitration Shard 3/3 active."
                : rogueBreachLogged
                  ? "⚡ Breach Logged in Audit Trail — Ethics Arbitration Unlocked! Dr. Cường Thịnh can now revoke Nhật Tân & sign 3/3."
                  : "🔒 Dormant Guardrail: Only unlocks if an immutable 403 breach is logged (prevents collusion against an innocent co-author)."}
            </p>

            {signedShards.thinh ? (
              <div>
                <code className="slot-sig-hash">
                  Sig: 0x7f12e5d9...c04a883b (Arbitration Key Verified)
                </code>
                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px",
                    color: "var(--emerald)",
                    marginTop: "4px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Revocation Order #REV-2026-NT03 sealed into Ledger.
                </span>
              </div>
            ) : rogueBreachLogged ? (
              <button
                type="button"
                className="button arbitration-btn full-width btn-sm"
                onClick={() => onSignShard("thinh")}
                title="Dr. Cường Thịnh exercises ethics authority to revoke rogue shard and sign"
              >
                ⚖️ Revoke Nhật Tân &amp; Sign (3/3)
              </button>
            ) : (
              <button
                type="button"
                className="button full-width btn-sm"
                disabled
                title="Awaiting immutable 403 breach evidence from Nhật Tân"
              >
                🔒 Locked — No Breach Logged
              </button>
            )}
          </div>
        </div>

        {/* Verified IP Release Certificate (Displayed as soon as 3/3 is signed) */}
        {isMasterUnlocked && (
          <div
            className="certificate-compact"
            role="region"
            aria-label="Verified IP Release Certificate"
          >
            <div className="cert-compact-head">
              <div>
                <span className="cert-kicker">
                  📜 TIDECLOAK SOVEREIGN RELEASE CERTIFICATE
                </span>
                <h3>CERT-TIDE-RMIT-2026-303</h3>
              </div>
              <span className="cert-verified-badge">3/3 VERIFIED</span>
            </div>
            <p className="cert-compact-body">
              Transient decryption key assembled in-browser via{" "}
              <code>doDecrypt()</code>. All 3 Capstone IP files are unlocked for
              IEEE publication &amp; licensed deployment.
            </p>
            <div className="cert-compact-meta">
              <span>
                <b>Co-Signers:</b> Khánh Linh (1/3), Trung Quân (2/3), Dr. Cường Thịnh (3/3)
              </span>
              <span>
                <b>Revoked:</b> Nhật Tân (403 Breach) ·{" "}
                {(certificateTimestamp || new Date().toISOString()).slice(11, 19)} UTC
              </span>
              <span>
                <b>Enclave Security:</b> Zero Master Key at Rest · Ed25519 Verified Signatures
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
