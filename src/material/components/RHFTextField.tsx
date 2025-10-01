import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function RHFTextField({ name, control, label, type = "text", disabled }: { name: string; control: Control<any>; label: string; type?: string; disabled?: boolean }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1.5">
          <Input {...field} type={type} disabled={disabled} aria-invalid={!!fieldState.error} />
          {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}
