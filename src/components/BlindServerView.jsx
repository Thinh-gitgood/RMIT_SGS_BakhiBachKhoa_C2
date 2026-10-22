import React from "react";

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
  return (
    <section className="server-workspace">
      <div className="panel-card server-panel-card">
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
              <span className="deficit-badge">🔑 0 / 3 SHARDS PRESENT</span>
              <span>
                Root database dump / force-decrypt rejected: Infrastructure operator
                holds <b>0 authority shards</b> and possesses only blind ciphertext.
              </span>
            </div>

            <pre className="json-payload-box">
              <code>{JSON.stringify(ADMIN_BLOCK_PAYLOAD, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* Raw Database Table */}
        <div className="terminal-card">
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
        </div>
      </div>
    </section>
  );
}
