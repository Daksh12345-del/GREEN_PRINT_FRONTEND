import { useState } from "react";
import { FileDown, FileText } from "lucide-react";
import * as api from "../api.js";

export default function Reports() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleDownload() {
    setBusy(true);
    setError(null);
    try {
      await api.downloadEsgReport();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {error && <div className="error-banner">{error}</div>}

      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--brand-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={20} style={{ color: "var(--brand-strong)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>ESG & Carbon Emissions Report</div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 14 }}>
              A real PDF, generated from your actual logged data — Scope 1 (fuel) and
              Scope 2 (electricity) emissions, NOx/SOx totals, renewable share, Green
              Score, the full activity log, and a methodology page citing every
              emission factor source used. Formatted to align with GHG Protocol
              categorization — <b>not</b> a certified or third-party-audited statement.
            </p>
            <button className="btn btn-primary" onClick={handleDownload} disabled={busy}>
              <FileDown size={15} />
              {busy ? "Generating…" : "Download PDF report"}
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 560, marginTop: 16, fontSize: 12.5, color: "var(--ink-soft)" }}>
        Want ISO 14001, official GHG Protocol, BRSR, or CDP certification? Those
        require an accredited third-party auditor to verify your data — this report
        gives them a clean, sourced starting point, but the certification itself
        has to come from that audit, not from this software.
      </div>
    </>
  );
}
