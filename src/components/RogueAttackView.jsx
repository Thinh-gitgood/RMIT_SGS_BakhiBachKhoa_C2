import React, { useState } from "react";

export default function RogueAttackView({
  exportBlockModal,
  rogueAttemptCount,
  onCloseModal,
}) {
  const [copiedProof, setCopiedProof] = useState(false);

  if (!exportBlockModal) return null;

  const payload = {
    status: 403,
    error: "UNILATERAL_EXFILTRATION_BLOCKED",
    message:
      "Access Denied by TideCloak. Nhật Tân only holds 1 of 3 required co-author authority shards. Master Key does not exist.",
    targetAsset: exportBlockModal.targetFile,
    actor: exportBlockModal.actorName,
    proofTimestamp: new Date().toISOString(),
  };

  async function handleCopyBreachProof() {
    const text = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedProof(true);
    setTimeout(() => setCopiedProof(false), 2000);
  }

  return (
    <div className="crypto-block-alert" role="alert">
      <div className="crypto-block-header">
        <div className="crypto-block-title">
          <span className="block-badge">HTTP 403 FORBIDDEN</span>
          <h3>UNILATERAL_EXFILTRATION_BLOCKED</h3>
        </div>
        <div className="crypto-block-meta">
          <span className="attempt-counter">
            Blocked Exports: <b>{rogueAttemptCount}</b>
          </span>
          <button
            type="button"
            className="button outline btn-sm"
            style={{ padding: "5px 10px", fontSize: "11px" }}
            onClick={handleCopyBreachProof}
          >
            {copiedProof ? "Copied Breach Proof" : "Copy 403 Evidence JSON"}
          </button>
          {onCloseModal && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onCloseModal}
              aria-label="Close alert"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Threshold Verification Matrix */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            border: "1px solid rgba(229, 115, 115, 0.45)",
            borderRadius: "12px",
            padding: "8px 11px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#8c3434",
              textTransform: "uppercase",
            }}
          >
            Presented Authority
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#b93838",
              marginTop: "2px",
            }}
          >
            1 / 3 Shards (INSUFFICIENT)
          </div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            border: "1px solid rgba(124, 158, 178, 0.4)",
            borderRadius: "12px",
            padding: "8px 11px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#4a6d82",
              textTransform: "uppercase",
            }}
          >
            Required Quorum
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#2d3748",
              marginTop: "2px",
            }}
          >
            3 / 3 Threshold Shards
          </div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            border: "1px solid rgba(124, 158, 178, 0.4)",
            borderRadius: "12px",
            padding: "8px 11px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#4a6d82",
              textTransform: "uppercase",
            }}
          >
            Master Key at Rest
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#286a4b",
              marginTop: "2px",
            }}
          >
            NONE (Zero-Knowledge)
          </div>
        </div>
      </div>

      <div className="shard-deficit-bar">
        <span className="deficit-badge">1 / 3 SHARDS PRESENT</span>
        <span>
          Export attempt on <code>{exportBlockModal.targetFile}</code> by{" "}
          <b>{exportBlockModal.actorName}</b> was mathematically rejected—cannot
          reconstruct 3-of-3 threshold key.
        </span>
      </div>

      <pre className="json-payload-box">
        <code>{JSON.stringify(payload, null, 2)}</code>
      </pre>

      <div className="breach-consequence-bar">
        <div className="breach-flag-status">
          <span className="pulse-dot" />
          <div>
            <strong>
              IMMUTABLE BREACH LOGGED — ETHICS ARBITRATION SHARD (3/3) UNLOCKED
            </strong>
            <small>
              Next Step: This violation is permanently signed in the Activity
              Log. <b>Dr. Cường Thịnh</b> can now revoke Nhật Tân’s shard and
              co-sign <b>Slot 3</b> in the 3-of-3 Release Quorum panel on the
              right.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
