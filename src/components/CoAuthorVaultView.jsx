import React from "react";
import RogueAttackView from "./RogueAttackView.jsx";

export default function CoAuthorVaultView({
  assets,
  activeUser,
  workingPreviewUnlocked,
  onToggleWorkingPreview,
  onAttemptExport,
  quorumCount,
  isMasterUnlocked,
  exportBlockModal,
  rogueAttemptCount,
  onCloseBlockModal,
}) {
  const isAdvisor = activeUser?.id === "thinh";
  const isRogueUser = activeUser?.id === "tan";

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
            <span className="avatar mini">{activeUser?.avatar}</span>
            <span>
              Viewing as <strong>{activeUser?.name}</strong> ({activeUser?.roleTitle})
            </span>
            <span className={`shard-chip ${isRogueUser ? "danger" : ""}`}>
              {activeUser?.shardLabel}
            </span>
          </div>
          <span className="bundle-status-text">
            {isMasterUnlocked
              ? "🔓 3/3 Quorum Verified — Full Plaintext Unlocked"
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

            return (
              <article
                key={asset.id}
                className={`file-row-card ${
                  isMasterUnlocked ? "file-unlocked" : ""
                }`}
              >
                <div className="file-row-main">
                  <div className="file-info">
                    <span className="file-icon">{asset.icon}</span>
                    <div>
                      <div className="file-name-line">
                        <strong className="file-name">{asset.fileName}</strong>
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
                      <p className="file-subtitle">{asset.title}</p>
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
                    >
                      ⬇️ Export
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
                    <span>
                      <b>⚡ DECRYPTED MASTER IP:</b> {asset.unlockedPlaintext}
                    </span>
                  ) : isPreviewOpen ? (
                    <span>
                      <b>👁️ CO-AUTHOR WORKING PREVIEW:</b> {asset.workingPreview}
                    </span>
                  ) : (
                    <code>{asset.encryptedEnvelope}</code>
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
