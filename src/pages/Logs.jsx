import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import * as api from "../api.js";

const ACTIVITY_LABELS = {
  electricity: "Electricity",
  diesel: "Diesel",
  petrol: "Petrol",
  natural_gas: "Natural gas",
  lpg: "LPG",
  coal: "Coal"
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activityUnits, setActivityUnits] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    facilityId: "", vehicleId: "", activityType: "electricity", quantity: "", renewableShare: ""
  });

  const refresh = useCallback(async () => {
    try {
      const [l, f, v, units] = await Promise.all([
        api.getLogs(), api.getFacilities(), api.getVehicles(), api.getActivityTypes()
      ]);
      setLogs(l);
      setFacilities(f);
      setVehicles(v);
      setActivityUnits(units);
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
      await api.addLog({
        facilityId: form.facilityId || undefined,
        vehicleId: form.vehicleId || undefined,
        activityType: form.activityType,
        quantity: Number(form.quantity) || 0,
        renewableShare: Number(form.renewableShare) || 0
      });
      setForm({ facilityId: "", vehicleId: "", activityType: "electricity", quantity: "", renewableShare: "" });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteLog(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  const unit = activityUnits[form.activityType] || "";

  return (
    <>
      {error && <div className="error-banner">{error}</div>}

      <div className="grid grid-2" style={{ alignItems: "start", gridTemplateColumns: "340px 1fr" }}>
        <div className="card">
          <div className="kpi-label" style={{ marginBottom: 12 }}>Log real activity</div>
          <form onSubmit={handleAdd}>
            <div className="field">
              <label>What was consumed</label>
              <select value={form.activityType} onChange={(e) => update("activityType", e.target.value)}>
                {Object.entries(activityUnits).map(([type, u]) => (
                  <option key={type} value={type}>{ACTIVITY_LABELS[type] || type} ({u})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Facility (optional)</label>
              <select value={form.facilityId} onChange={(e) => update("facilityId", e.target.value)}>
                <option value="">— none —</option>
                {facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Vehicle (optional)</label>
              <select value={form.vehicleId} onChange={(e) => update("vehicleId", e.target.value)}>
                <option value="">— none —</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Quantity {unit ? `(${unit})` : ""}</label>
              <input type="number" min="0" step="any" required value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="0" />
            </div>
            {form.activityType === "electricity" && (
              <div className="field">
                <label>Renewable share (%)</label>
                <input type="number" min="0" max="100" step="any" value={form.renewableShare} onChange={(e) => update("renewableShare", e.target.value)} placeholder="0" />
              </div>
            )}
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Saving…" : "Add log"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>When</th><th>Activity</th><th>Quantity</th><th>CO2e</th><th>NOx</th><th>SOx</th><th></th></tr>
            </thead>
            <tbody>
              {!loading && logs.length === 0 && (
                <tr className="empty-row"><td colSpan={7}>No logs yet — add your first one</td></tr>
              )}
              {logs.slice().reverse().map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.timestamp).toLocaleString()}</td>
                  <td>
                    {ACTIVITY_LABELS[l.activity_type] || l.activity_type}
                    {l.source === "device" && <span className="badge role-employee" style={{ marginLeft: 6 }}>device</span>}
                  </td>
                  <td className="mono">{l.quantity} {l.unit}</td>
                  <td className="mono">{(l.emissions?.CO2e ?? 0).toFixed(1)} kg</td>
                  <td className="mono">{l.emissions?.NOx !== undefined ? `${l.emissions.NOx.toFixed(2)} kg` : "—"}</td>
                  <td className="mono">{l.emissions?.SOx !== undefined ? `${l.emissions.SOx.toFixed(2)} kg` : "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-danger-text" onClick={() => handleDelete(l.id)}>
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
