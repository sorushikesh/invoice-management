import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, UserPlus, FileText, FilePlus, Users, Package, PackagePlus, FileSignature, FilePlus2, CreditCard, CirclePlus, BarChart3, Palette, Settings as Cog } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "@/components/ThemeToggle";

type Props = {
  children: ReactNode;
  title?: string;
};

export default function AppLayout({ children, title }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={false}>
      <Sidebar
        variant="inset"
        collapsible="icon"
        onMouseEnter={() => {
          if (!isMobile) setOpen(true);
        }}
        onMouseLeave={() => {
          if (!isMobile) setOpen(false);
        }}
      >
        <SidebarHeader>
          <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
            <FileText className="h-5 w-5" />
            {open && !isMobile && (
              <span className="text-lg font-semibold">Invoice Manager</span>
            )}
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <NavLink to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/invoices"}>
                <NavLink to="/invoices" className="flex items-center gap-2">
                  <FileText />
                  <span>Invoices</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/products"}>
                <NavLink to="/products" className="flex items-center gap-2">
                  <Package />
                  <span>Products</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/products/new"}>
                <NavLink to="/products/new" className="flex items-center gap-2">
                  <PackagePlus />
                  <span>Add Product</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/estimates"}>
                <NavLink to="/estimates" className="flex items-center gap-2">
                  <FileSignature />
                  <span>Estimates</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/estimates/new"}>
                <NavLink to="/estimates/new" className="flex items-center gap-2">
                  <FilePlus2 />
                  <span>Create Estimate</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/payments"}>
                <NavLink to="/payments" className="flex items-center gap-2">
                  <CreditCard />
                  <span>Payments</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/payments/new"}>
                <NavLink to="/payments/new" className="flex items-center gap-2">
                  <CirclePlus />
                  <span>Record Payment</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/reports"}>
                <NavLink to="/reports" className="flex items-center gap-2">
                  <BarChart3 />
                  <span>Reports</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/templates/preview"}>
                <NavLink to="/templates/preview" className="flex items-center gap-2">
                  <Palette />
                  <span>Templates</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <NavLink to="/settings" className="flex items-center gap-2">
                  <Cog />
                  <span>Settings</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/invoices/new"}>
                <NavLink to="/invoices/new" className="flex items-center gap-2">
                  <FilePlus />
                  <span>Create Invoice</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/clients"}>
                <NavLink to="/clients" className="flex items-center gap-2">
                  <Users />
                  <span>Clients</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/clients/new"}>
                <NavLink to="/clients/new" className="flex items-center gap-2">
                  <UserPlus />
                  <span>Register New Client</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-xs text-muted-foreground px-2">v0.1</div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-12 items-center justify-between gap-2 border-b px-4 bg-[image:var(--gradient-finance)] bg-no-repeat">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className={cn("text-sm font-medium")}>{title}</div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
        <div key={pathname} className="p-4 animate-in fade-in slide-in-from-right-4 duration-300">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
