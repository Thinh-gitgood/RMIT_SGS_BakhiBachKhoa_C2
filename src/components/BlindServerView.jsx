import React, { useState } from "react";

const ADMIN_BLOCK_PAYLOAD = {
  status: 403,
  error: "ZERO_CUSTODY_ENFORCED",
  message:
    "Cryptographic Failure: Infrastructure Operator holds 0 of 3 authority shards. Server possesses only blind ciphertext.",
  enforcement_details: {
    system: "TideCloak Zero-Custody Enclave",
    operator_role: "sysadmin",
    held_authority_shards: 0,
    required_authority_shards: 3,
    server_master_key_present: false,
    verdict: "ROOT_OVERRIDE_MATHEMATICALLY_IMPOSSIBLE",
  },
};

export default function BlindServerView({
  adminActor,
  assets,
  adminOverrideBlocked,
  adminAttemptCount,
  onTriggerAdminOverride,
  onReturnToVault,
}) {
  const [viewMode, setViewMode] = useState("postgres"); // "postgres" | "s3"
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleCopyAdminPayload = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          JSON.stringify(ADMIN_BLOCK_PAYLOAD, null, 2)
        );
      }
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    } catch {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    }
  };

  const s3Manifest = {
    bucket_arn: "arn:aws:s3:::rmit-scholarlock-vault-sea",
    region: "ap-southeast-1 (Saigon / RMIT Node)",
    storage_architecture: "TideCloak-Blind-Storage-v2",
    server_custody_audit: {
      server_master_key: null,
      admin_held_shards: 0,
      cloud_operator_decryption_capability: "MATHEMATICALLY_IMPOSSIBLE",
      key_at_rest_detected: false,
    },
    enclave_kms_attestation: {
      tidecloak_dkg_enclave: "VERIFIED_SEALED",
      ephemeral_quorum_required: "3-of-3",
      browser_transient_assembly: true,
      root_override_privilege: "BLOCKED_BY_MATHEMATICS (403 ZERO_CUSTODY)",
    },
    encrypted_blobs: assets.map((a) => ({
      s3_uri: `s3://rmit-scholarlock-vault-sea/blobs/${a.tag}/${a.fileName}.enc`,
      cipher_suite: "AES-256-GCM · TIDE_E2EE_V1",
      tide_policy_tag: a.tag,
      nominal_size: a.size,
      raw_ciphertext_header: a.encryptedEnvelope,
      payload_entropy: "7.9998 bits/byte (Indistinguishable from True Random Noise)",
      admin_plaintext_exposure: "0 bytes (100% Blind Storage)",
    })),
  };

  return (
    <section className="server-workspace">
      <div className="panel-card server-panel-card">
        {/* Header */}
        <div className="vault-panel-header">
          <div>
            <span className="panel-kicker">
              INFRASTRUCTURE CONSOLE · POSTGRESQL &amp; S3 BLOB INSPECTOR
            </span>
            <h2>🗄️ Raw Server Database View ({adminActor.name})</h2>
          </div>

          <div className="server-header-actions">
            {onReturnToVault && (
              <button
                type="button"
                className="button outline"
                onClick={onReturnToVault}
              >
                ← Back to Project Vault
              </button>
            )}
            <button
              type="button"
              className="button danger-cta"
              onClick={onTriggerAdminOverride}
            >
              ⛔ Force Decrypt / Export DB
            </button>
          </div>
        </div>

        {/* User Context Strip */}
        <div className="user-context-strip server-strip">
          <div className="user-context-left">
            <span className="avatar mini">{adminActor.avatar}</span>
            <span>
              Connected as <strong>{adminActor.name}</strong> ({adminActor.roleTitle})
            </span>
            <span className="shard-chip danger">{adminActor.shardLabel}</span>
          </div>
          <span className="bundle-status-text">
            🛡️ Zero Master Key at Rest — Server stores 100% blind AES-256-GCM ciphertext
          </span>
        </div>

        {/* 403 ZERO_CUSTODY_ENFORCED Block Modal */}
        {adminOverrideBlocked && (
          <div className="crypto-block-alert" role="alert" style={{ marginBottom: "14px" }}>
            <div className="crypto-block-header">
              <div className="crypto-block-title">
                <span className="block-badge">HTTP 403 FORBIDDEN</span>
                <h3>ZERO_CUSTODY_ENFORCED — No Server Master Key Exists</h3>
              </div>
              <div className="crypto-block-meta">
                <span className="attempt-counter">
                  Blocked Root Overrides: <b>{adminAttemptCount}</b>
                </span>
              </div>
            </div>

            <div className="shard-deficit-bar">
              <span className="deficit-badge">🔑 0 / 3 SHARDS PRESENT</span>
              <span>
                Root database dump / force-decrypt rejected: Infrastructure operator
                holds <b>0 authority shards</b> and possesses only blind ciphertext.
              </span>
            </div>

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
                ADMIN ZERO-CUSTODY ATTESTATION
              </span>
              <button
                type="button"
                onClick={handleCopyAdminPayload}
                style={{
                  background: copiedPayload ? "#059669" : "rgba(255, 255, 255, 0.12)",
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
                {copiedPayload ? "✓ Copied!" : "📋 Copy Signed 403 Evidence JSON"}
              </button>
            </div>

            <pre className="json-payload-box" style={{ margin: "0 0 10px" }}>
              <code>{JSON.stringify(ADMIN_BLOCK_PAYLOAD, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* View Mode Switcher Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px 8px 0 0",
            padding: "8px 12px",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setViewMode("postgres")}
              style={{
                background: viewMode === "postgres" ? "#0f172a" : "transparent",
                color: viewMode === "postgres" ? "#38bdf8" : "#94a3b8",
                border: viewMode === "postgres" ? "1px solid #0284c7" : "1px solid transparent",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span>🗄️</span>
              <span>PostgreSQL Table View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("s3")}
              style={{
                background: viewMode === "s3" ? "#0f172a" : "transparent",
                color: viewMode === "s3" ? "#38bdf8" : "#94a3b8",
                border: viewMode === "s3" ? "1px solid #0284c7" : "1px solid transparent",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span>📦</span>
              <span>Raw S3 / KMS Hex &amp; JSON Dump</span>
            </button>
          </div>

          <span
            style={{
              fontSize: "10px",
              fontFamily: "JetBrains Mono, monospace",
              color: "#64748b",
            }}
          >
            ENCRYPTION: AES-256-GCM · TIDE_E2EE_V1
          </span>
        </div>

        {/* Terminal Card */}
        <div
          className="terminal-card"
          style={{
            borderRadius: "0 0 10px 10px",
            borderTop: "none",
            marginTop: 0,
          }}
        >
          {viewMode === "postgres" ? (
            <>
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="terminal-title">
                  postgres@rmit-vault-db:~/ip_blobs$ SELECT code, file_name, tide_tag,
                  cipher_envelope FROM capstone_vault;
                </span>
                <span className="terminal-badge">AES-256-GCM BLIND STORAGE</span>
              </div>

              <div className="terminal-table-wrap">
                <table className="terminal-table">
                  <thead>
                    <tr>
                      <th>OBJECT ID</th>
                      <th>FILE NAME</th>
                      <th>TIDECLOAK TAG</th>
                      <th>RAW DATABASE PAYLOAD (100% BLIND CIPHERTEXT)</th>
                      <th>ADMIN READABILITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        <td>
                          <code>{asset.code}</code>
                        </td>
                        <td>
                          <strong>{asset.fileName}</strong>
                          <div className="term-sub">{asset.size}</div>
                        </td>
                        <td>
                          <span className="tag-pill">_tide_{asset.tag}</span>
                        </td>
                        <td>
                          <code className="cipher-blob">{asset.encryptedEnvelope}</code>
                        </td>
                        <td>
                          <span className="blind-badge">🔒 0% · BLIND</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="terminal-title">
                  aws s3api get-object-attributes --bucket rmit-scholarlock-vault-sea --key
                  blobs/manifest.json
                </span>
                <span className="terminal-badge">AWS S3 + TIDECLOAK DKG ENCLAVE</span>
              </div>

              <div style={{ padding: "14px", background: "#090d16" }}>
                <pre
                  style={{
                    margin: 0,
                    color: "#38bdf8",
                    fontSize: "11px",
                    lineHeight: "1.55",
                    fontFamily: "JetBrains Mono, Consolas, monospace",
                    overflowX: "auto",
                  }}
                >
                  <code>{JSON.stringify(s3Manifest, null, 2)}</code>
                </pre>
              </div>
            </>
          )}
        </div>

        {/* Quick Architectural Comparison: Traditional RBAC DB vs. ScholarLock TideCloak Vault */}
        <div
          style={{
            marginTop: "16px",
            background: "#ffffff",
            border: "1.5px solid #d9e2dc",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(19, 42, 39, 0.04)",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#0b7a56",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              ⚡ 3-SECOND ARCHITECTURAL COMPARISON
            </span>
            <h3
              style={{
                font: '800 15px "Manrope", sans-serif',
                color: "#132a27",
                marginTop: "2px",
              }}
            >
              Why Standard RBAC Fails Inside Threats vs. ScholarLock Zero Server Custody
            </h3>
            <p style={{ fontSize: "12px", color: "#5a6d66", marginTop: "2px" }}>
              Standard cloud backends trust privileged roles. TideCloak replaces administrative trust with mathematical impossibility.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "12px",
            }}
          >
            {/* Column 1: Traditional OAuth / RBAC */}
            <div
              style={{
                background: "#fff5f5",
                border: "1.5px solid #fed7d7",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#c53030",
                  marginBottom: "8px",
                  borderBottom: "1px solid #feb2b2",
                  paddingBottom: "6px",
                }}
              >
                <span>❌</span>
                <span>TRADITIONAL OAUTH / RBAC DATABASE</span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  fontSize: "11.5px",
                  color: "#742a2a",
                  lineHeight: "1.6",
                }}
              >
                <li>
                  <strong>Admin Overreach:</strong> DBA or cloud root admin can run{" "}
                  <code>SELECT *</code> and read plain research files &amp; patient records.
                </li>
                <li>
                  <strong>Master Key at Rest:</strong> Encryption key resides in AWS KMS,{" "}
                  <code>.env</code>, or memory. Compromise equals full data breach.
                </li>
                <li>
                  <strong>Insider Rogue Threat:</strong> Authorized user with read permission
                  can single-handedly download &amp; sell entire AI model weights.
                </li>
                <li>
                  <strong>Soft Boundary:</strong> Enforced only by code{" "}
                  <code>if (role === 'admin')</code>, easily bypassed by exploits.
                </li>
              </ul>
            </div>

            {/* Column 2: ScholarLock + TideCloak */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#15803d",
                  marginBottom: "8px",
                  borderBottom: "1px solid #86efac",
                  paddingBottom: "6px",
                }}
              >
                <span>✅</span>
                <span>SCHOLARLOCK + TIDECLOAK (ZERO SERVER CUSTODY)</span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  fontSize: "11.5px",
                  color: "#14532d",
                  lineHeight: "1.6",
                }}
              >
                <li>
                  <strong>Zero Admin Custody:</strong> Infrastructure operator holds{" "}
                  <strong>0 of 3 shards</strong> (<code>0/3</code>). Sees only blind ciphertext.
                </li>
                <li>
                  <strong>No Master Key at Rest:</strong> Master key does not exist.
                  Authority emerges transiently in-browser only upon 3/3 human quorum.
                </li>
                <li>
                  <strong>Insider Attack Blocked:</strong> Rogue member (1/3 shards) is
                  mathematically rejected (<code>403 UNILATERAL_EXFILTRATION_BLOCKED</code>).
                </li>
                <li>
                  <strong>Mathematical Hard Boundary:</strong> Decryption without 3-of-3 quorum
                  is as impossible as breaking AES-256-GCM.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
