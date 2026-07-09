import type { HealthStatus } from "@/lib/health-scoring";

const statusStyles: Record<
  HealthStatus,
  { badge: string; dot: string; bar: string; text: string }
> = {
  green: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    text: "text-emerald-700",
  },
  yellow: {
    badge: "bg-amber-50 text-amber-700 ring-amber-100",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    text: "text-amber-700",
  },
  red: {
    badge: "bg-red-50 text-red-700 ring-red-100",
    dot: "bg-red-500",
    bar: "bg-red-500",
    text: "text-red-700",
  },
};

export function getHealthStatusStyles(status: HealthStatus) {
  return statusStyles[status];
}
