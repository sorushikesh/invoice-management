import * as React from "react";
import MUITooltip, { TooltipProps as MUITooltipProps } from "@mui/material/Tooltip";

export const TooltipProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

export function Tooltip({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

type TriggerProps = { children: React.ReactElement };
export function TooltipTrigger({ children }: TriggerProps) {
  return children;
}

type ContentProps = { children?: React.ReactNode; side?: MUITooltipProps['placement'] };
export function TooltipContent({ children, side = 'top' }: ContentProps) {
  // Placeholder – existing usage composes Trigger + Content inside provider.
  return <span data-tooltip side={side as any} style={{ display: 'none' }}>{children}</span>;
}
