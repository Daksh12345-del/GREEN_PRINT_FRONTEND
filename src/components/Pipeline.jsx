import { ClipboardEdit, Cloud, Calculator, BarChart3, Sparkles, FileText } from "lucide-react";
import { ChevronRight } from "lucide-react";

const STEPS = [
  { label: "Manual & API data", icon: ClipboardEdit },
  { label: "Cloud platform", icon: Cloud },
  { label: "Calculation engine", icon: Calculator },
  { label: "Analytics", icon: BarChart3 },
  { label: "AI insights", icon: Sparkles },
  { label: "Reports", icon: FileText }
];

// activeIndex: which stage the data has actually reached right now.
export default function Pipeline({ activeIndex = 2 }) {
  return (
    <div className="pipeline" aria-label="Data pipeline">
      {STEPS.map((step, i) => (
        <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && <ChevronRight size={16} className="pipeline-arrow" />}
          <div className={`pipeline-step${i <= activeIndex ? " active" : ""}`}>
            <span className="pipeline-step-dot">
              <step.icon size={16} />
            </span>
            <span className="pipeline-step-label">{step.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
