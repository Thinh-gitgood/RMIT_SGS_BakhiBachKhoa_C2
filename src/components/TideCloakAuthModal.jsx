import React, { useState } from "react";

export default function TideCloakAuthModal({
  isOpen,
  onClose,
  activeUser,
  onSelectUser,
  accountList = [],
  isLoggedIn,
  onToggleLogin,
}) {
  const [selectedActorId, setSelectedActorId] = useState(activeUser?.id || "linh");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [simulatedToken, setSimulatedToken] = useState(null);

  if (!isOpen) return null;

  const selectedActor =
    accountList.find((a) => a.id === selectedActorId) || accountList[0];

  function generateSimulatedToken(actor) {
    const header = {
      alg: "EdDSA",
      typ: "JWT",
      kid: `tide-dkg-key-${actor.id}`,
    };
    const payload = {
      iss: "https://auth.tide.org/realms/scholar-lock-vault",
      sub: `did:tide:rmit-2026-${actor.id}`,
      aud: "scholar-lock-web",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      name: actor.name,
      preferred_username: actor.id,
      realm_access: {
        roles: [actor.role, "tidecloak-verified"],
      },
      tide_entitlements:
        actor.role === "co-author"
          ? ["ip-paper", "ip-weights", "ip-dataset"]
          : actor.role === "ethics-arbitrator"
            ? ["dispute-arbitration", "quorum-co-sign"]
            : ["blind-storage-operator"],
      tide_shard: actor.shardLabel,
      auth_method: "biometric_passkey_enclave",
    };
    return {
      header,
      payload,
      rawJwt: `eyJhbGciOiJFZERTQ...${btoa(JSON.stringify(payload)).slice(0, 32)}...0x${actor.id}9f8b`,
    };
  }

  function handleAuthenticate() {
    setIsAuthenticating(true);
    setTimeout(() => {
      const token = generateSimulatedToken(selectedActor);
      setSimulatedToken(token);
      setIsAuthenticating(false);
      onSelectUser(selectedActor.id);
      if (!isLoggedIn) {
        onToggleLogin(true);
      }
    }, 450);
  }

  function handleCompleteLogin() {
    onSelectUser(selectedActor.id);
    if (!isLoggedIn) {
      onToggleLogin(true);
    }
    onClose();
  }

  const currentToken =
    simulatedToken || generateSimulatedToken(selectedActor);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card plan-c-auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top-bar">
          <div className="modal-title-group">
            <span className="enclave-badge">
              <span className="enclave-dot-pulse" />
              TIDECLOAK ENCLAVE · PLAN C SIMULATION
            </span>
            <h3>Passwordless Sign-in &amp; Role Enclave</h3>
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

        <p className="modal-desc">
          Under <strong>Plan C</strong>, Tide’s identity network is simulated using
          standards-compliant <code>EdDSA / Ed25519</code> hardware passkey assertions.
          Select an academic actor below to inspect their TideCloak token, roles, and tag entitlements.
        </p>

        {/* Actor Selector Tabs */}
        <div className="auth-persona-selector">
          <label className="auth-selector-label">SELECT IDENTITY TO AUTHENTICATE:</label>
          <div className="auth-persona-grid">
            {accountList.map((acc) => {
              const isSelected = acc.id === selectedActor.id;
              const isRogue = acc.id === "tan";
              const isSysAdmin = acc.id === "sysadmin";
              return (
                <button
                  key={acc.id}
                  type="button"
                  className={`auth-persona-card ${isSelected ? "selected" : ""} ${
                    isRogue ? "rogue" : ""
                  } ${isSysAdmin ? "server" : ""}`}
                  onClick={() => {
                    setSelectedActorId(acc.id);
                    setSimulatedToken(generateSimulatedToken(acc));
                  }}
                >
                  <div className="persona-card-header">
                    <span className="persona-avatar">{acc.avatar || "U"}</span>
                    <div>
                      <strong className="persona-name">{acc.name}</strong>
                      <span className="persona-role">{acc.roleTitle}</span>
                    </div>
                  </div>
                  <div className="persona-card-footer">
                    <span className="persona-shard-tag">{acc.shardLabel}</span>
                    <span className="persona-role-tag">role: {acc.role}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Decoded TideCloak Token Preview */}
        <div className="token-inspector-panel">
          <div className="token-inspector-header">
            <span>🛡️ DECODED TIDECLOAK IDENTITY ASSERTION (EdDSA / Ed25519)</span>
            <span className="token-status-pill">
              {isAuthenticating ? "Generating Handshake…" : "Valid Enclave Signature"}
            </span>
          </div>

          <div className="token-inspector-body">
            <div className="token-claim-row">
              <span className="claim-key">Subject DID:</span>
              <code className="claim-val">{currentToken.payload.sub}</code>
            </div>
            <div className="token-claim-row">
              <span className="claim-key">Realm Roles:</span>
              <span className="claim-roles">
                {currentToken.payload.realm_access.roles.map((r) => (
                  <code key={r} className="role-pill">
                    {r}
                  </code>
                ))}
              </span>
            </div>
            <div className="token-claim-row">
              <span className="claim-key">Tag Entitlements:</span>
              <span className="claim-tags">
                {currentToken.payload.tide_entitlements.map((t) => (
                  <code key={t} className="tag-pill">
                    _tide_{t}
                  </code>
                ))}
              </span>
            </div>
            <div className="token-claim-row">
              <span className="claim-key">Authority Shard:</span>
              <code className="claim-val highlight">{currentToken.payload.tide_shard}</code>
            </div>
            <div className="token-claim-row">
              <span className="claim-key">Auth Method:</span>
              <code className="claim-val">Hardware Passkey (WebAuthn / Ed25519)</code>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions-bar">
          {isLoggedIn ? (
            <button
              type="button"
              className="button outline btn-sm"
              onClick={() => {
                onToggleLogin(false);
                onClose();
              }}
            >
              Sign Out of TideCloak
            </button>
          ) : null}

          <div className="modal-actions-right">
            <button
              type="button"
              className="button secondary btn-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button dark btn-sm auth-confirm-btn"
              onClick={handleCompleteLogin}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                "Verifying Enclave…"
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Confirm &amp; Switch Identity ({selectedActor.name})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
