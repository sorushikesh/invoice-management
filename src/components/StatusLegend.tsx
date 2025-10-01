import StatusBadge, { StatusKind } from "@/components/StatusBadge";

export default function StatusLegend({
  title = "Legend",
  statuses,
  className,
}: {
  title?: string;
  statuses: Array<{ label: string; kind?: StatusKind }>;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 text-xs ${className || ""}`}>
      <span className="text-muted-foreground">{title}:</span>
      {statuses.map((s) => (
        <StatusBadge key={`${s.kind}-${s.label}`} status={s.label} kind={s.kind} />
      ))}
    </div>
  );
}

