import { useState } from "react";
import { FileDown, FileText, Table } from "lucide-react";
import * as api from "../api.js";

export default function Reports() {
  const [busy, setBusy] = useState(false);
  const [csvBusy, setCsvBusy] = useState(false);
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

  async function handleCsvDownload() {
    setCsvBusy(true);
    setError(null);
    try {
      await api.downloadLogsCsv();
    } catch (err) {
      setError(err.message);
    } finally {
      setCsvBusy(false);
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

      <div className="card" style={{ maxWidth: 560, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--brand-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Table size={20} style={{ color: "var(--brand-strong)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Raw Data Export (CSV)</div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 14 }}>
              Every logged activity with its computed CO2e/NOx/SOx, ready to open in
              Excel, Google Sheets, or feed into your own spreadsheet model. Same
              historically-accurate numbers as the PDF report — pivot, chart, or
              filter it however you like.
            </p>
            <button className="btn btn-secondary" onClick={handleCsvDownload} disabled={csvBusy}>
              <FileDown size={15} />
              {csvBusy ? "Generating…" : "Download CSV"}
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
