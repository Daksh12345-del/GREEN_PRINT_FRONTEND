import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import * as api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const ACTIVITY_TYPES = ["electricity", "diesel", "petrol", "natural_gas", "lpg", "coal"];
const POLLUTANTS = ["CO2e", "NOx", "SOx"];

export default function EmissionFactors() {
  const { user } = useAuth();
  const canManage = user.role === "super_admin";

  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    region: "", activityType: ACTIVITY_TYPES[0], pollutant: POLLUTANTS[0],
    factorValue: "", unit: "", source: "", notes: ""
  });

  const refresh = useCallback(async () => {
    try {
      setFactors(await api.getEmissionFactors());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.addEmissionFactor(form);
      setForm({ region: "", activityType: ACTIVITY_TYPES[0], pollutant: POLLUTANTS[0], factorValue: "", unit: "", source: "", notes: "" });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteEmissionFactor(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {error && <div className="error-banner">{error}</div>}

      <div className="card" style={{ marginBottom: 20, fontSize: 13, color: "var(--ink-soft)" }}>
        Every emissions number Green Print calculates comes from one of these rows —
        nothing is hardcoded in the application. Add a region here (with a real,
        cited source) before a company in that region will get accurate numbers;
        otherwise they fall back to the GLOBAL row for that activity type.
      </div>

      {canManage && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="kpi-label" style={{ marginBottom: 12 }}>Add / update a factor</div>
          <form onSubmit={handleAdd}>
            <div className="field-row">
              <div className="field">
                <label>Region code</label>
                <input required value={form.region} onChange={(e) => update("region", e.target.value.toUpperCase())} placeholder="e.g. IN, UK, US, GLOBAL" />
              </div>
              <div className="field">
                <label>Activity type</label>
                <select value={form.activityType} onChange={(e) => update("activityType", e.target.value)}>
                  {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Pollutant</label>
                <select value={form.pollutant} onChange={(e) => update("pollutant", e.target.value)}>
                  {POLLUTANTS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Unit (of the activity)</label>
                <input required value={form.unit} onChange={(e) => update("unit", e.target.value)} placeholder="kWh / litre / kg" />
              </div>
            </div>
            <div className="field">
              <label>Factor value (kg of pollutant per unit)</label>
              <input type="number" step="any" required value={form.factorValue} onChange={(e) => update("factorValue", e.target.value)} placeholder="0.710" />
            </div>
            <div className="field">
              <label>Source (required — where this number is published)</label>
              <input required value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="e.g. CEA CO2 Baseline Database v21.0 (Dec 2025)" />
            </div>
            <div className="field">
              <label>Notes (optional)</label>
              <input value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any caveats — e.g. varies by equipment" />
            </div>
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Saving…" : "Save factor"}
            </button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>Region</th><th>Activity</th><th>Pollutant</th><th>Factor</th><th>Source</th>{canManage && <th></th>}</tr>
          </thead>
          <tbody>
            {!loading && factors.length === 0 && (
              <tr className="empty-row"><td colSpan={canManage ? 6 : 5}>No factors yet</td></tr>
            )}
            {factors.map((f) => (
              <tr key={f.id}>
                <td>{f.region}</td>
                <td>{f.activity_type}</td>
                <td>{f.pollutant}</td>
                <td className="mono">{f.factor_value} kg/{f.unit}</td>
                <td style={{ fontSize: 12, color: "var(--ink-soft)", maxWidth: 320 }}>
                  {f.source}
                  {f.notes && <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 2 }}>{f.notes}</div>}
                </td>
                {canManage && (
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-danger-text" onClick={() => handleDelete(f.id)}>
                      <Trash2 size={13} style={{ verticalAlign: -2 }} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
