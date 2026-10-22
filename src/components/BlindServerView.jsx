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
  onNavigateTab,
}) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span /> FLOW 2 · BLIND STORAGE &amp; ZERO ADMIN CUSTODY INSPECTOR
          </div>
          <h2>RMIT IT Admin &amp; Cloud Database Inspector</h2>
        </div>
        <span className="status-pill crimson">
          🛡️ Server Custody: 0/3 Shards · 100% Blind Ciphertext
        </span>
      </div>

      {/* Admin Profile & Override Action Card */}
      <div className="admin-inspector-banner">
        <div className="rogue-profile">
          <span className="avatar admin-avatar">{adminActor.avatar}</span>
          <div>
            <div className="rogue-badge-row">
              <strong>{adminActor.name}</strong>
              <span className="rogue-role-tag">{adminActor.roleTitle}</span>
              <span className="shard-chip">Holds 0 of 3 Authority Shards</span>
            </div>
            <p className="rogue-desc">
              <strong>Why This Beats Ordinary RBAC:</strong> In a traditional web app, a
              database administrator or cloud root user can bypass UI checks and read raw
              files directly from disk. With <b>TideCloak Client-Side E2EE</b>, the server
              stores only blind <code>AES-256-GCM</code> envelopes and holds{" "}
              <b>zero decryption keys at rest</b>.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="button danger-cta"
          onClick={onTriggerAdminOverride}
        >
          ⛔ Attempt Admin Master Override
        </button>
      </div>

      {/* 403 ZERO_CUSTODY_ENFORCED Block Modal */}
      {adminOverrideBlocked && (
        <div className="crypto-block-alert" role="alert">
          <div className="crypto-block-header">
            <div className="crypto-block-title">
              <span className="block-badge">HTTP 403 FORBIDDEN</span>
              <h3>ZERO_CUSTODY_ENFORCED — No Server-Side Master Key Exists</h3>
            </div>
            <span className="attempt-counter">
              Blocked Root Overrides: <b>{adminAttemptCount}</b>
            </span>
          </div>

          <p className="crypto-block-explanation">
            Even with root SSH and PostgreSQL superuser privileges, the infrastructure
            operator holds <b>0 of 3 authority shards</b>. Without client-side TideCloak
            threshold assembly, the ciphertext is mathematically indistinguishable from
            random noise.
          </p>

          <pre className="json-payload-box">
            <code>{JSON.stringify(ADMIN_BLOCK_PAYLOAD, null, 2)}</code>
          </pre>

          <div className="breach-consequence-bar">
            <div className="breach-flag-status">
              <span className="pulse-dot" />
              <div>
                <strong>
                  AUDIT LOGGED: UNAUTHORIZED INFRASTRUCTURE OVERRIDE ATTEMPT RECORDED
                </strong>
                <small>
                  Root override attempt by {adminActor.name} was rejected and permanently
                  recorded in the Immutable Audit Trail.
                </small>
              </div>
            </div>
            <button
              type="button"
              className="button emerald-cta"
              onClick={() => onNavigateTab("quorum")}
            >
              ⚖️ Proceed to Legitimate 3/3 Quorum Release →
            </button>
          </div>
        </div>
      )}

      {/* Raw Database / Blind Ciphertext Terminal Table */}
      <div className="terminal-card">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="terminal-title">
            postgres@rmit-vault-db:~/storage/ip_blobs$ SELECT id, file_name, tide_tag,
            cipher_envelope FROM vault_objects;
          </span>
          <span className="terminal-badge">AES-256-GCM AT REST</span>
        </div>

        <div className="terminal-table-wrap">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>OBJECT CODE</th>
                <th>FILE NAME</th>
                <th>TIDECLOAK TAG</th>
                <th>RAW DATABASE PAYLOAD (100% BLIND CIPHERTEXT)</th>
                <th>SERVER READABILITY</th>
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
    </section>
  );
}
