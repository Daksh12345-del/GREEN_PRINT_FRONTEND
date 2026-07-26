import { useEffect, useState, useCallback } from "react";
import { Trash2, Copy, Check } from "lucide-react";
import * as api from "../api.js";

const ACTIVITY_TYPES = ["electricity", "diesel", "petrol", "natural_gas", "lpg", "coal"];
const DEFAULT_UNITS = { electricity: "kWh", diesel: "litre", petrol: "litre", natural_gas: "kWh", lpg: "litre", coal: "kg" };

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [newKey, setNewKey] = useState(null); // { name, apiKey } — shown once
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({ name: "", facilityId: "", vehicleId: "", defaultActivityType: ACTIVITY_TYPES[0] });

  const refresh = useCallback(async () => {
    try {
      const [d, f, v] = await Promise.all([api.getDevices(), api.getFacilities(), api.getVehicles()]);
      setDevices(d);
      setFacilities(f);
      setVehicles(v);
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
      const device = await api.addDevice({
        ...form,
        facilityId: form.facilityId || undefined,
        vehicleId: form.vehicleId || undefined,
        defaultUnit: DEFAULT_UNITS[form.defaultActivityType]
      });
      setNewKey({ name: device.name, apiKey: device.apiKey });
      setForm({ name: "", facilityId: "", vehicleId: "", defaultActivityType: ACTIVITY_TYPES[0] });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteDevice(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(newKey.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {error && <div className="error-banner">{error}</div>}

      <div className="card" style={{ marginBottom: 20, fontSize: 13, color: "var(--ink-soft)" }}>
        Devices push activity data directly — a smart meter, fuel-flow sensor, or
        telematics unit calls <code className="mono">POST /api/ingest/logs</code> with
        its own API key (no human login involved). This is what makes real-time,
        automatic data collection possible instead of manual entry.
      </div>

      {newKey && (
        <div className="card" style={{ marginBottom: 20, border: "1px solid var(--brand)" }}>
          <div className="kpi-label" style={{ marginBottom: 8 }}>
            API key for "{newKey.name}" — copy it now, it won't be shown again
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <code className="mono" style={{ background: "var(--surface-sunken)", padding: "8px 12px", borderRadius: 6, fontSize: 12.5, flex: 1, overflowX: "auto" }}>
              {newKey.apiKey}
            </code>
            <button className="btn btn-secondary" onClick={copyKey}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 10 }}>
            Example: <code className="mono">curl -X POST /api/ingest/logs -H "X-API-Key: {"<key>"}" -d {"'{\"quantity\":75}'"}</code>
          </p>
          <button className="btn-danger-text" style={{ marginTop: 8 }} onClick={() => setNewKey(null)}>Dismiss</button>
        </div>
      )}

      <div className="grid grid-2" style={{ alignItems: "start", gridTemplateColumns: "340px 1fr" }}>
        <div className="card">
          <div className="kpi-label" style={{ marginBottom: 12 }}>Register a device</div>
          <form onSubmit={handleAdd}>
            <div className="field">
              <label>Device name</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Plant 1 Smart Meter" />
            </div>
            <div className="field">
              <label>Default activity type</label>
              <select value={form.defaultActivityType} onChange={(e) => update("defaultActivityType", e.target.value)}>
                {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t} ({DEFAULT_UNITS[t]})</option>)}
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
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Creating…" : "Create device + API key"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Device</th><th>Default activity</th><th>Key prefix</th><th>Last seen</th><th></th></tr></thead>
            <tbody>
              {!loading && devices.length === 0 && (
                <tr className="empty-row"><td colSpan={5}>No devices yet</td></tr>
              )}
              {devices.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.default_activity_type}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{d.api_key_prefix}</td>
                  <td>{d.last_seen_at ? new Date(d.last_seen_at).toLocaleString() : "never"}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-danger-text" onClick={() => handleDelete(d.id)}>
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
