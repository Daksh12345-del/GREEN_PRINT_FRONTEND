import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import * as api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const ROLES_COMPANY_ADMIN_CAN_ASSIGN = ["plant_manager", "fleet_manager", "employee", "auditor"];
const ALL_ROLES = ["company_admin", "plant_manager", "fleet_manager", "employee", "auditor"];

export default function Team() {
  const { user } = useAuth();
  const assignableRoles = user.role === "super_admin" ? ALL_ROLES : ROLES_COMPANY_ADMIN_CAN_ASSIGN;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: assignableRoles[0] });

  const refresh = useCallback(async () => {
    try {
      setUsers(await api.getUsers());
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
      await api.addUser(form);
      setForm({ name: "", email: "", password: "", role: assignableRoles[0] });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteUser(id);
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
          <div className="kpi-label" style={{ marginBottom: 12 }}>Add a team member</div>
          <form onSubmit={handleAdd}>
            <div className="field">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Rohan Mehta" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="rohan@company.com" />
            </div>
            <div className="field">
              <label>Temporary password</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={(e) => update("role", e.target.value)}>
                {assignableRoles.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
              </select>
            </div>
            <button className="btn btn-primary btn-block" disabled={busy} type="submit">
              {busy ? "Adding…" : "Add team member"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {!loading && users.length === 0 && (
                <tr className="empty-row"><td colSpan={4}>No team members yet</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge role-${u.role}`}>{u.role.replace("_", " ")}</span></td>
                  <td style={{ textAlign: "right" }}>
                    {u.id !== user.id && (
                      <button className="btn-danger-text" onClick={() => handleDelete(u.id)}>
                        <Trash2 size={13} style={{ verticalAlign: -2 }} />
                      </button>
                    )}
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
