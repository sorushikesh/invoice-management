import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const routes = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Invoices", path: "/invoices" },
  { label: "New Invoice", path: "/invoices/new" },
  { label: "Payments", path: "/payments" },
  { label: "Clients", path: "/clients" },
  { label: "Customers", path: "/customers" },
  { label: "Products", path: "/products" },
  { label: "Reports", path: "/reports" },
  { label: "Notifications", path: "/notifications" },
  { label: "Audit Logs", path: "/audit-logs" },
  { label: "Users", path: "/users" },
  { label: "Tenants", path: "/tenants" },
  { label: "Settings", path: "/settings" },
  { label: "Profile", path: "/profile" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages and actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {routes.map((r) => (
            <CommandItem key={r.path} onSelect={() => go(r.path)}>
              {r.label}
              <CommandShortcut>{r.path}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Create">
          <CommandItem onSelect={() => go("/invoices/new")}>New Invoice</CommandItem>
          <CommandItem onSelect={() => go("/customers/new")}>New Customer</CommandItem>
          <CommandItem onSelect={() => go("/products/new")}>New Product</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}



