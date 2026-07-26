import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import RegisterCompany from "./pages/RegisterCompany.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Facilities from "./pages/Facilities.jsx";
import Fleet from "./pages/Fleet.jsx";
import Logs from "./pages/Logs.jsx";
import AiInsights from "./pages/AiInsights.jsx";
import Team from "./pages/Team.jsx";
import Companies from "./pages/Companies.jsx";
import Devices from "./pages/Devices.jsx";
import EmissionFactors from "./pages/EmissionFactors.jsx";
import CarbonCredits from "./pages/CarbonCredits.jsx";
import Reports from "./pages/Reports.jsx";

function FullScreenLoading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-soft)" }}>
      Loading Green Print…
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireGuest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoading />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function RequireRole({ roles, children }) {
  const { user } = useAuth();
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<RequireGuest><Login /></RequireGuest>} />
      <Route path="/register" element={<RequireGuest><RegisterCompany /></RequireGuest>} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="logs" element={<Logs />} />
        <Route
          path="facilities"
          element={
            <RequireRole roles={["company_admin", "plant_manager", "super_admin"]}>
              <Facilities />
            </RequireRole>
          }
        />
        <Route
          path="fleet"
          element={
            <RequireRole roles={["company_admin", "fleet_manager", "super_admin"]}>
              <Fleet />
            </RequireRole>
          }
        />
        <Route path="ai-insights" element={<AiInsights />} />
        <Route
          path="devices"
          element={
            <RequireRole roles={["company_admin", "plant_manager", "fleet_manager", "super_admin"]}>
              <Devices />
            </RequireRole>
          }
        />
        <Route path="reports" element={<Reports />} />
        <Route
          path="carbon-credits"
          element={
            <RequireRole roles={["company_admin", "super_admin"]}>
              <CarbonCredits />
            </RequireRole>
          }
        />
        <Route path="emission-factors" element={<EmissionFactors />} />
        <Route
          path="team"
          element={
            <RequireRole roles={["company_admin", "super_admin"]}>
              <Team />
            </RequireRole>
          }
        />
        <Route
          path="companies"
          element={
            <RequireRole roles={["super_admin"]}>
              <Companies />
            </RequireRole>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
