import { useEffect, useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import * as api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CarbonCredits() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ baselineYear: new Date().getFullYear() - 1, baselineTco2e: "" });
  const [priceForm, setPriceForm] = useState("");

  const refresh = useCallback(async () => {
    try {
      const result = await api.getCarbonCredits();
      setData(result);
      setPriceForm(result.pricePerTonneUsd);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function handleSetBaseline(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.setCarbonBaseline({
        baselineYear: Number(form.baselineYear),
        baselineTco2e: Number(form.baselineTco2e)
      });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSetPrice(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.setCarbonCreditPrice(Number(priceForm));
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="loading-block">Loading…</div>;

  return (
    <>
      {error && <div className="error-banner">{error}</div>}

      <div className="card" style={{ marginBottom: 20, border: "1px solid var(--warn)", background: "var(--warn-soft)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AlertTriangle size={16} style={{ color: "var(--warn)", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: "#5c4116" }}>
            <b>This is an estimate, not an issued credit.</b> {data?.disclaimer}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="kpi-label" style={{ marginBottom: 10 }}>Set your baseline</div>
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 14 }}>
            Pick a past year's total emissions to measure reductions against —
            this is your own declared number, not something the platform invents.
          </p>
          <form onSubmit={handleSetBaseline}>
            <div className="field-row">
              <div className="field">
                <label>Baseline year</label>
                <input type="number" required value={form.baselineYear} onChange={(e) => setForm((f) => ({ ...f, baselineYear: e.target.value }))} />
              </div>
              <div className="field">
                <label>Baseline emissions (tCO2e)</label>
                <input type="number" step="any" required value={form.baselineTco2e} onChange={(e) => setForm((f) => ({ ...f, baselineTco2e: e.target.value }))} placeholder="e.g. 12.5" />
              </div>
            </div>
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Saving…" : "Save baseline"}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="kpi-label" style={{ marginBottom: 10 }}>Estimate</div>
          {!data?.hasBaseline ? (
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{data?.message}</p>
          ) : (
            <>
              <table style={{ marginBottom: 4 }}>
                <tbody>
                  <tr><td>Baseline ({data.baselineYear})</td><td className="mono" style={{ textAlign: "right" }}>{data.baselineTco2e} tCO2e</td></tr>
                  <tr><td>Current emissions</td><td className="mono" style={{ textAlign: "right" }}>{data.currentTco2e} tCO2e</td></tr>
                  <tr><td>Reduction</td><td className="mono" style={{ textAlign: "right", color: "var(--good)" }}>{data.reductionTco2e} tCO2e</td></tr>
                  <tr><td>Price per tonne</td><td className="mono" style={{ textAlign: "right" }}>${data.pricePerTonneUsd}</td></tr>
                </tbody>
              </table>
              <div className="kpi-value" style={{ marginTop: 10 }}>
                ${data.estimatedValueUsd.toLocaleString()} <span className="kpi-unit">estimated value</span>
              </div>
            </>
          )}
        </div>
      </div>

      {user.role === "super_admin" && (
        <div className="section">
          <div className="card" style={{ maxWidth: 400 }}>
            <div className="kpi-label" style={{ marginBottom: 10 }}>Platform setting: price per tonne (USD)</div>
            <form onSubmit={handleSetPrice}>
              <div className="field">
                <input type="number" step="any" value={priceForm} onChange={(e) => setPriceForm(e.target.value)} />
              </div>
              <button className="btn btn-secondary btn-block" disabled={busy} type="submit">
                Update platform-wide price
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
