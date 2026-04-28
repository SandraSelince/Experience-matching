import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  icon: string;
}

const DEFAULT_STEPS: Step[] = [
  { id: 1, label: "Profil", icon: "👤" },
  { id: 2, label: "CV", icon: "📄" },
  { id: 3, label: "Test", icon: "🧠" },
  { id: 4, label: "Compétences", icon: "⚡" },
  { id: 5, label: "Validation", icon: "✅" },
];

const ICONS = ["👤", "📄", "🧠", "⚡", "✅"];

export function StepIndicator({ currentStep, labels }: { currentStep: number; labels?: readonly string[] }) {
  const steps: Step[] = labels
    ? labels.map((label, i) => ({ id: i + 1, label, icon: ICONS[i] ?? "•" }))
    : DEFAULT_STEPS;
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                currentStep === step.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200 scale-110"
                  : currentStep > step.id
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {currentStep > step.id ? "✓" : step.icon}
            </div>
            <span
              className={cn(
                "text-xs mt-1.5 font-medium",
                currentStep === step.id ? "text-violet-600" : currentStep > step.id ? "text-emerald-600" : "text-gray-400"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-0.5 mx-1 mb-5 transition-all duration-300",
                currentStep > step.id ? "bg-emerald-400" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
