import React, { useEffect, useRef, useState } from "react";

const CERT_ID = "CERT-TIDE-RMIT-2026-303";
const CERT_VERIFICATION_HASH =
  "0x8e4b92f0c1d73a65e801b492c7d3f6a190e2b5c8d14f7a39e6b0c2d5f8a1e303";

export default function QuorumDisputeView({
  coAuthors = [],
  arbitrator = {},
  activeUser,
  signedShards = { linh: false, quan: false, thinh: false },
  rogueBreachLogged = false,
  onSignShard,
  certificateTimestamp,
}) {
  const [copiedHash, setCopiedHash] = useState(false);
  const copyTimerRef = useRef(null);

  const linh = coAuthors?.find((a) => a.id === "linh");
  const quan = coAuthors?.find((a) => a.id === "quan");
  const tan = coAuthors?.find((a) => a.id === "tan");

  const quorumCount = Object.values(signedShards || {}).filter(Boolean).length;
  const isMasterUnlocked = quorumCount === 3;
  const progressPercent = Math.round((quorumCount / 3) * 100);
  const issuedIso = certificateTimestamp || new Date().toISOString();

  useEffect(() => {
    if (!isMasterUnlocked) {
      setCopiedHash(false);
    }
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, [isMasterUnlocked]);

  function buildCertificatePayload() {
    return {
      certificateId: CERT_ID,
      schema: "TIDECLOAK_SOVEREIGN_IP_RELEASE_V1",
      issuedAt: issuedIso,
      verificationHash: CERT_VERIFICATION_HASH,
      enclavePolicy: {
        cipherSuite: "AES-256-GCM · TideCloak DKG",
        thresholdScheme: "3-of-3 Emergent Authority",
        masterKeyAtRest: null,
        keyAssemblyLocation: "EPHEMERAL_IN_BROWSER_RAM_ONLY",
      },
      signatures: [
        {
          slot: "1/3",
          signer: linh?.name || "Khánh Linh",
          role: linh?.roleTitle || "AI Lead",
          algorithm: "Ed25519",
          signatureHash: "0x94a8f1c2...e71b309d",
          status: "VERIFIED",
        },
        {
          slot: "2/3",
          signer: quan?.name || "Trung Quân",
          role: quan?.roleTitle || "Data Engineer",
          algorithm: "Ed25519",
          signatureHash: "0x3c7d09b4...a82f614e",
          status: "VERIFIED",
        },
        {
          slot: "3/3 (Arbitration)",
          signer: arbitrator?.name || "Dr. Cường Thịnh",
          role: arbitrator?.roleTitle || "RMIT Ethics Chair & Academic Advisor",
          algorithm: "Ed25519",
          signatureHash: "0x7f12e5d9...c04a883b",
          status: "VERIFIED_ARBITRATION_COSIGN",
        },
      ],
      revocationRecord: {
        revokedActor: `${tan?.name || "Nhật Tân"} (Co-Author · Shard 3/3)`,
        status: "REVOKED",
        reason: "HTTP 403 Unilateral Exfiltration Attempt",
        auditProofCode: "403_UNILATERAL_EXFILTRATION_BLOCKED",
        enforcedBy: arbitrator?.name || "Dr. Cường Thịnh",
      },
      unlockedAssets: [
        "research_paper_final.pdf [_tide_ip-paper]",
        "brain_cancer_model.pth [_tide_ip-weights]",
        "confidential_patient_dataset.csv [_tide_ip-dataset]",
      ],
    };
  }

  function handleDownloadCertificate() {
    const payload = buildCertificatePayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${CERT_ID}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleCopyVerificationHash() {
    const summaryText = `${CERT_ID} | Hash: ${CERT_VERIFICATION_HASH} | Signers: Khánh Linh (0x94a8...309d), Trung Quân (0x3c7d...614e), Dr. Cường Thịnh (0x7f12...883b) | REVOKED: Nhật Tân (Reason: HTTP 403 Unilateral Exfiltration Attempt)`;
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      const input = document.createElement("textarea");
      input.value = summaryText;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setCopiedHash(true);
    copyTimerRef.current = setTimeout(() => setCopiedHash(false), 2000);
  }

  const combinerShards = [
    {
      id: "shard-1",
      title: "Khánh Linh · Shard 1/3",
      signed: Boolean(signedShards?.linh),
      value: signedShards?.linh ? "✓ 0x94a8...309d" : "🔒 Shard #1 Pending",
      border: signedShards?.linh ? "1.5px solid #10b981" : "1px dashed #cbd5e1",
      bg: signedShards?.linh ? "#e5f7ef" : "#ffffff",
      titleColor: signedShards?.linh ? "#065f46" : "#475569",
      valueColor: signedShards?.linh ? "#0b7a56" : "#64748b",
    },
    {
      id: "shard-2",
      title: "Trung Quân · Shard 2/3",
      signed: Boolean(signedShards?.quan),
      value: signedShards?.quan ? "✓ 0x3c7d...614e" : "🔒 Shard #2 Pending",
      border: signedShards?.quan ? "1.5px solid #10b981" : "1px dashed #cbd5e1",
      bg: signedShards?.quan ? "#e5f7ef" : "#ffffff",
      titleColor: signedShards?.quan ? "#065f46" : "#475569",
      valueColor: signedShards?.quan ? "#0b7a56" : "#64748b",
    },
    {
      id: "shard-3",
      title: "Shard 3/3 · Arb. / Co-Author",
      signed: Boolean(signedShards?.thinh),
      value: signedShards?.thinh
        ? "✓ 0x7f12...883b"
        : rogueBreachLogged
          ? "⚡ Arbitration Slot Ready (Dr. Thịnh)"
          : "⚠️ Nhật Tân Holding Out (Deadlock Risk)",
      border: signedShards?.thinh
        ? "1.5px solid #10b981"
        : rogueBreachLogged
          ? "1.5px solid #60a5fa"
          : "1px dashed #f59e0b",
      bg: signedShards?.thinh
        ? "#e5f7ef"
        : rogueBreachLogged
          ? "#eff6ff"
          : "#fffbeb",
      titleColor: signedShards?.thinh
        ? "#065f46"
        : rogueBreachLogged
          ? "#1e40af"
          : "#92400e",
      valueColor: signedShards?.thinh
        ? "#0b7a56"
        : rogueBreachLogged
          ? "#1d4ed8"
          : "#b45309",
    },
  ];

  const certSigners = [
    { label: `1/3 · ${linh?.name || "Khánh Linh"}`, hash: "0x94a8f1c2...e71b309d" },
    { label: `2/3 · ${quan?.name || "Trung Quân"}`, hash: "0x3c7d09b4...a82f614e" },
    {
      label: `3/3 · ${arbitrator?.name || "Dr. Cường Thịnh"}`,
      hash: "0x7f12e5d9...c04a883b",
    },
  ];

  return (
    <aside className="quorum-column">
      <div className="panel-card quorum-panel-card">
        {/* Quorum Panel Header */}
        <div className="quorum-panel-header">
          <div>
            <span className="panel-kicker">EMERGENT AUTHORITY CONSENSUS ENGINE</span>
            <h2>🔐 3-of-3 Release Quorum</h2>
          </div>
          <span
            className={`status-pill ${isMasterUnlocked ? "emerald" : "amber"}`}
            role="status"
            aria-atomic="true"
          >
            {isMasterUnlocked ? "⚡ 3/3 Unlocked" : `${quorumCount}/3 Shards`}
          </span>
        </div>

        {/* 3/3 Progress Bar + 3-Shard Cryptographic Key Combiner */}
        <div className="quorum-meter-box">
          <div className="quorum-meter-labels">
            <span>
              Threshold Key Assembly: <b>{quorumCount} of 3 Shards</b>
            </span>
            <span className={isMasterUnlocked ? "emerald-text" : "muted-text"}>
              {isMasterUnlocked
                ? "✓ Master Key Reconstructed via doDecrypt()"
                : `${3 - quorumCount} more signature(s) required to unlock`}
            </span>
          </div>
          <div className="quorum-progress-track">
            <div
              className={`quorum-progress-fill ${isMasterUnlocked ? "complete" : ""}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="quorum-steps-row">
            <span className={quorumCount >= 0 ? "step-active" : ""}>0/3 Sealed</span>
            <span className={quorumCount >= 1 ? "step-active" : ""}>1/3 (Khánh Linh)</span>
            <span className={quorumCount >= 2 ? "step-active" : ""}>2/3 (Trung Quân)</span>
            <span className={isMasterUnlocked ? "step-complete" : ""}>
              3/3 (Unlocked)
            </span>
          </div>

          {/* Feature 1: 3-Shard Cryptographic Key Combiner Diagram */}
          <div
            style={{
              marginTop: "10px",
              paddingTop: "9px",
              borderTop: "1px dashed #cbd5e1",
            }}
            aria-label="3-Shard Cryptographic Key Combiner"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "6px",
                fontSize: "9.5px",
                fontWeight: 800,
                letterSpacing: "0.4px",
                color: "#475569",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              <span>🧩 3-Shard Key Combiner</span>
              <span style={{ whiteSpace: "nowrap" }}>DKG: 3/3</span>
            </div>

            <div
              style={{
                display: "grid",
                gap: "5px",
              }}
            >
              {combinerShards.map((shard) => (
                <div
                  key={shard.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 8px",
                    borderRadius: "6px",
                    border: shard.border,
                    background: shard.bg,
                    transition: "all 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: shard.titleColor,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {shard.title}
                  </span>
                  <code
                    style={{
                      fontSize: "9.5px",
                      fontWeight: 700,
                      color: shard.valueColor,
                      textAlign: "right",
                    }}
                  >
                    {shard.value}
                  </code>
                </div>
              ))}
            </div>

            {/* Combiner Funnel Connector */}
            <div
              style={{
                textAlign: "center",
                fontSize: "9.5px",
                fontWeight: 800,
                color: isMasterUnlocked ? "#059669" : "#64748b",
                margin: "5px 0 4px",
                letterSpacing: "0.2px",
              }}
            >
              ▼ In-Browser Key Assembly (Ephemeral AES-256-GCM Key) ▼
            </div>

            {/* Combined Output Box */}
            <div
              style={{
                padding: "7px 10px",
                borderRadius: "7px",
                textAlign: "center",
                fontSize: "10px",
                fontWeight: 800,
                lineHeight: 1.35,
                border: isMasterUnlocked
                  ? "1.5px solid #10b981"
                  : "1px solid #cbd5e1",
                background: isMasterUnlocked
                  ? "linear-gradient(135deg, #065f46, #0b7a56)"
                  : "#e2e8f0",
                color: isMasterUnlocked ? "#ffffff" : "#475569",
                boxShadow: isMasterUnlocked
                  ? "0 3px 10px rgba(16, 185, 129, 0.22)"
                  : "none",
                transition: "all 0.25s ease",
              }}
            >
              {isMasterUnlocked
                ? "⚡ EPHEMERAL KEY RECONSTRUCTED IN RAM (Zero Server Custody)"
                : `🔒 Key Unformed (${quorumCount}/3 Shards) — No Master Key Exists at Rest`}
            </div>
          </div>
        </div>

        {/* 3 Signature Slots */}
        <div className="quorum-slots-list">
          {/* Slot 1: Khánh Linh */}
          <div
            className={`quorum-slot-card ${signedShards.linh ? "signed" : ""} ${
              activeUser?.id === "linh" ? "active-actor-slot" : ""
            }`}
          >
            <div className="slot-top">
              <div className="slot-person">
                <span
                  className={`avatar mini ${signedShards.linh ? "signed-avatar" : ""}`}
                >
                  {linh?.avatar}
                </span>
                <div>
                  <strong>👩‍🔬 {linh?.name}</strong>
                  <small>{linh?.roleTitle} · Shard 1/3</small>
                </div>
              </div>
              <span className={`shard-state ${signedShards.linh ? "signed" : "pending"}`}>
                {signedShards.linh ? "✓ SIGNED" : "SLOT 1/3"}
              </span>
            </div>

            {signedShards.linh ? (
              <div>
                <code className="slot-sig-hash">
                  Sig: 0x94a8f1c2...e71b309d (Ed25519 Verified)
                </code>
                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px",
                    color: "var(--emerald)",
                    marginTop: "4px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Approved IEEE ViT-MRI manuscript &amp; model weights release.
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="button dark full-width btn-sm"
                onClick={() => onSignShard("linh")}
                title="Khánh Linh co-signs approval with Shard 1/3"
              >
                ✍️ Sign Approval (1/3)
              </button>
            )}
          </div>

          {/* Slot 2: Trung Quân */}
          <div
            className={`quorum-slot-card ${signedShards.quan ? "signed" : ""} ${
              activeUser?.id === "quan" ? "active-actor-slot" : ""
            }`}
          >
            <div className="slot-top">
              <div className="slot-person">
                <span
                  className={`avatar mini ${signedShards.quan ? "signed-avatar" : ""}`}
                >
                  {quan?.avatar}
                </span>
                <div>
                  <strong>👨‍💻 {quan?.name}</strong>
                  <small>{quan?.roleTitle} · Shard 2/3</small>
                </div>
              </div>
              <span className={`shard-state ${signedShards.quan ? "signed" : "pending"}`}>
                {signedShards.quan ? "✓ SIGNED" : "SLOT 2/3"}
              </span>
            </div>

            {signedShards.quan ? (
              <div>
                <code className="slot-sig-hash">
                  Sig: 0x3c7d09b4...a82f614e (Ed25519 Verified)
                </code>
                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px",
                    color: "var(--emerald)",
                    marginTop: "4px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Verified 1,200-patient clinical cohort de-identification.
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="button dark full-width btn-sm"
                onClick={() => onSignShard("quan")}
                title="Trung Quân co-signs approval with Shard 2/3"
              >
                ✍️ Sign Approval (2/3)
              </button>
            )}
          </div>

          {/* Slot 3: Dynamic Dispute & Ethics Arbitration Slot */}
          <div
            className={`quorum-slot-card slot3-card ${
              signedShards.thinh
                ? "signed"
                : rogueBreachLogged
                  ? "eligible-card"
                  : "dormant-card"
            } ${activeUser?.id === "thinh" ? "active-actor-slot" : ""}`}
          >
            {/* Original Shard 3 Holder Status (Nhật Tân) */}
            <div className="rogue-slot-status">
              <span>
                🚨 <b>{tan?.name}</b> (Shard 3/3)
              </span>
              <span
                className={`rogue-status-chip ${
                  signedShards.thinh
                    ? "revoked"
                    : rogueBreachLogged
                      ? "breach"
                      : "hostile"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                {signedShards.thinh
                  ? "🚫 SHARD REVOKED"
                  : rogueBreachLogged
                    ? "🚨 403 BREACH LOGGED"
                    : "⚠️ Refusing to Co-Sign"}
              </span>
            </div>

            {/* Ethics Arbitrator (Dr. Cường Thịnh) */}
            <div className="slot-top arbitrator-top">
              <div className="slot-person">
                <span
                  className={`avatar mini ${signedShards.thinh ? "signed-avatar" : ""}`}
                >
                  {arbitrator?.avatar}
                </span>
                <div>
                  <strong style={{ whiteSpace: "nowrap" }}>
                    ⚖️ {arbitrator?.name}
                  </strong>
                  <small>Ethics Arbitrator · Shard 3/3</small>
                </div>
              </div>
              <span
                className={`shard-state ${
                  signedShards.thinh
                    ? "signed"
                    : rogueBreachLogged
                      ? "eligible"
                      : "dormant"
                }`}
              >
                {signedShards.thinh
                  ? "✓ SIGNED"
                  : rogueBreachLogged
                    ? "⚡ UNLOCKED"
                    : "🔒 DORMANT"}
              </span>
            </div>

            <p className="arbitrator-rule-note">
              {signedShards.thinh
                ? "Nhật Tân’s shard revoked via Audit Log proof; Arbitration Shard 3/3 active."
                : rogueBreachLogged
                  ? "⚡ Breach Logged in Audit Trail — Ethics Arbitration Unlocked! Dr. Cường Thịnh can now revoke Nhật Tân & sign 3/3."
                  : "🔒 Dormant Guardrail: Only unlocks if an immutable 403 breach is logged (prevents collusion against an innocent co-author)."}
            </p>

            {/* Feature 2: 3 Cryptographic Guardrails on Slot 3 */}
            <div
              style={{
                background: signedShards.thinh
                  ? "#e8f8f0"
                  : rogueBreachLogged
                    ? "#eff6ff"
                    : "#f1f5f9",
                border: signedShards.thinh
                  ? "1px solid #a7f3d0"
                  : rogueBreachLogged
                    ? "1px solid #bfdbfe"
                    : "1px solid #cbd5e1",
                borderRadius: "7px",
                padding: "7px 9px",
                marginBottom: "9px",
                fontSize: "10px",
                lineHeight: 1.4,
                color: "#1e293b",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "9.5px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                ⚖️ 3 Cryptographic Anti-Collusion Guardrails:
              </div>
              <div style={{ display: "grid", gap: "3px" }}>
                <div>
                  <b>🛡️ Guardrail 1 — 1/3 Shard Only:</b> Advisor holds no Master
                  Key &amp; cannot read student Working Previews.
                </div>
                <div>
                  <b>🔒 Guardrail 2 — Anti-Collusion Dormant Lock:</b> Hard-locked (
                  <code>DORMANT</code>) until an immutable <code>403</code> breach
                  is logged in the Audit Log.
                </div>
                <div>
                  <b>📜 Guardrail 3 — Public Accountability:</b> Revocation of Nhật
                  Tân’s shard is permanently sealed into the Release Certificate.
                </div>
              </div>
            </div>

            {signedShards.thinh ? (
              <div>
                <code className="slot-sig-hash">
                  Sig: 0x7f12e5d9...c04a883b (Arbitration Key Verified)
                </code>
                <span
                  style={{
                    display: "block",
                    fontSize: "10.5px",
                    color: "var(--emerald)",
                    marginTop: "4px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Revocation Order #REV-2026-NT03 sealed into Ledger.
                </span>
              </div>
            ) : rogueBreachLogged ? (
              <button
                type="button"
                className="button arbitration-btn full-width btn-sm"
                onClick={() => onSignShard("thinh")}
                title="Dr. Cường Thịnh exercises ethics authority to revoke rogue shard and sign"
              >
                ⚖️ Revoke Nhật Tân &amp; Sign (3/3)
              </button>
            ) : (
              <button
                type="button"
                className="button full-width btn-sm"
                disabled
                title="Awaiting immutable 403 breach evidence from Nhật Tân"
              >
                🔒 Locked — No Breach Logged
              </button>
            )}
          </div>
        </div>

        {/* Feature 3: Upgraded Verified IP Release Certificate (CERT-TIDE-RMIT-2026-303) */}
        {isMasterUnlocked && (
          <div
            className="certificate-compact"
            role="region"
            aria-label="Verified IP Release Certificate"
          >
            <div className="cert-compact-head">
              <div>
                <span className="cert-kicker">
                  📜 TIDECLOAK SOVEREIGN RELEASE CERTIFICATE
                </span>
                <h3>{CERT_ID}</h3>
              </div>
              <span className="cert-verified-badge">3/3 VERIFIED</span>
            </div>
            <p className="cert-compact-body">
              Transient decryption key assembled in-browser via{" "}
              <code>doDecrypt()</code>. All 3 Capstone IP files are unlocked for
              IEEE publication &amp; licensed deployment.
            </p>

            {/* 3 Ed25519 Signatures Table */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #a7f3d0",
                borderRadius: "7px",
                padding: "7px 9px",
                marginBottom: "8px",
                fontSize: "10px",
                display: "grid",
                gap: "4px",
              }}
            >
              {certSigners.map((sig) => (
                <div
                  key={sig.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "6px",
                  }}
                >
                  <span>
                    <b>{sig.label}</b> (Ed25519):
                  </span>
                  <code style={{ color: "#0b7a56", fontWeight: 700 }}>
                    {sig.hash} ✓
                  </code>
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px dashed #cbd5e1",
                  paddingTop: "4px",
                  marginTop: "2px",
                  color: "#be123c",
                  fontWeight: 700,
                }}
              >
                🚫 REVOKED: {tan?.name || "Nhật Tân"} (Reason: HTTP 403 Unilateral
                Exfiltration Attempt)
              </div>
            </div>

            <div className="cert-compact-meta">
              <span>
                <b>Verification Hash:</b>{" "}
                <code>{CERT_VERIFICATION_HASH.slice(0, 18)}...e303</code>
              </span>
              <span>
                <b>Timestamp:</b> {issuedIso.slice(11, 19)} UTC · Zero Server
                Custody
              </span>
              <span>
                <b>Enclave Security:</b> Zero Master Key at Rest · Ed25519 Verified Signatures
              </span>
            </div>

            {/* Interactive Certificate Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "7px",
                marginTop: "9px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="button emerald-btn btn-sm"
                style={{ flex: 1 }}
                onClick={handleDownloadCertificate}
              >
                ⬇️ Download Certificate (.json)
              </button>
              <button
                type="button"
                className="button outline btn-sm"
                onClick={handleCopyVerificationHash}
              >
                {copiedHash ? "✓ Copied Hash!" : "📋 Copy Verification Hash"}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
