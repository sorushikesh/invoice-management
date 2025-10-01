import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-foreground/80 border-border",
        info: "bg-accent text-accent-foreground border-accent",
        success: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900",
        warning: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
        danger: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type StatusKind = "invoice" | "payment" | "generic";

function mapTone(kind: StatusKind, statusRaw: string) {
  const s = statusRaw.toUpperCase();
  if (kind === "invoice") {
    if (s.includes("PAID")) return "success" as const;
    if (s.includes("OVERDUE")) return "danger" as const;
    if (s.includes("SENT") || s.includes("ISSUED")) return "info" as const;
    if (s.includes("DRAFT")) return "neutral" as const;
    if (s.includes("PART")) return "warning" as const; // PARTIALLY_PAID
    return "neutral" as const;
  }
  if (kind === "payment") {
    if (s.includes("FAILED")) return "danger" as const;
    if (s.includes("PENDING")) return "warning" as const;
    return "success" as const; // completed, succeeded
  }
  if (s.includes("ACTIVE") || s.includes("SUCCESS")) return "success" as const;
  if (s.includes("PAUSE") || s.includes("PENDING")) return "warning" as const;
  if (s.includes("ERROR") || s.includes("FAIL") || s.includes("OVERDUE")) return "danger" as const;
  return "neutral" as const;
}

export default function StatusBadge({ status, kind = "generic", className }: { status: string; kind?: StatusKind; className?: string }) {
  const tone = mapTone(kind, status);
  return <span className={cn(badge({ tone }), className)}>{status}</span>;
}

