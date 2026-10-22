import React, { useState } from "react";

export default function RogueAttackView({
  exportBlockModal,
  rogueAttemptCount,
  onCloseModal,
}) {
  if (!exportBlockModal) return null;

  const [copied, setCopied] = useState(false);

  const targetFileName =
    exportBlockModal.targetFile || "Full Master IP Bundle (3 Files)";
  const actorName = exportBlockModal.actorName || "Nhật Tân";
  const timestamp = new Date().toISOString();

  const evidencePayload = {
    status: 403,
    error: "UNILATERAL_EXFILTRATION_BLOCKED",
    timestamp,
    target_asset: targetFileName,
    violator: {
      actor: actorName,
      claimed_role: "co-author",
      authority_shards_presented: "1 of 3",
      shard_id: "SHARD-03-TAN-ROGUE",
      verification_status: "MATHEMATICALLY_INSUFFICIENT",
    },
    cryptographic_enforcement: {
      enclave: "TideCloak Emergent Authority DKG",
      quorum_rule: "3-of-3 Unanimous / Arbitration Consensus",
      master_key_at_rest: null,
      server_decryption_capability: false,
      immutable_audit_ref: `LOG-BREACH-${Date.now().toString(16).toUpperCase()}`,
      signature_proof: "ed25519:7f8e3b2c1d0a...tidecloak_tamper_evident",
    },
    message:
      "Access Denied by TideCloak. Nhật Tân only holds 1 of 3 required co-author authority shards. Master Key does not exist at rest.",
  };

  const handleCopyEvidence = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          JSON.stringify(evidencePayload, null, 2)
        );
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="crypto-block-alert" role="alert">
      {/* Header */}
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

      {/* Shard Deficit Bar */}
      <div className="shard-deficit-bar">
        <span className="deficit-badge">🔑 1 / 3 SHARDS PRESENT</span>
        <span>
          Unauthorized export attempt on <code>{targetFileName}</code> by{" "}
          <b>{actorName}</b> was rejected mathematically. 1 shard cannot decrypt
          AES-256-GCM blind ciphertext.
        </span>
      </div>

      {/* Threshold Verification Matrix */}
      <div
        className="verification-matrix-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "8px",
          margin: "10px 0 12px",
        }}
      >
        {/* Card 1: Presented Authority */}
        <div
          style={{
            background: "rgba(225, 29, 72, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.4)",
            borderRadius: "7px",
            padding: "9px 11px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#fda4af",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            PRESENTED AUTHORITY
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>🔑</span>
            <span>1 / 3 Shards (Nhật Tân)</span>
          </div>
          <div
            style={{
              marginTop: "4px",
              display: "inline-block",
              background: "#be123c",
              color: "#fff",
              fontSize: "9px",
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            🚨 INSUFFICIENT · REJECTED
          </div>
        </div>

        {/* Card 2: Required Authority */}
        <div
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "7px",
            padding: "9px 11px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#6ee7b7",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            REQUIRED AUTHORITY
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>🔐</span>
            <span>3 / 3 Shards (Threshold DKG)</span>
          </div>
          <div
            style={{
              marginTop: "4px",
              display: "inline-block",
              background: "#065f46",
              color: "#a7f3d0",
              fontSize: "9px",
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            🛡️ QUORUM MANDATE
          </div>
        </div>

        {/* Card 3: Master Key at Rest */}
        <div
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            borderRadius: "7px",
            padding: "9px 11px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#fcd34d",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            MASTER KEY AT REST
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>🚫</span>
            <span>NONE (Zero-Knowledge Enclave)</span>
          </div>
          <div
            style={{
              marginTop: "4px",
              display: "inline-block",
              background: "#78350f",
              color: "#fde68a",
              fontSize: "9px",
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            🔒 ZERO CUSTODY
          </div>
        </div>
      </div>

      {/* JSON Payload with Copy Button Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <span
          style={{
            fontSize: "10.5px",
            color: "#fda4af",
            fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          EVIDENCE PAYLOAD (Signed Breach Record)
        </span>
        <button
          type="button"
          onClick={handleCopyEvidence}
          style={{
            background: copied ? "#059669" : "rgba(255, 255, 255, 0.12)",
            color: "#fff",
            border: "1px solid rgba(253, 164, 175, 0.35)",
            borderRadius: "5px",
            padding: "4px 9px",
            fontSize: "10.5px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.15s ease",
          }}
        >
          {copied ? "✓ Copied Breach Proof!" : "📋 Copy Signed 403 Evidence JSON"}
        </button>
      </div>

      <pre className="json-payload-box" style={{ margin: "0 0 10px" }}>
        <code>{JSON.stringify(evidencePayload, null, 2)}</code>
      </pre>

      {/* Next Step Callout Box */}
      <div
        className="next-step-callout"
        style={{
          background: "linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.6))",
          border: "1.5px solid #3b82f6",
          borderRadius: "8px",
          padding: "10px 12px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: "#93c5fd",
            marginBottom: "3px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>👉</span>
          <span>
            Bằng chứng vi phạm đã mở khóa <strong>Slot 3 (Dr. Cường Thịnh)</strong> ở cột{" "}
            <strong>3-of-3 Release Quorum</strong> bên phải!
          </span>
        </div>
        <div
          style={{
            fontSize: "10.5px",
            color: "#bfdbfe",
            lineHeight: "1.4",
            paddingLeft: "22px",
          }}
        >
          Hệ thống ghi nhận bằng chứng bất biến. Giảng viên cố vấn học thuật giờ đây có thẩm quyền kích hoạt
          phân xử đạo đức (<strong>Ethics Dispute Arbitration</strong>), thu hồi mảnh khóa của Nhật Tân và ký thay mảnh thứ 3 để giải cứu đồ án.
        </div>
      </div>

      {/* Breach Consequence Status */}
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
