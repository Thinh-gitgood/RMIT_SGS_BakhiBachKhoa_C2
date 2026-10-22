import React, { useState } from "react";

const ADMIN_BLOCK_PAYLOAD = {
  status: 403,
  error: "ZERO_CUSTODY_ENFORCED",
  message:
    "Cryptographic Failure: Infrastructure Operator holds 0 of 3 authority shards. Server possesses only blind ciphertext.",
};

export default function BlindServerView({
  adminActor,
  assets,
  adminOverrideBlocked,
  adminAttemptCount,
  onTriggerAdminOverride,
  onReturnToVault,
}) {
  const [viewMode, setViewMode] = useState("sql");

  const s3DumpPayload = {
    bucket: "s3://rmit-scholarlock-vault/blobs/2026-capstone/",
    kms_custody: {
      server_master_key: null,
      admin_shards: 0,
      required_quorum_shards: 3,
      encryption_standard: "AES-256-GCM · TideCloak Tag-Bound DKG",
    },
    blind_objects: (assets || []).map((a) => ({
      object_id: a.code,
      key: a.fileName,
      size: a.size,
      tide_policy_tag: `_tide_${a.tag}`,
      ciphertext_envelope: a.encryptedEnvelope,
      server_plaintext_access: false,
    })),
  };

  return (
    <section className="server-workspace">
      <div className="panel-card server-panel-card">
        <div className="vault-panel-header">
          <div>
            <span className="panel-kicker">
              INFRASTRUCTURE CONSOLE · POSTGRESQL &amp; S3 BLOB INSPECTOR
            </span>
            <h2>Raw Server Database View ({adminActor.name})</h2>
          </div>

          <div className="server-header-actions">
            {onReturnToVault && (
              <button
                type="button"
                className="button outline"
                onClick={onReturnToVault}
              >
                ← Back to IP Sanctuary
              </button>
            )}
            <button
              type="button"
              className="button danger-cta"
              onClick={onTriggerAdminOverride}
            >
              Force Decrypt / Export DB
            </button>
          </div>
        </div>

        <div className="user-context-strip server-strip">
          <div className="user-context-left">
            <span className="avatar mini">{adminActor.avatar}</span>
            <span>
              Connected as <strong>{adminActor.name}</strong> (
              {adminActor.roleTitle})
            </span>
            <span className="shard-chip danger">{adminActor.shardLabel}</span>
          </div>
          <span className="bundle-status-text">
            Zero Master Key at Rest — Server stores 100% blind AES-256-GCM
            ciphertext
          </span>
        </div>

        {/* Traditional RBAC vs TideCloak Zero Server Custody Comparison */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <div
            className="neu-inset"
            style={{
              padding: "13px 16px",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "var(--color-coral-dark)",
                fontSize: "11px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Why Standard OAuth / RBAC Fails
            </div>
            <p style={{ color: "var(--color-text-muted)" }}>
              Conventional backends hold a KMS Master Key. A rogue sysadmin or
              database breach can bypass UI role checks and dump all unpublished
              research files.
            </p>
          </div>

          <div
            className="neu-inset"
            style={{
              padding: "13px 16px",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "var(--color-mint-dark)",
                fontSize: "11px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              ScholarLock + TideCloak Blind Storage
            </div>
            <p style={{ color: "var(--color-text-muted)" }}>
              Infrastructure operators hold <b>0 of 3 shards</b>. Even with root
              PostgreSQL &amp; S3 access, the server sees only opaque{" "}
              <code>TIDE_E2EE_V1</code> ciphertext.
            </p>
          </div>
        </div>

        {/* 403 ZERO_CUSTODY_ENFORCED Block Modal */}
        {adminOverrideBlocked && (
          <div className="crypto-block-alert" role="alert">
            <div className="crypto-block-header">
              <div className="crypto-block-title">
                <span className="block-badge">HTTP 403 FORBIDDEN</span>
                <h3>ZERO_CUSTODY_ENFORCED — No Server Master Key Exists</h3>
              </div>
              <span className="attempt-counter">
                Blocked Root Overrides: <b>{adminAttemptCount}</b>
              </span>
            </div>

            <div className="shard-deficit-bar">
              <span className="deficit-badge">0 / 3 SHARDS PRESENT</span>
              <span>
                Root database dump / force-decrypt rejected: Infrastructure
                operator holds <b>0 authority shards</b> and possesses only
                blind ciphertext.
              </span>
            </div>

            <pre className="json-payload-box">
              <code>{JSON.stringify(ADMIN_BLOCK_PAYLOAD, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* Mode Switcher: PostgreSQL Table View vs Raw S3 Ciphertext Dump */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div className="audit-filter-pills" role="tablist">
            <button
              type="button"
              className={`audit-filter-btn ${
                viewMode === "sql" ? "active" : ""
              }`}
              onClick={() => setViewMode("sql")}
            >
              PostgreSQL Table View
            </button>
            <button
              type="button"
              className={`audit-filter-btn ${
                viewMode === "s3" ? "active" : ""
              }`}
              onClick={() => setViewMode("s3")}
            >
              Raw S3 Ciphertext Dump
            </button>
          </div>

          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 700,
              color: "var(--color-text-muted)",
            }}
          >
            server_master_key: <code>null</code> · admin_shards: <code>0</code>
          </span>
        </div>

        {/* Raw Database Table or S3 JSON Dump */}
        <div className="terminal-card">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-title">
              {viewMode === "sql"
                ? "postgres@rmit-vault-db:~/ip_blobs$ SELECT code, file_name, tide_tag, cipher_envelope FROM capstone_vault;"
                : "aws s3api get-object-attributes --bucket rmit-scholarlock-vault --prefix blobs/2026-capstone/"}
            </span>
            <span className="terminal-badge">AES-256-GCM BLIND STORAGE</span>
          </div>

          {viewMode === "sql" ? (
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
                        <code className="cipher-blob">
                          {asset.encryptedEnvelope}
                        </code>
                      </td>
                      <td>
                        <span className="blind-badge">0% · BLIND</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre
              style={{
                margin: 0,
                padding: "16px 18px",
                fontSize: "11.5px",
                lineHeight: 1.55,
                color: "#e2e8f0",
                overflowX: "auto",
              }}
            >
              <code>{JSON.stringify(s3DumpPayload, null, 2)}</code>
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
