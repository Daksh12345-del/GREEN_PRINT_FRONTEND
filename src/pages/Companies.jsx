import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import * as api from "../api.js";
import { REGIONS } from "../constants.js";

const SECTORS = ["Manufacturing", "Logistics", "Energy", "Construction", "Hospitality", "Healthcare", "Government", "Other"];
const SCALES = ["SME", "Mid-size", "Enterprise", "City / Government"];

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", sector: SECTORS[0], scale: SCALES[0], region: REGIONS[0].code });

  const refresh = useCallback(async () => {
    try {
      setCompanies(await api.getCompanies());
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
      await api.addCompany(form);
      setForm({ name: "", sector: SECTORS[0], scale: SCALES[0], region: REGIONS[0].code });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteCompany(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {error && <div className="error-banner">{error}</div>}

      <div className="grid grid-2" style={{ alignItems: "start", gridTemplateColumns: "340px 1fr" }}>
        <div className="card">
          <div className="kpi-label" style={{ marginBottom: 12 }}>Add a company</div>
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 14 }}>
            This creates the company record only — it won't have a company_admin
            user until someone registers against it or you add one from Team.
          </p>
          <form onSubmit={handleAdd}>
            <div className="field">
              <label>Company name</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Tata Steel" />
            </div>
            <div className="field">
              <label>Sector</label>
              <select value={form.sector} onChange={(e) => update("sector", e.target.value)}>
                {SECTORS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Scale</label>
              <select value={form.scale} onChange={(e) => update("scale", e.target.value)}>
                {SCALES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Region (determines emission factors)</label>
              <select value={form.region} onChange={(e) => update("region", e.target.value)}>
                {REGIONS.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
              </select>
            </div>
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Adding…" : "Add company"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Company</th><th>Sector</th><th>Scale</th><th>Region</th><th></th></tr></thead>
            <tbody>
              {!loading && companies.length === 0 && (
                <tr className="empty-row"><td colSpan={5}>No companies yet</td></tr>
              )}
              {companies.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.sector}</td>
                  <td>{c.scale}</td>
                  <td>{c.region}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-danger-text" onClick={() => handleDelete(c.id)}>
                      <Trash2 size={13} style={{ verticalAlign: -2 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
