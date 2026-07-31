// api.js
// Thin wrapper around fetch. Every function here hits the real Express
// backend — there is no mock/fallback data in this file. Auth token is
// read from localStorage and attached to every request automatically.
//
// API_BASE: in local dev, Vite's dev server proxies "/api" straight to the
// backend (see vite.config.js), so the default of "/api" just works. In
// production with the frontend (Vercel) and backend (Render) on separate
// domains, set VITE_API_URL in Vercel's project settings to your Render
// backend's full URL + "/api", e.g. "https://greenprint-api.onrender.com/api".

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const TOKEN_KEY = "greenprint_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...options
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {
      // ignore parse errors on empty bodies
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}

function withQuery(path, params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return qs ? `${path}?${qs}` : path;
}

// ---- auth ----
export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const registerCompany = (data) =>
  request("/auth/register-company", { method: "POST", body: JSON.stringify(data) });

export const forgotPassword = (email) =>
  request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });

export const resetPassword = (token, newPassword) =>
  request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) });

export const getMe = () => request("/auth/me");

// ---- companies ----
export const getCompanies = () => request("/companies");
export const addCompany = (data) => request("/companies", { method: "POST", body: JSON.stringify(data) });
export const deleteCompany = (id) => request(`/companies/${id}`, { method: "DELETE" });

// ---- facilities ----
export const getFacilities = (companyId) => request(withQuery("/facilities", { companyId }));
export const addFacility = (data) => request("/facilities", { method: "POST", body: JSON.stringify(data) });
export const deleteFacility = (id) => request(`/facilities/${id}`, { method: "DELETE" });

// ---- vehicles ----
export const getVehicles = (companyId) => request(withQuery("/vehicles", { companyId }));
export const addVehicle = (data) => request("/vehicles", { method: "POST", body: JSON.stringify(data) });
export const deleteVehicle = (id) => request(`/vehicles/${id}`, { method: "DELETE" });

// ---- users ----
export const getUsers = (companyId) => request(withQuery("/users", { companyId }));
export const addUser = (data) => request("/users", { method: "POST", body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });

// ---- logs ----
export const getActivityTypes = () => request("/logs/activity-types");
export const getLogs = (companyId) => request(withQuery("/logs", { companyId }));
export const addLog = (data) => request("/logs", { method: "POST", body: JSON.stringify(data) });
export const deleteLog = (id) => request(`/logs/${id}`, { method: "DELETE" });

// ---- kpis ----
export const getKpis = (companyId) => request(withQuery("/kpis", { companyId }));

// ---- AI insights (flagship module) ----
export const getAiInsights = (companyId, refresh) =>
  request(withQuery("/ai/insights", { companyId, refresh: refresh ? "true" : undefined }));

// ---- emission factors (configurable, sourced — no hardcoding) ----
export const getEmissionFactors = () => request("/emission-factors");
export const addEmissionFactor = (data) => request("/emission-factors", { method: "POST", body: JSON.stringify(data) });
export const deleteEmissionFactor = (id) => request(`/emission-factors/${id}`, { method: "DELETE" });

// ---- IoT devices (real-time ingestion) ----
export const getDevices = (companyId) => request(withQuery("/devices", { companyId }));
export const addDevice = (data) => request("/devices", { method: "POST", body: JSON.stringify(data) });
export const deleteDevice = (id) => request(`/devices/${id}`, { method: "DELETE" });

// ---- carbon credit estimator ----
export const getCarbonCredits = (companyId) => request(withQuery("/carbon-credits", { companyId }));
export const setCarbonBaseline = (data) => request("/carbon-credits/baseline", { method: "POST", body: JSON.stringify(data) });
export const setCarbonCreditPrice = (pricePerTonneUsd) =>
  request("/carbon-credits/price", { method: "PATCH", body: JSON.stringify({ pricePerTonneUsd }) });

// ---- PDF report download (fetched as a blob so the JWT can be attached
// as a header, then handed to the browser as a real file download) ----
export async function downloadEsgReport(companyId) {
  const token = getToken();
  const qs = withQuery("/reports/esg.pdf", { companyId });
  const res = await fetch(`${API_BASE}${qs}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Report generation failed: ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "greenprint-esg-report.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
