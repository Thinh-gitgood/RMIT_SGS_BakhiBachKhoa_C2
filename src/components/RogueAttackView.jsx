import React from "react";

export default function RogueAttackView({
  exportBlockModal,
  rogueAttemptCount,
  onCloseModal,
}) {
  if (!exportBlockModal) return null;

  const payload = {
    status: 403,
    error: "UNILATERAL_EXFILTRATION_BLOCKED",
    message:
      "Access Denied by TideCloak. Nhật Tân only holds 1 of 3 required co-author authority shards. Master Key does not exist.",
  };

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

      <div className="shard-deficit-bar">
        <span className="deficit-badge">🔑 1 / 3 SHARDS PRESENT</span>
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
              This violation is permanently signed in the Activity Log. Dr. Cường
              Thịnh can now revoke Nhật Tân’s shard and co-sign <b>Slot 3</b> in the
              Quorum Panel on the right.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
