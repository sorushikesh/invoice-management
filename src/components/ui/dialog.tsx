import * as React from "react";
import MUIDialog, { DialogProps as MUIDialogProps } from "@mui/material/Dialog";
import DialogContentMUI from "@mui/material/DialogContent";

type RootProps = { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode } & Omit<MUIDialogProps, "open" | "onClose">;

export function Dialog({ open, onOpenChange, children, ...rest }: RootProps) {
  return (
    <MUIDialog open={!!open} onClose={() => onOpenChange?.(false)} {...rest}>
      {children}
    </MUIDialog>
  );
}

export const DialogContent = ({ children, ...rest }: React.ComponentProps<typeof DialogContentMUI>) => (
  <DialogContentMUI {...rest}>{children}</DialogContentMUI>
);

// Minimal shims to keep existing imports compiling when unused
export const DialogTrigger = (props: any) => <div {...props} />;
export const DialogPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const DialogOverlay = (props: any) => <div {...props} />;
export const DialogClose = (props: any) => <button {...props} />;
export const DialogHeader = (props: any) => <div {...props} />;
export const DialogFooter = (props: any) => <div {...props} />;
export const DialogTitle = (props: any) => <div {...props} />;
export const DialogDescription = (props: any) => <div {...props} />;
