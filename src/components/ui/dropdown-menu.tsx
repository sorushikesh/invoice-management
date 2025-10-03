import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

type Ctx = { anchorEl: HTMLElement | null; setAnchorEl: (el: HTMLElement | null) => void };
const Ctx = React.createContext<Ctx | null>(null);

export const DropdownMenu = ({ children }: { children?: React.ReactNode }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  return <Ctx.Provider value={{ anchorEl, setAnchorEl }}>{children}</Ctx.Provider>;
};

export const DropdownMenuTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const ctx = React.useContext(Ctx)!;
  return React.cloneElement(children, {
    onClick: (e: any) => ctx.setAnchorEl(e.currentTarget),
  });
};

export interface DropdownMenuContentProps extends Omit<React.ComponentProps<typeof Menu>, 'open' | 'anchorEl' | 'onClose'> {
  children?: React.ReactNode;
  align?: "end" | "start";
  className?: string;
}

export const DropdownMenuContent = ({ children, align, className, ...props }: DropdownMenuContentProps) => {
  const ctx = React.useContext(Ctx)!;
  const open = Boolean(ctx.anchorEl);
  return (
    <Menu
      {...props}
      anchorEl={ctx.anchorEl}
      open={open}
      onClose={() => ctx.setAnchorEl(null)}
      transformOrigin={{ horizontal: align === 'end' ? 'right' : 'left', vertical: 'top' }}
      anchorOrigin={{ horizontal: align === 'end' ? 'right' : 'left', vertical: 'bottom' }}
      onClick={(e) => e.stopPropagation()}
      classes={{ paper: className }}
    >
      {children}
    </Menu>
  );
};

export interface DropdownMenuItemProps extends Omit<React.ComponentProps<typeof MenuItem>, 'onClick'> {
  onClick?: () => void;
  children?: React.ReactNode;
}

export const DropdownMenuItem = ({ onClick, children, ...props }: DropdownMenuItemProps) => {
  const ctx = React.useContext(Ctx)!;
  return (
    <MenuItem
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
        ctx.setAnchorEl(null);
      }}
    >
      {children}
    </MenuItem>
  );
};

export const DropdownMenuSeparator = () => <Divider />;
export const DropdownMenuLabel = ({ children }: { children?: React.ReactNode }) => (
  <Typography variant="subtitle2" sx={{ px: 2, py: 1.5 }}>{children}</Typography>
);

// Unused shims for API compatibility
export const DropdownMenuGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const DropdownMenuPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const DropdownMenuSub = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const DropdownMenuSubContent = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const DropdownMenuSubTrigger = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const DropdownMenuCheckboxItem = DropdownMenuItem as any;
export const DropdownMenuRadioItem = DropdownMenuItem as any;
export const DropdownMenuRadioGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const DropdownMenuShortcut = (props: any) => <span {...props} />;
