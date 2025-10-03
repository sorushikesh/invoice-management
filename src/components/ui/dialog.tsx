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

// Properly typed components with proper Material UI components
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`} {...props} />
);

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogActions className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ''}`} {...props} />
);

export { DialogTitle };

// Clean typed exports for remaining components
export const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-muted-foreground ${className || ''}`} {...props} />
);
