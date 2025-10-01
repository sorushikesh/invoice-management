import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import PageSection from "@/components/PageSection";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

type Props = {
  icon?: ReactNode;
  title: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down" | "flat";
  data?: Array<{ x: string | number; y: number }>;
  className?: string;
  delayMs?: number;
};

export default function StatCard({ icon, title, value, delta, trend = "flat", data = [], className, delayMs = 0 }: Props) {
  const stroke = trend === "down" ? "#ef4444" : trend === "up" ? "#16a34a" : "hsl(var(--accent-foreground))";
  const fillGradId = `statgrad-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <PageSection
      className={cn("relative overflow-hidden glass-card animate-in fade-in slide-in-from-bottom-2 duration-700", className)}
      // Staggered entrance per-card
      // Tailwind's delay-* is limited; inline style allows fine control
      // without adding new utility classes.
      // eslint-disable-next-line react/forbid-dom-props
      // @ts-ignore
      style={{ animationDelay: `${delayMs}ms` }}
      title={(
        <span className="flex items-center gap-2 text-base font-medium">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border bg-background/70" style={{ boxShadow: "var(--shadow-soft)" }}>
            {icon}
          </span>
          {title}
        </span>
      )}
      actions={delta ? (
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", trend === "down" ? "text-red-600 border-red-200 dark:border-red-900 dark:text-red-300" : trend === "up" ? "text-emerald-700 border-emerald-200 dark:border-emerald-900 dark:text-emerald-300" : "text-muted-foreground")}>{delta}</span>
      ) : undefined}
    >
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="h-12 w-40 -mr-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.map((d) => ({ x: d.x, y: d.y }))} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={stroke} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke={stroke}
                fill={`url(#${fillGradId})`}
                strokeWidth={2}
                isAnimationActive
                animationBegin={150}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageSection>
  );
}
