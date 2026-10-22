import React from "react";
import RogueAttackView from "./RogueAttackView.jsx";

function AssetVectorIcon({ tag }) {
  if (tag === "ip-paper") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  if (tag === "ip-weights") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </svg>
    );
  }
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export default function CoAuthorVaultView({
  assets = [],
  activeUser,
  workingPreviewUnlocked = {},
  onToggleWorkingPreview,
  onAttemptExport,
  quorumCount = 0,
  isMasterUnlocked = false,
  exportBlockModal = null,
  rogueAttemptCount = 0,
  onCloseBlockModal,
}) {
  const isAdvisor = activeUser?.id === "thinh";
  const isRogueUser = activeUser?.id === "tan";

  function getAssetTheme(fileName = "", tag = "") {
    if (fileName.endsWith(".pdf") || tag === "ip-paper") {
      return {
        label: "IEEE MANUSCRIPT",
        accent: "#5b7d91",
        softBg: "rgba(124, 158, 178, 0.18)",
        specs: ["IEEE TMI 2026", "LaTeX + 8 Figs", "SHA-256: 4a8d...e91b"],
      };
    }
    if (fileName.endsWith(".pth") || tag === "ip-weights") {
      return {
        label: "PYTORCH WEIGHTS",
        accent: "#6f5e85",
        softBg: "rgba(184, 169, 201, 0.24)",
        specs: ["3D-ViT Glioma Seg", "Val Dice: 96.4%", "400× A100 GPU hrs"],
      };
    }
    return {
      label: "CLINICAL COHORT",
      accent: "#286a4b",
      softBg: "rgba(140, 197, 163, 0.24)",
      specs: ["1,200 MRI Patients", "48 Biomarkers", "RMIT Ethics #EA-2026"],
    };
  }

  function triggerRealFileDownload(targetName, singleAsset = null) {
    onAttemptExport(targetName);
    if (!isMasterUnlocked) return;

    const payload = singleAsset
      ? {
          certificateId: "CERT-TIDE-RMIT-2026-303",
          status: "DECRYPTED_IN_BROWSER_RAM",
          exportedBy: activeUser?.name || "Verified Co-Author",
          exportedAt: new Date().toISOString(),
          asset: {
            code: singleAsset.code,
            fileName: singleAsset.fileName,
            tideTag: `_tide_${singleAsset.tag}`,
            cipherSuite: singleAsset.cipherSuite,
            unlockedPlaintext: singleAsset.unlockedPlaintext,
          },
        }
      : {
          certificateId: "CERT-TIDE-RMIT-2026-303",
          bundle: "ScholarLock Master IP Bundle (3/3 Quorum Verified)",
          exportedBy: activeUser?.name || "Verified Co-Author",
          exportedAt: new Date().toISOString(),
          custodyPolicy: "Zero Master Key at Rest · Transient Browser Decryption",
          unlockedAssets: assets.map((a) => ({
            code: a.code,
            fileName: a.fileName,
            tideTag: `_tide_${a.tag}`,
            size: a.size,
            unlockedPlaintext: a.unlockedPlaintext,
          })),
        };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = singleAsset
      ? `${singleAsset.fileName}.unlocked.json`
      : "ScholarLock_Verified_IP_Bundle_CERT-303.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="vault-column">
      <div className="panel-card">
        {/* Vault Panel Header */}
        <div className="vault-panel-header">
          <div>
            <span className="panel-kicker">
              PROTECTED RESOURCE SANCTUARY · TIDECLOAK E2EE
            </span>
            <h2>Capstone IP Vault (3 Protected Assets)</h2>
          </div>

          <button
            type="button"
            className={`button ${
              isMasterUnlocked
                ? "emerald-cta"
                : isRogueUser
                  ? "danger-cta"
                  : "dark"
            }`}
            onClick={() =>
              triggerRealFileDownload("Full Master IP Bundle (3 Files)")
            }
            title={
              isMasterUnlocked
                ? "Download decrypted plaintexts under Certificate #CERT-TIDE-RMIT-2026-303"
                : isRogueUser
                  ? "Attempt unilateral exfiltration to sell IP (Blocked with 403)"
                  : "Export full capstone package (Requires 3-of-3 Quorum approval)"
            }
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isMasterUnlocked
              ? "Export Full IP Bundle (3/3 Unlocked)"
              : isRogueUser
                ? "Export Full IP Bundle (Unilateral)"
                : "Export Full IP Bundle"}
          </button>
        </div>

        {/* Active User Capability Strip */}
        <div className={`user-context-strip ${isRogueUser ? "rogue-strip" : ""}`}>
          <div className="user-context-left">
            <span className="avatar mini">{activeUser?.avatar || "KL"}</span>
            <span>
              Viewing as <strong>{activeUser?.name}</strong> (
              {activeUser?.roleTitle})
            </span>
            <span className={`shard-chip ${isRogueUser ? "danger" : ""}`}>
              {activeUser?.shardLabel}
            </span>
          </div>
          <span className="bundle-status-text">
            {isMasterUnlocked
              ? "3/3 Quorum Verified — Full Plaintext Unlocked in Browser"
              : isAdvisor
                ? "Privacy Guardrail — Advisor cannot read student daily files"
                : `Bundle Sealed (${quorumCount}/3 Shards) — Requires 3/3 Quorum`}
          </span>
        </div>

        {/* Two-Tier Cryptographic Architecture Strip (Neumorphic Inset) */}
        <div
          className="neu-inset"
          style={{
            padding: "11px 15px",
            marginBottom: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "10px",
            fontSize: "11.5px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-primary)",
                flexShrink: 0,
              }}
            />
            <span>
              <b style={{ color: "var(--color-primary-dark)" }}>
                Tier 1 · Working Preview:
              </b>{" "}
              Tag-bound summary for co-authors (Advisor blocked).
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-mint)",
                flexShrink: 0,
              }}
            />
            <span>
              <b style={{ color: "var(--color-mint-dark)" }}>
                Tier 2 · Master Plaintext:
              </b>{" "}
              Requires 3-of-3 Quorum shards in browser RAM.
            </span>
          </div>
        </div>

        {/* 403 Unilateral Exfiltration Block Modal */}
        <RogueAttackView
          exportBlockModal={exportBlockModal}
          rogueAttemptCount={rogueAttemptCount}
          onCloseModal={onCloseBlockModal}
        />

        {/* File Rows List (Resource Library Neumorphic Cards) */}
        <div className="file-list">
          {assets.map((asset) => {
            const isPreviewOpen =
              !isAdvisor && Boolean(workingPreviewUnlocked[asset.id]);
            const theme = getAssetTheme(asset.fileName, asset.tag);

            return (
              <article
                key={asset.id}
                className={`file-row-card ${
                  isMasterUnlocked ? "file-unlocked" : ""
                }`}
              >
                <div className="file-row-main">
                  <div className="file-info">
                    <div
                      className="file-icon-squircle"
                      style={{
                        color: theme.accent,
                        backgroundColor: theme.softBg,
                      }}
                    >
                      <AssetVectorIcon tag={asset.tag} />
                    </div>
                    <div>
                      <div className="file-name-line">
                        <strong className="file-name">{asset.fileName}</strong>
                        <span
                          className="file-size-pill"
                          style={{
                            color: theme.accent,
                            fontWeight: 700,
                          }}
                        >
                          {theme.label}
                        </span>
                        <span className="file-size-pill">{asset.size}</span>
                        <code className="file-tag-pill">_tide_{asset.tag}</code>
                        <span
                          className={`file-lock-badge ${
                            isMasterUnlocked ? "unlocked" : "locked"
                          }`}
                        >
                          {isMasterUnlocked
                            ? "Unlocked (3/3 Verified)"
                            : "Sealed (3/3 Quorum)"}
                        </span>
                      </div>

                      <p className="file-subtitle">
                        <strong style={{ color: "var(--color-text)", marginRight: "6px" }}>
                          [{asset.code}]
                        </strong>
                        {asset.title}
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "11px",
                            color: "var(--color-text-subtle)",
                          }}
                        >
                          · {asset.cipherSuite}
                        </span>
                      </p>

                      {/* Biomedical / AI Metadata Spec Chips */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginTop: "7px",
                        }}
                      >
                        {theme.specs.map((spec) => (
                          <span
                            key={spec}
                            style={{
                              fontSize: "10.5px",
                              fontWeight: 600,
                              padding: "2px 9px",
                              borderRadius: "50px",
                              background: "rgba(255, 255, 255, 0.55)",
                              color: "var(--color-text-muted)",
                              border: "1px solid rgba(163, 177, 198, 0.28)",
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="file-actions">
                    {isAdvisor ? (
                      <span
                        className="advisor-privacy-pill"
                        title="Academic Advisor holds only a 1/3 Arbitration Shard and cannot view student working files"
                      >
                        Advisor Privacy Lock
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="button outline btn-sm"
                        onClick={() => onToggleWorkingPreview(asset)}
                        title="Preview working metadata via TideCloak tag policy"
                      >
                        {isPreviewOpen ? "Hide Preview" : "Preview"}
                      </button>
                    )}

                    <button
                      type="button"
                      className={`button btn-sm ${
                        isMasterUnlocked
                          ? "emerald-btn"
                          : isRogueUser
                            ? "danger-sm"
                            : "dark"
                      }`}
                      onClick={() =>
                        triggerRealFileDownload(asset.fileName, asset)
                      }
                      title={
                        isMasterUnlocked
                          ? `Download unlocked ${asset.fileName}`
                          : isRogueUser
                            ? `Attempt unauthorized sale of ${asset.fileName}`
                            : `Export ${asset.fileName} (Requires 3/3 Quorum)`
                      }
                    >
                      {isMasterUnlocked
                        ? "Download Plaintext"
                        : isRogueUser
                          ? "Export (Unilateral)"
                          : "Export"}
                    </button>
                  </div>
                </div>

                {/* Recessed Neumorphic Payload Inspector Bar */}
                <div
                  className={`file-payload-bar ${
                    isMasterUnlocked
                      ? "payload-plaintext"
                      : isPreviewOpen
                        ? "payload-preview"
                        : "payload-cipher"
                  }`}
                >
                  {isMasterUnlocked ? (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          marginBottom: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "var(--color-mint-dark)",
                        }}
                      >
                        <span>
                          TIER-2 MASTER PLAINTEXT (Transient Browser doDecrypt)
                        </span>
                        <span
                          style={{
                            background: "var(--color-mint-soft)",
                            color: "var(--color-mint-dark)",
                            fontSize: "9.5px",
                            padding: "2px 8px",
                            borderRadius: "50px",
                            fontWeight: 700,
                          }}
                        >
                          3/3 VERIFIED
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5 }}>
                        {asset.unlockedPlaintext}
                      </p>
                    </div>
                  ) : isPreviewOpen ? (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          marginBottom: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "var(--color-primary-dark)",
                        }}
                      >
                        <span>
                          TIER-1 CO-AUTHOR WORKING PREVIEW (TideCloak Tag Policy)
                        </span>
                        <span
                          style={{
                            background: "rgba(124, 158, 178, 0.2)",
                            color: "var(--color-primary-dark)",
                            fontSize: "9.5px",
                            padding: "2px 8px",
                            borderRadius: "50px",
                            fontWeight: 700,
                          }}
                        >
                          TAG-BOUND
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5 }}>
                        {asset.workingPreview}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "4px",
                          fontSize: "10.5px",
                          fontWeight: 700,
                          color: "var(--color-text-muted)",
                        }}
                      >
                        <span>100% BLIND CIPHERTEXT AT REST (AES-256-GCM)</span>
                        <span>IV 96-bit · AuthTag 128-bit · 3/3 Quorum Required</span>
                      </div>
                      <code>{asset.encryptedEnvelope}</code>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
