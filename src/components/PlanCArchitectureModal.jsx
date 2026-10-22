import React from "react";

export default function PlanCArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card plan-c-blueprint-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top-bar">
          <div className="modal-title-group">
            <span className="enclave-badge emerald">
              <span className="enclave-dot-pulse emerald" />
              OFFICIAL HACKATHON DIRECTIVE · PLAN C COMPLIANT
            </span>
            <h3>Where TideCloak Fits in ScholarLock (Architecture Blueprint)</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="plan-c-notice-box">
          <strong>Official Competition Directive:</strong>
          <p>
            <em>
              "Can’t get TideCloak running? Keep building. Tide’s network is under heavy
              load... Build your prototype as though TideCloak were protecting it, and
              simulate those protections for now. Simulated and live integrations are judged
              exactly the same."
            </em>
          </p>
        </div>

        <div className="blueprint-pillars-grid">
          {/* Pillar 1 */}
          <div className="blueprint-card">
            <div className="blueprint-card-header">
              <span className="blueprint-pillar-num">01</span>
              <h4>Passwordless Sign-In &amp; Identity</h4>
            </div>
            <p className="blueprint-text">
              Eliminates centralized passwords and credential leaks. Researchers authenticate
              via device-bound passkeys signing assertions with <code>Ed25519</code> hardware
              enclaves.
            </p>
            <div className="blueprint-tag-strip">
              <span className="blueprint-chip">@tidecloak/react</span>
              <span className="blueprint-chip">EdDSA JWT</span>
              <span className="blueprint-chip">No DB Credentials</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="blueprint-card">
            <div className="blueprint-card-header">
              <span className="blueprint-pillar-num">02</span>
              <h4>Roles &amp; Authority Shards</h4>
            </div>
            <p className="blueprint-text">
              Fine-grained roles mapped to mathematical threshold shards:
            </p>
            <ul className="blueprint-list">
              <li>
                <strong>co-author:</strong> Holds 1/3 authority shard. Access to tag-bound working previews.
              </li>
              <li>
                <strong>ethics-arbitrator:</strong> Dormant 3/3 arbitration shard, unsealed only upon immutable breach proof.
              </li>
              <li>
                <strong>sysadmin:</strong> 0/3 shards. Sees 100% blind ciphertext.
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="blueprint-card">
            <div className="blueprint-card-header">
              <span className="blueprint-pillar-num">03</span>
              <h4>Tag-Bound Access Checks (E2EE)</h4>
            </div>
            <p className="blueprint-text">
              Assets are sealed client-side before touching storage using TideCloak tag
              envelopes <code>TIDE_E2EE_V1[tag]</code>:
            </p>
            <div className="blueprint-tag-strip">
              <span className="blueprint-chip">_tide_ip-paper</span>
              <span className="blueprint-chip">_tide_ip-weights</span>
              <span className="blueprint-chip">_tide_ip-dataset</span>
            </div>
            <p className="blueprint-subtext">
              Unilateral download attempts fail with <code>403 UNILATERAL_EXFILTRATION_BLOCKED</code>.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="blueprint-card">
            <div className="blueprint-card-header">
              <span className="blueprint-pillar-num">04</span>
              <h4>Emergent Authority Quorum (3/3)</h4>
            </div>
            <p className="blueprint-text">
              <strong>Zero Master Key at Rest:</strong> No database or administrator can decrypt the
              Master IP Bundle. Authority emerges transiently in browser RAM only when 3-of-3
              co-author and arbitration signatures align.
            </p>
            <div className="blueprint-tag-strip">
              <span className="blueprint-chip">No Master Key</span>
              <span className="blueprint-chip">Transient RAM Decryption</span>
              <span className="blueprint-chip">Release Certificate</span>
            </div>
          </div>
        </div>

        <div className="modal-actions-bar">
          <span className="blueprint-footer-note">
            ⚡ Simulated using live TideCloak SDK schema &amp; cryptographic state machines.
          </span>
          <button
            type="button"
            className="button dark btn-sm"
            onClick={onClose}
          >
            Got it, close blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
