import React from "react";

export default function QuorumDisputeView({
  coAuthors,
  arbitrator,
  assets,
  signedShards,
  rogueBreachLogged,
  onSignShard,
  onTriggerRogueAttack,
  certificateTimestamp,
}) {
  const linh = coAuthors.find((a) => a.id === "linh");
  const quan = coAuthors.find((a) => a.id === "quan");
  const tan = coAuthors.find((a) => a.id === "tan");

  const shardList = [
    {
      key: "linh",
      actor: linh,
      badge: "SHARD 1 OF 3 · CO-AUTHOR SHARE",
      buttonLabel: "👩‍🔬 Khánh Linh: Sign Shard 1/3 (Co-Author Approval)",
      signedLabel: "✓ Shard 1/3 Signed by Khánh Linh",
      sigHash: "0x94a8f1c2...e71b309d (Ed25519 · TideCloak Enclave)",
      statement:
        "I approve the official IEEE manuscript submission and licensed clinical release of the 3D-ViT brain tumor weights.",
    },
    {
      key: "quan",
      actor: quan,
      badge: "SHARD 2 OF 3 · CO-AUTHOR SHARE",
      buttonLabel: "👨‍💻 Trung Quân: Sign Shard 2/3 (Co-Author Approval)",
      signedLabel: "✓ Shard 2/3 Signed by Trung Quân",
      sigHash: "0x3c7d09b4...a82f614e (Ed25519 · TideCloak Enclave)",
      statement:
        "I verify that all 1,200 patient MRI records are de-identified under RMIT Ethics Protocol and approve 3/3 release.",
    },
    {
      key: "thinh",
      actor: arbitrator,
      badge: "SHARD 3 OF 3 · ETHICS ARBITRATOR",
      buttonLabel:
        "⚖️ Dr. Cường Thịnh: Revoke Nhật Tân & Sign Arbitration Shard 3/3",
      signedLabel: "✓ Nhật Tân Revoked & Shard 3/3 Co-Signed by Dr. Cường Thịnh",
      sigHash: "0x7f12e5d9...c04a883b (RMIT Ethics Chair Arbitration Key)",
      statement:
        "Audit Log confirms Nhật Tân’s unilateral 403 exfiltration attempt. Invoking Academic Dispute Resolution to revoke Nhật Tân’s shard and prevent project deadlock.",
      isArbitration: true,
    },
  ];

  const quorumCount = Object.values(signedShards).filter(Boolean).length;
  const isMasterUnlocked = quorumCount === 3;
  const progressPercent = Math.round((quorumCount / 3) * 100);

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span /> FLOW 3 · DEADLOCK-PROOF DISPUTE ARBITRATION &amp; EMERGENT AUTHORITY
          </div>
          <h2>3-of-3 Threshold Key Shard Assembler</h2>
        </div>
        <span className={`status-pill ${isMasterUnlocked ? "emerald" : "amber"}`}>
          {isMasterUnlocked
            ? "⚡ 3/3 Shards Aligned — Emergent Authority Active"
            : `🔐 Quorum Progress: ${quorumCount} of 3 Shards Signed`}
        </span>
      </div>

      {/* Breach Evidence & Anti-Deadlock Banner */}
      <div className={`arbitration-context-card ${rogueBreachLogged ? "flagged" : ""}`}>
        <div>
          <span className="context-kicker">
            {rogueBreachLogged
              ? "🚨 IMMUTABLE BREACH EVIDENCE VERIFIED IN AUDIT LOG"
              : "⚖️ CRYPTOGRAPHIC GUARDRAIL · ANTI-COLLUSION & DEADLOCK PROTECTION"}
          </span>
          <h3>
            {rogueBreachLogged
              ? `Rogue Member (${tan.name}) Flagged for Unilateral 403 Exfiltration — Arbitration Shard Unlocked`
              : "Why 3-of-3 Threshold Shares & Breach-Gated Arbitration?"}
          </h3>
          <p>
            All 3 IP assets are sealed together under <b>3-of-3 Threshold Secret Sharing</b>{" "}
            (not 1 key per file, which would still allow single-file theft). Furthermore,
            Ethics Chair <b>{arbitrator.name}’s Arbitration Shard 3/3 is cryptographically dormant</b>{" "}
            while {tan.name} is in good standing—preventing 2 students and an advisor from
            unfairly colluding to exclude an innocent co-author.
          </p>
        </div>
        {!rogueBreachLogged && !signedShards.thinh && (
          <button
            type="button"
            className="button danger-sm"
            onClick={onTriggerRogueAttack}
          >
            🚨 Simulate Nhật Tân’s 403 Breach First
          </button>
        )}
      </div>

      {/* 3-of-3 Key Shard Progress Bar */}
      <div className="quorum-progress-shell">
        <div className="quorum-progress-labels">
          <span>
            BUNDLE THRESHOLD ASSEMBLY:{" "}
            <b>
              {quorumCount}/3 AUTHORITY SHARDS ({progressPercent}%)
            </b>
          </span>
          <span className={isMasterUnlocked ? "emerald-text" : "muted-text"}>
            {isMasterUnlocked
              ? "✓ Transient In-Browser Key Reconstructed via TideCloak doDecrypt()"
              : `Requires ${3 - quorumCount} more cryptographic signature(s) to reconstruct Master Bundle key`}
          </span>
        </div>
        <div className="quorum-progress-track">
          <div
            className={`quorum-progress-fill ${isMasterUnlocked ? "complete" : ""}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="quorum-steps-row">
          <span className={quorumCount >= 0 ? "step-active" : ""}>
            0/3 Blind At Rest
          </span>
          <span className={quorumCount >= 1 ? "step-active" : ""}>
            1/3 Co-Author Share 1
          </span>
          <span className={quorumCount >= 2 ? "step-active" : ""}>
            2/3 Co-Author Share 2
          </span>
          <span className={isMasterUnlocked ? "step-complete" : ""}>
            3/3 Emergent Authority Unlocked
          </span>
        </div>
      </div>

      {/* 3 Co-Sign Shard Cards */}
      <div className="shard-grid">
        {shardList.map((item) => {
          const isSigned = Boolean(signedShards[item.key]);
          const isDormantArbitrator = item.isArbitration && !rogueBreachLogged && !isSigned;
          const isEligibleArbitrator = item.isArbitration && rogueBreachLogged && !isSigned;

          let stateLabel = "AWAITING";
          let stateClass = "pending";
          if (isSigned) {
            stateLabel = "SIGNED";
            stateClass = "signed";
          } else if (isDormantArbitrator) {
            stateLabel = "🔒 DORMANT (NO BREACH)";
            stateClass = "dormant";
          } else if (isEligibleArbitrator) {
            stateLabel = "⚡ BREACH VERIFIED — ELIGIBLE";
            stateClass = "eligible";
          }

          return (
            <article
              key={item.key}
              className={`shard-card ${isSigned ? "signed" : ""} ${
                item.isArbitration ? "arbitration-card" : ""
              } ${isDormantArbitrator ? "dormant-card" : ""} ${
                isEligibleArbitrator ? "eligible-card" : ""
              }`}
            >
              <div className="shard-card-top">
                <span className="shard-badge">{item.badge}</span>
                <span className={`shard-state ${stateClass}`}>{stateLabel}</span>
              </div>

              <div className="shard-person">
                <span className={`avatar ${isSigned ? "signed-avatar" : ""}`}>
                  {item.actor.avatar}
                </span>
                <div>
                  <strong>{item.actor.name}</strong>
                  <small>{item.actor.roleTitle}</small>
                </div>
              </div>

              {item.isArbitration && (
                <div className={`revocation-pill ${isDormantArbitrator ? "dormant-pill" : ""}`}>
                  {isSigned
                    ? "🚫 Nhật Tân’s Shard 3/3 Permanently Revoked"
                    : isDormantArbitrator
                      ? "🛡️ Guardrail Active: Locked While Nhật Tân Is in Good Standing"
                      : "⚡ Breach Logged: Authorized to Revoke Nhật Tân’s Shard 3/3"}
                </div>
              )}

              {isDormantArbitrator ? (
                <div className="guardrail-box">
                  <strong>Cryptographic Anti-Collusion Guardrails:</strong>
                  <ul>
                    <li>
                      <b>1/3 Bounded Shard:</b> Cannot decrypt anything alone (needs 2
                      co-authors).
                    </li>
                    <li>
                      <b>Breach-Triggered Policy:</b> Locked in Dormant state while Nhật
                      Tân is in good standing—prevents unfair collusion against a teammate.
                    </li>
                  </ul>
                </div>
              ) : (
                <p className="shard-statement">“{item.statement}”</p>
              )}

              {isSigned ? (
                <div className="signature-proof-box">
                  <strong>{item.signedLabel}</strong>
                  <code>{item.sigHash}</code>
                </div>
              ) : isDormantArbitrator ? (
                <div className="dormant-actions">
                  <button
                    type="button"
                    className="button full-width"
                    disabled
                  >
                    🔒 Dormant — Requires Immutable 403 Breach in Audit Log
                  </button>
                  <button
                    type="button"
                    className="button outline full-width simulate-breach-btn"
                    onClick={onTriggerRogueAttack}
                  >
                    🚨 Simulate Nhật Tân’s 403 Breach to Unlock Arbitration
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={`button full-width ${
                    item.isArbitration ? "arbitration-btn" : "dark"
                  }`}
                  onClick={() => onSignShard(item.key)}
                >
                  {item.buttonLabel}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* Verified IP Release Certificate (Rendered when 3/3 Quorum Aligns) */}
      {isMasterUnlocked && (
        <div
          className="certificate-shell"
          role="region"
          aria-label="Verified IP Release Certificate"
        >
          <div className="certificate-header">
            <div>
              <span className="cert-kicker">
                ⚡ TIDECLOAK EMERGENT AUTHORITY · SOVEREIGN RELEASE CERTIFICATE
              </span>
              <h3>Verified Academic IP &amp; Commercialization Release Certificate</h3>
            </div>
            <div className="cert-seal">
              <span>3/3 QUORUM</span>
              <strong>VERIFIED</strong>
            </div>
          </div>

          <div className="cert-meta-grid">
            <div>
              <span>CERTIFICATE ID</span>
              <strong>CERT-TIDE-RMIT-2026-303</strong>
            </div>
            <div>
              <span>DECRYPTION ENCLAVE</span>
              <strong>TideCloak In-Browser doDecrypt()</strong>
            </div>
            <div>
              <span>ROGUE SHARD STATUS</span>
              <strong className="crimson-text">
                Nhật Tân (Shard 3/3) REVOKED
              </strong>
            </div>
            <div>
              <span>TIMESTAMP (UTC)</span>
              <strong>{certificateTimestamp || new Date().toISOString()}</strong>
            </div>
          </div>

          <div className="cert-unlocked-assets">
            <h4>🔓 Transiently Reconstructed Plaintext IP Bundle (In-Browser Only)</h4>
            <div className="cert-asset-list">
              {assets.map((asset) => (
                <div key={asset.id} className="cert-asset-item">
                  <div className="cert-asset-name">
                    <span>{asset.icon}</span>
                    <div>
                      <strong>{asset.fileName}</strong>
                      <code>Tag: _tide_{asset.tag} · {asset.size}</code>
                    </div>
                    <span className="unlocked-pill">PLAINTEXT UNLOCKED</span>
                  </div>
                  <p className="cert-asset-plaintext">{asset.unlockedPlaintext}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
