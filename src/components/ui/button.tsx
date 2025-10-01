import * as React from "react";
import MUIButton, { ButtonProps as MUIButtonProps } from "@mui/material/Button";
import { cn } from "@/lib/utils";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "social";
type Size = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<MUIButtonProps, "variant" | "size" | "color"> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const mapVariant = (v?: Variant): Pick<MUIButtonProps, "variant" | "color"> => {
  switch (v) {
    case "destructive":
      return { variant: "contained", color: "error" };
    case "outline":
      return { variant: "outlined", color: "inherit" };
    case "secondary":
      return { variant: "contained", color: "inherit" };
    case "ghost":
      return { variant: "text", color: "inherit" };
    case "link":
      return { variant: "text", color: "primary" };
    case "social":
      return { variant: "outlined", color: "primary" };
    case "default":
    default:
      return { variant: "contained", color: "primary" };
  }
};

const mapSize = (s?: Size): MUIButtonProps["size"] => {
  switch (s) {
    case "sm":
      return "small";
    case "lg":
      return "large";
    case "icon":
      return "small";
    case "default":
    default:
      return "medium";
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant, size, className, children, ...rest }, ref) => {
  const { variant: v, color } = mapVariant(variant);
  const s = mapSize(size);
  return (
    <MUIButton ref={ref} variant={v} color={color} size={s} className={cn(className)} {...rest}>
      {children}
    </MUIButton>
  );
});
Button.displayName = "Button";

// Backwards-compatible utility for className composition used by a few components
export function buttonVariants({ variant = "default", size = "default", className = "" as string } = {}) {
  const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
  const map: Record<Variant, string> = {
    default: "",
    destructive: "",
    outline: "",
    secondary: "",
    ghost: "",
    link: "",
    social: "",
  };
  const sizes: Record<Size, string> = {
    default: "",
    sm: "",
    lg: "",
    icon: "",
  };
  return cn(base, map[variant], sizes[size], className);
}

export { Button };
