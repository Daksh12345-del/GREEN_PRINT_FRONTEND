import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import * as api from "../api.js";

const TYPES = ["Truck", "Van", "Car", "Bike", "Ship", "Forklift"];

export default function Fleet() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setVehicles(await api.getVehicles());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function handleAdd(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.addVehicle({ name, type });
      setName("");
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteVehicle(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {error && <div className="error-banner">{error}</div>}

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <div className="kpi-label" style={{ marginBottom: 12 }}>Add a vehicle</div>
          <form onSubmit={handleAdd}>
            <div className="field">
              <label>Name / registration</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Truck GJ-04-1123" />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Adding…" : "Add vehicle"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Vehicle</th><th>Type</th><th></th></tr></thead>
            <tbody>
              {!loading && vehicles.length === 0 && (
                <tr className="empty-row"><td colSpan={3}>No vehicles yet</td></tr>
              )}
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.type}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-danger-text" onClick={() => handleDelete(v.id)}>
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
