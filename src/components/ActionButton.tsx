import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, ButtonProps } from "@/components/ui/button";

type Props = Omit<ButtonProps, "asChild"> & { to?: string };

const gradient = "linear-gradient(135deg, hsl(var(--primary) / 0.95), hsl(var(--accent-foreground) / 0.95))";

const ActionButton = forwardRef<HTMLButtonElement, Props>(function ActionButton(
  { to, className, children, ...rest },
  ref,
) {
  const content = (
    <Button
      ref={ref}
      className={
        "rounded-full px-4 py-2 font-semibold tracking-tight text-[0.95rem] shadow-[0_12px_32px_-12px_hsl(var(--accent-foreground)/0.55)] transition-transform duration-200"
      }
      style={{ backgroundImage: gradient, color: "hsl(var(--primary-foreground, 0 0% 100%))" }}
      onMouseDown={(e) => e.currentTarget.classList.add("scale-[0.99]")}
      onMouseUp={(e) => e.currentTarget.classList.remove("scale-[0.99]")}
      {...rest}
    >
      {children}
    </Button>
  );

  return to ? (
    <Button asChild className={className}>
      <RouterLink to={to}>{children}</RouterLink>
    </Button>
  ) : (
    content
  );
});

export default ActionButton;
