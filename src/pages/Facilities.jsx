import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import * as api from "../api.js";

const TYPES = ["Plant", "Warehouse", "Office", "Hospital", "Mall", "Port", "Airport"];

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setFacilities(await api.getFacilities());
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
      await api.addFacility({ name, type });
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
      await api.deleteFacility(id);
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
          <div className="kpi-label" style={{ marginBottom: 12 }}>Add a facility</div>
          <form onSubmit={handleAdd}>
            <div className="field">
              <label>Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Plant 3 — Chennai" />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Adding…" : "Add facility"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Name</th><th>Type</th><th></th></tr></thead>
            <tbody>
              {!loading && facilities.length === 0 && (
                <tr className="empty-row"><td colSpan={3}>No facilities yet</td></tr>
              )}
              {facilities.map((f) => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>{f.type}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-danger-text" onClick={() => handleDelete(f.id)}>
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
