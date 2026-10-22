import React from "react";

const ROGUE_BLOCK_PAYLOAD = {
  status: 403,
  error: "UNILATERAL_EXFILTRATION_BLOCKED",
  message:
    "Access Denied by TideCloak. Nhật Tân only holds 1 of 3 required co-author authority shards. Master Key does not exist.",
};

export default function RogueAttackView({
  rogueActor,
  assets,
  rogueBreachLogged,
  rogueAttemptCount,
  isShardRevoked,
  onTriggerRogueAttack,
  onNavigateTab,
}) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="eyebrow danger-eyebrow">
            <span /> FLOW 1 · INSIDER THREAT SIMULATION (THE ROGUE CO-AUTHOR ATTACK)
          </div>
          <h2>Rogue Co-Author Unilateral Exfiltration Attempt</h2>
        </div>
        <span className={`status-pill ${isShardRevoked ? "crimson" : "amber"}`}>
          {isShardRevoked
            ? "🚫 Shard 3/3 Revoked by Ethics Chair"
            : rogueBreachLogged
              ? "🚨 Breach Flagged in Immutable Audit Log"
              : "⚠️ Holds 1 of 3 Authority Shards"}
        </span>
      </div>

      {/* Rogue Actor Scenario Card */}
      <div className="rogue-scenario-card">
        <div className="rogue-profile">
          <span className="avatar rogue-avatar">{rogueActor.avatar}</span>
          <div>
            <div className="rogue-badge-row">
              <strong>{rogueActor.name}</strong>
              <span className="rogue-role-tag">{rogueActor.roleTitle}</span>
              <span className="shard-chip danger">
                {isShardRevoked
                  ? "Shard 3/3 — REVOKED"
                  : "Holds Only 1 of 3 Required Shards"}
              </span>
            </div>
            <p className="rogue-desc">
              <strong>Attack Scenario:</strong> Nhật Tân received a covert acquisition
              offer from an external buyer (<b>Apex BioTech Corp</b>) and is attempting to
              unilaterally download the trained <code>brain_cancer_model.pth</code>{" "}
              weights (400 GPU hours) and <code>confidential_patient_dataset.csv</code>{" "}
              (1,200 patient records) without co-author consent.
            </p>
          </div>
        </div>

        <div className="rogue-target-box">
          <div className="rogue-target-list">
            <span className="target-label">TARGETED FOR COVERT EXFILTRATION:</span>
            <div className="target-chips">
              {assets.map((asset) => (
                <span key={asset.id} className="target-file-chip">
                  {asset.icon} <code>{asset.fileName}</code> ({asset.size}) ·{" "}
                  <b>LOCKED</b>
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="button danger-cta"
            onClick={onTriggerRogueAttack}
          >
            🚨 Nhật Tân: Attempt Unilateral IP Export (Sell to Company)
          </button>
        </div>
      </div>

      {/* High-Contrast 403 Cryptographic Block Alert / Modal Display */}
      {rogueBreachLogged && (
        <div className="crypto-block-alert" role="alert">
          <div className="crypto-block-header">
            <div className="crypto-block-title">
              <span className="block-badge">HTTP 403 FORBIDDEN</span>
              <h3>UNILATERAL_EXFILTRATION_BLOCKED — TideCloak Threshold Guard</h3>
            </div>
            <span className="attempt-counter">
              Blocked Attempts Recorded: <b>{rogueAttemptCount}</b>
            </span>
          </div>

          <p className="crypto-block-explanation">
            TideCloak mathematically rejected the decryption request. Because no static
            Master Key exists at rest and Nhật Tân possesses only <b>1 of 3</b> authority
            shards, the browser enclave cannot reconstruct the threshold decryption key.
          </p>

          <pre className="json-payload-box">
            <code>{JSON.stringify(ROGUE_BLOCK_PAYLOAD, null, 2)}</code>
          </pre>

          <div className="breach-consequence-bar">
            <div className="breach-flag-status">
              <span className="pulse-dot" />
              <div>
                <strong>
                  STATUS: BREACH FLAGGED — ELIGIBLE FOR ETHICS ARBITRATION REVOCATION
                </strong>
                <small>
                  Cryptographically signed violation evidence has been appended to the
                  Immutable Audit Log below. Honest co-authors (Khánh Linh &amp; Trung
                  Quân) can now petition Ethics Chair Dr. Cường Thịnh to revoke Nhật
                  Tân’s shard.
                </small>
              </div>
            </div>
            <button
              type="button"
              className="button emerald-cta"
              onClick={() => onNavigateTab("quorum")}
            >
              ⚖️ Escalate to 3-of-3 Dispute Quorum →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
