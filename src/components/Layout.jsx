import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Factory, Truck, ClipboardList, Sparkles,
  Users, Building2, LogOut, Leaf, Radio, Beaker, Coins, FileText,
  Menu, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: "all" },
  { to: "/logs", label: "Activity Logs", icon: ClipboardList, roles: "all" },
  { to: "/facilities", label: "Facilities", icon: Factory, roles: ["company_admin", "plant_manager", "super_admin"] },
  { to: "/fleet", label: "Fleet", icon: Truck, roles: ["company_admin", "fleet_manager", "super_admin"] },
  { to: "/devices", label: "IoT Devices", icon: Radio, roles: ["company_admin", "plant_manager", "fleet_manager", "super_admin"] },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles, roles: "all" },
  { to: "/reports", label: "Reports", icon: FileText, roles: "all" },
  { to: "/carbon-credits", label: "Carbon Credits", icon: Coins, roles: ["company_admin", "super_admin"] },
  { to: "/emission-factors", label: "Emission Factors", icon: Beaker, roles: "all" },
  { to: "/team", label: "Team", icon: Users, roles: ["company_admin", "super_admin"] },
  { to: "/companies", label: "Companies", icon: Building2, roles: ["super_admin"] }
];

const PAGE_META = {
  "/": { title: "Dashboard", sub: "Live emissions overview, recalculated from every log you've entered." },
  "/logs": { title: "Activity Logs", sub: "The raw activity data every KPI is computed from." },
  "/facilities": { title: "Facilities", sub: "Plants, offices, and sites reporting emissions." },
  "/fleet": { title: "Fleet", sub: "Vehicles reporting fuel and distance data." },
  "/devices": { title: "IoT Devices", sub: "Sensors and telematics units pushing data automatically, via API key." },
  "/ai-insights": { title: "AI Insights", sub: "Recommendations generated from your real emissions data." },
  "/reports": { title: "Reports", sub: "Download a real, GHG Protocol-structured PDF report." },
  "/carbon-credits": { title: "Carbon Credits", sub: "An estimate only — not an issued or certified credit." },
  "/emission-factors": { title: "Emission Factors", sub: "Every conversion factor Green Print uses, sourced and configurable." },
  "/team": { title: "Team", sub: "People with access to this company's data, and what they can do." },
  "/companies": { title: "Companies", sub: "Every organization on the Green Print platform." }
};

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function Layout() {
  const { user, company, logout } = useAuth();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const meta = PAGE_META[location.pathname] || { title: "Green Print", sub: "" };

  const visibleItems = NAV_ITEMS.filter(
    (item) => item.roles === "all" || item.roles.includes(user.role)
  );

  return (
    <div className="app-shell">
      {navOpen && <div className="rail-backdrop" onClick={() => setNavOpen(false)} />}

      <nav className={`rail${navOpen ? " open" : ""}`}>
        <div className="rail-brand">
          <span className="rail-brand-mark">🌱</span>
          Green Print
          <button className="rail-close" onClick={() => setNavOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="rail-section-label">Platform</div>
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={() => setNavOpen(false)}
            className={({ isActive }) => `rail-link${isActive ? " active" : ""}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <div className="rail-footer">
          <div className="rail-user">
            <span className="rail-avatar">{initials(user.name)}</span>
            <div>
              <div className="rail-user-name">{user.name}</div>
              <div className="rail-user-role">{user.role.replace("_", " ")}</div>
            </div>
          </div>
          {company && (
            <div style={{ padding: "2px 10px 8px", fontSize: 11.5, color: "var(--rail-ink-dim)" }}>
              <Leaf size={11} style={{ verticalAlign: -1, marginRight: 4 }} />
              {company.name}
            </div>
          )}
          <button className="rail-logout" onClick={logout}>
            <LogOut size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
            Sign out
          </button>
        </div>
      </nav>

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="rail-toggle" onClick={() => setNavOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div>
              <h1>{meta.title}</h1>
              <div className="topbar-sub">{meta.sub}</div>
            </div>
          </div>
          <span className="pill">
            <span className="dot" />
            <span className="pill-text">Live data</span>
          </span>
        </header>
        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
