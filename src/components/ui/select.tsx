import * as React from "react";
import MUIMenuItem from "@mui/material/MenuItem";
import MUISelect from "@mui/material/Select";
import { cn } from "@/lib/utils";

type SelectItemProps = { value: string; children?: React.ReactNode };
export const SelectItem = ({ value, children }: SelectItemProps) => <div data-select-item value={value} style={{ display: 'none' }}>{children}</div>;

type SelectContentProps = { children?: React.ReactNode };
export const SelectContent = ({ children }: SelectContentProps) => <>{children}</>;

export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>;

type TriggerProps = { className?: string; disabled?: boolean; children?: React.ReactNode };
export const SelectTrigger = ({ className, disabled }: TriggerProps) => <div data-select-trigger data-class={className} data-disabled={disabled} style={{ display: 'none' }} />;

export type SelectProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  children?: React.ReactNode;
};

export function Select({ value, onValueChange, children }: SelectProps) {
  const items: Array<{ value: string; label: React.ReactNode }> = [];
  let triggerClass = '';
  let triggerDisabled = false as boolean;

  const walk = (nodes: React.ReactNode) => {
    React.Children.forEach(nodes, (child: any) => {
      if (!child) return;
      if (child.type === SelectContent) {
        walk(child.props.children);
      } else if (child.type === SelectItem) {
        items.push({ value: child.props.value, label: child.props.children });
      } else if (child.type === SelectTrigger) {
        triggerClass = child.props.className || '';
        triggerDisabled = !!child.props.disabled;
      } else if (child.props && child.props.children) {
        walk(child.props.children);
      }
    });
  };
  walk(children);

  return (
    <MUISelect
      size="small"
      value={value ?? ''}
      onChange={(e) => onValueChange?.(String(e.target.value))}
      disabled={triggerDisabled}
      displayEmpty
      className={cn(triggerClass)}
      sx={{ '& .MuiSelect-select': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }}
    >
      {items.map((it) => (
        <MUIMenuItem key={it.value} value={it.value}>
          {it.label ?? it.value}
        </MUIMenuItem>
      ))}
    </MUISelect>
  );
}

export const SelectGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const SelectLabel = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const SelectScrollUpButton = () => null;
export const SelectScrollDownButton = () => null;
