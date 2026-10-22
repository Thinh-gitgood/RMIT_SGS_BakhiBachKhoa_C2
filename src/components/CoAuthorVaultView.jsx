import React from "react";

export default function CoAuthorVaultView({
  assets,
  coAuthors,
  activeCoAuthorId,
  setActiveCoAuthorId,
  workingPreviewUnlocked,
  onToggleWorkingPreview,
  onUnlockAllPreviews,
  quorumCount,
  isMasterUnlocked,
  rogueBreachLogged,
  onNavigateTab,
}) {
  const honestCoAuthors = coAuthors.filter((author) => !author.isRogue);
  const currentAuthor =
    honestCoAuthors.find((a) => a.id === activeCoAuthorId) || honestCoAuthors[0];

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span /> TIER-1 &amp; TIER-2 CRYPTOGRAPHIC VAULT · CO-AUTHOR WORKSPACE
          </div>
          <h2>Joint Capstone &amp; Biomedical IP Vault</h2>
        </div>
        <div className="vault-header-pills">
          <span className={`status-pill ${isMasterUnlocked ? "emerald" : "amber"}`}>
            {isMasterUnlocked
              ? "⚡ Master Bundle: 3/3 Emergent Authority Active"
              : `🔒 Master Bundle Locked (${quorumCount}/3 Shards)`}
          </span>
        </div>
      </div>

      {/* Co-Author Identity & Two-Tier Architecture Bar */}
      <div className="actor-bar">
        <div className="actor-selector-group">
          <span className="actor-label">ACTIVE CO-AUTHOR IDENTITY:</span>
          <div className="actor-pills">
            {honestCoAuthors.map((author) => (
              <button
                key={author.id}
                type="button"
                className={`actor-pill ${currentAuthor.id === author.id ? "active" : ""}`}
                onClick={() => setActiveCoAuthorId(author.id)}
              >
                <span className="avatar mini">{author.avatar}</span>
                <span>
                  <strong>{author.name}</strong> · {author.roleTitle}
                </span>
                <span className="shard-chip">{author.shardLabel}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="actor-bar-actions">
          <button
            type="button"
            className="button outline"
            onClick={onUnlockAllPreviews}
          >
            🔑 Decrypt All Tier-1 Previews
          </button>
          <button
            type="button"
            className="button dark"
            onClick={() => onNavigateTab("quorum")}
          >
            {isMasterUnlocked
              ? "📜 View 3/3 Release Certificate →"
              : "⚖️ Open 3/3 Quorum Assembler →"}
          </button>
        </div>
      </div>

      {rogueBreachLogged && !isMasterUnlocked && (
        <div className="breach-banner" role="alert">
          <div>
            <strong>🚨 SECURITY ALERT — INSIDER EXFILTRATION ATTEMPT DETECTED:</strong>{" "}
            Co-author <b>Nhật Tân (Shard 3/3)</b> attempted unilateral export of{" "}
            <code>brain_cancer_model.pth</code> &amp;{" "}
            <code>confidential_patient_dataset.csv</code>. Breach is cryptographically
            recorded in the Audit Trail.
          </div>
          <button
            type="button"
            className="button danger-sm"
            onClick={() => onNavigateTab("quorum")}
          >
            ⚖️ Invoke Ethics Arbitration (3/3) →
          </button>
        </div>
      )}

      {/* 3 Protected IP Assets Grid */}
      <div className="course-grid">
        {assets.map((asset) => {
          const isTier1Unlocked = Boolean(workingPreviewUnlocked[asset.id]);
          return (
            <article
              className={`course-card asset-card ${
                isMasterUnlocked ? "master-unlocked" : ""
              }`}
              key={asset.id}
            >
              <div className="course-top">
                <span className="course-code">
                  {asset.code} · <code>_tide_{asset.tag}</code>
                </span>
                <span className="seats open">{asset.size}</span>
              </div>

              <div className="asset-title-row">
                <span className="asset-icon">{asset.icon}</span>
                <div>
                  <h3>{asset.title}</h3>
                  <code className="asset-filename">{asset.fileName}</code>
                </div>
              </div>

              <div className="course-stats">
                <span>
                  Cipher <b>{asset.cipherSuite}</b>
                </span>
                <span>
                  Custody <b>Zero Master Key</b>
                </span>
              </div>

              {/* Tier 1: Tag-Bound Working Preview */}
              <div className={`tier-box ${isTier1Unlocked ? "unlocked-tier1" : ""}`}>
                <div className="tier-box-head">
                  <span className="tier-badge">
                    TIER 1 · WORKING PREVIEW ({currentAuthor.shardLabel})
                  </span>
                  <button
                    type="button"
                    className="tier-toggle-btn"
                    onClick={() => onToggleWorkingPreview(asset)}
                  >
                    {isTier1Unlocked ? "Lock Ciphertext" : "Decrypt with Tide Tag"}
                  </button>
                </div>
                <p className="tier-content">
                  {isTier1Unlocked ? asset.workingPreview : asset.encryptedEnvelope}
                </p>
              </div>

              {/* Tier 2: Quorum-Locked Master IP Bundle */}
              <div
                className={`tier-box tier2-box ${
                  isMasterUnlocked ? "unlocked-tier2" : "locked-tier2"
                }`}
              >
                <div className="tier-box-head">
                  <span className="tier-badge">
                    {isMasterUnlocked
                      ? "⚡ TIER 2 · EMERGENT AUTHORITY UNLOCKED (3/3)"
                      : `🔒 TIER 2 · MASTER IP BUNDLE (${quorumCount}/3 SHARDS)`}
                  </span>
                </div>
                {isMasterUnlocked ? (
                  <p className="tier-content plaintext-unlocked">
                    {asset.unlockedPlaintext}
                  </p>
                ) : (
                  <p className="tier-content locked-note">
                    Sealed by <b>3-of-3 Threshold Secret Sharing</b> across the joint
                    Master Bundle (not 1 key per file). {currentAuthor.name} holds only 1
                    of 3 cryptographic shares—full export requires 3/3 Quorum alignment.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
