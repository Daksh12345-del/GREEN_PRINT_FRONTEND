import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FUEL_TYPES = ["diesel", "petrol", "natural_gas", "lpg", "coal"];

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function EmissionsChart({ logs }) {
  const data = logs.map((l) => ({
    time: formatTime(l.timestamp),
    "Scope 2 (electricity)": l.activity_type === "electricity" ? (l.emissions?.CO2e || 0) : 0,
    "Scope 1 (fuel)": FUEL_TYPES.includes(l.activity_type) ? (l.emissions?.CO2e || 0) : 0
  }));

  if (data.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--ink-faint)", padding: 40 }}>
        No logs yet — add one to see the trend.
      </div>
    );
  }

  return (
    <div className="card">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 6, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="scope2Fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F5F45" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#1F5F45" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="scope1Fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7A3FB0" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#7A3FB0" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#DDE3DA" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#55625B" }} axisLine={{ stroke: "#DDE3DA" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#55625B" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{ fontSize: 12.5, borderRadius: 8, border: "1px solid #DDE3DA", fontFamily: "Inter" }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Area type="monotone" dataKey="Scope 2 (electricity)" stroke="#1F5F45" fill="url(#scope2Fill)" strokeWidth={2} />
          <Area type="monotone" dataKey="Scope 1 (fuel)" stroke="#7A3FB0" fill="url(#scope1Fill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
