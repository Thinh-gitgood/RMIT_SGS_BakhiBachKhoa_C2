import React from "react";
import RogueAttackView from "./RogueAttackView.jsx";

export default function CoAuthorVaultView({
  assets = [],
  activeUser,
  workingPreviewUnlocked = {},
  onToggleWorkingPreview,
  onAttemptExport,
  quorumCount = 0,
  isMasterUnlocked = false,
  exportBlockModal = null,
  rogueAttemptCount = 0,
  onCloseBlockModal,
}) {
  const isAdvisor = activeUser?.id === "thinh";
  const isRogueUser = activeUser?.id === "tan";

  // Helper for file type formatting & visual distinction
  function getFileTypeBadge(fileName = "") {
    if (fileName.endsWith(".pdf")) {
      return { label: "PDF DOCUMENT", color: "#be185d", bg: "#fce7f3" };
    }
    if (fileName.endsWith(".pth")) {
      return { label: "PYTORCH WEIGHTS", color: "#1d4ed8", bg: "#dbeafe" };
    }
    if (fileName.endsWith(".csv")) {
      return { label: "CLINICAL DATASET", color: "#b45309", bg: "#fef3c7" };
    }
    return { label: "BINARY BLOB", color: "#475569", bg: "#f1f5f9" };
  }

  return (
    <div className="vault-column">
      {/* Vault Panel Header */}
      <div className="panel-card">
        <div className="vault-panel-header">
          <div>
            <span className="panel-kicker">
              CAPSTONE REPOSITORY · TIDECLOAK E2EE VAULT
            </span>
            <h2>📁 Project IP Vault (3 Protected Files)</h2>
          </div>

          <button
            type="button"
            className={`button ${
              isMasterUnlocked
                ? "emerald-cta"
                : isRogueUser
                  ? "danger-cta"
                  : "dark"
            }`}
            onClick={() => onAttemptExport("Full Master IP Bundle (3 Files)")}
            title={
              isMasterUnlocked
                ? "Export decrypted plaintexts under Certificate #CERT-TIDE-RMIT-2026-303"
                : isRogueUser
                  ? "Attempt unilateral exfiltration to sell IP (Will be blocked with 403)"
                  : "Export full capstone package (Requires 3-of-3 Quorum approval)"
            }
          >
            {isMasterUnlocked
              ? "⬇️ Export Full IP Bundle (3/3 Unlocked)"
              : isRogueUser
                ? "🚨 ⬇️ Export Full IP Bundle (Unilateral)"
                : "⬇️ Export Full IP Bundle"}
          </button>
        </div>

        {/* Active User Capability Strip */}
        <div className={`user-context-strip ${isRogueUser ? "rogue-strip" : ""}`}>
          <div className="user-context-left">
            <span className="avatar mini">{activeUser?.avatar || "KL"}</span>
            <span>
              Viewing as <strong>{activeUser?.name}</strong> ({activeUser?.roleTitle})
            </span>
            <span className={`shard-chip ${isRogueUser ? "danger" : ""}`}>
              {activeUser?.shardLabel}
            </span>
          </div>
          <span className="bundle-status-text">
            {isMasterUnlocked
              ? "🔓 3/3 Quorum Verified — Full Plaintext Unlocked in Browser"
              : isAdvisor
                ? "🔒 Advisor cannot read student files (Privacy Guardrail)"
                : `🔒 Bundle Locked (${quorumCount}/3 Shards) — Requires 3/3 Quorum to Export`}
          </span>
        </div>

        {/* 403 Unilateral Exfiltration Block Modal (Triggered on Unauthorized Export) */}
        <RogueAttackView
          exportBlockModal={exportBlockModal}
          rogueAttemptCount={rogueAttemptCount}
          onCloseModal={onCloseBlockModal}
        />

        {/* File Rows List */}
        <div className="file-list">
          {assets.map((asset) => {
            const isPreviewOpen =
              !isAdvisor && Boolean(workingPreviewUnlocked[asset.id]);
            const typeBadge = getFileTypeBadge(asset.fileName);

            return (
              <article
                key={asset.id}
                className={`file-row-card ${
                  isMasterUnlocked ? "file-unlocked" : ""
                }`}
              >
                <div className="file-row-main">
                  <div className="file-info">
                    <span className="file-icon" role="img" aria-label={typeBadge.label}>
                      {asset.icon}
                    </span>
                    <div>
                      <div className="file-name-line">
                        <strong className="file-name">{asset.fileName}</strong>
                        <span
                          className="file-size-pill"
                          style={{
                            color: typeBadge.color,
                            backgroundColor: typeBadge.bg,
                            fontWeight: 800,
                            letterSpacing: "0.3px",
                          }}
                        >
                          {typeBadge.label}
                        </span>
                        <span className="file-size-pill">{asset.size}</span>
                        <code className="file-tag-pill">_tide_{asset.tag}</code>
                        <span
                          className={`file-lock-badge ${
                            isMasterUnlocked ? "unlocked" : "locked"
                          }`}
                        >
                          {isMasterUnlocked
                            ? "🔓 Unlocked (3/3 Verified)"
                            : "🔒 Encrypted (3/3 Quorum)"}
                        </span>
                      </div>
                      <p className="file-subtitle">
                        <span style={{ fontWeight: 700, color: "var(--ink)", marginRight: "6px" }}>
                          [{asset.code}]
                        </span>
                        {asset.title}
                        <span style={{ marginLeft: "8px", fontSize: "10.5px", color: "var(--muted)" }}>
                          • {asset.cipherSuite}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="file-actions">
                    {isAdvisor ? (
                      <span
                        className="advisor-privacy-pill"
                        title="Academic Advisor holds only a 1/3 Arbitration Shard and cannot view student working files"
                      >
                        🔒 Advisor Cannot Read
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="button outline btn-sm"
                        onClick={() => onToggleWorkingPreview(asset)}
                        title="Preview working metadata via TideCloak tag policy"
                      >
                        {isPreviewOpen ? "🙈 Hide Preview" : "👁️ Preview"}
                      </button>
                    )}

                    <button
                      type="button"
                      className={`button btn-sm ${
                        isMasterUnlocked
                          ? "emerald-btn"
                          : isRogueUser
                            ? "danger-sm"
                            : "dark"
                      }`}
                      onClick={() => onAttemptExport(asset.fileName)}
                      title={
                        isMasterUnlocked
                          ? `Export unlocked ${asset.fileName}`
                          : isRogueUser
                            ? `Attempt unauthorized sale of ${asset.fileName}`
                            : `Export ${asset.fileName} (Requires 3/3 Quorum)`
                      }
                    >
                      {isMasterUnlocked
                        ? "⬇️ Export Plaintext"
                        : isRogueUser
                          ? "🚨 ⬇️ Export"
                          : "⬇️ Export"}
                    </button>
                  </div>
                </div>

                {/* File Payload / Content Bar */}
                <div
                  className={`file-payload-bar ${
                    isMasterUnlocked
                      ? "payload-plaintext"
                      : isPreviewOpen
                        ? "payload-preview"
                        : "payload-cipher"
                  }`}
                >
                  {isMasterUnlocked ? (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "4px",
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "#065f46",
                        }}
                      >
                        <span>⚡ DECRYPTED MASTER IP (Transient doDecrypt Assembler):</span>
                        <span
                          style={{
                            background: "#059669",
                            color: "white",
                            fontSize: "9px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: 800,
                          }}
                        >
                          VERIFIED
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "11.5px", lineHeight: 1.45 }}>
                        {asset.unlockedPlaintext}
                      </p>
                    </div>
                  ) : isPreviewOpen ? (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "4px",
                          fontSize: "10.5px",
                          fontWeight: 800,
                          color: "#164e63",
                        }}
                      >
                        <span>👁️ CO-AUTHOR WORKING PREVIEW (TideCloak Tag Policy):</span>
                        <span
                          style={{
                            background: "#0891b2",
                            color: "white",
                            fontSize: "9px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: 800,
                          }}
                        >
                          TAG-BOUND
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "11.5px", lineHeight: 1.45 }}>
                        {asset.workingPreview}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "3px",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#64748b",
                        }}
                      >
                        <span>🔒 100% BLIND CIPHERTEXT AT REST (AES-256-GCM)</span>
                        <span>Requires 3/3 Shards to Reconstruct Key</span>
                      </div>
                      <code>{asset.encryptedEnvelope}</code>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
