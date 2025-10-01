import { ReactNode, useState } from "react";
import { Link as RouterLink, NavLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import NotificationsBell from "@/components/NotificationsBell";
import UserMenu from "@/components/UserMenu";
import TenantBadge from "@/components/TenantBadge";
import { useTenant } from "@/contexts/TenantContext";

type Props = {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
  actions?: ReactNode;
};

const drawerWidth = 260;

const moduleLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/invoices", label: "Invoices" },
  { to: "/vendors", label: "Vendors" },
  { to: "/clients", label: "Clients" },
  { to: "/customers", label: "Customers" },
  { to: "/products", label: "Products" },
  { to: "/reports", label: "Reports" },
  { to: "/settings", label: "Settings" },
];

const quickLinks = [
  { to: "/vendors", label: "Add Vendor" },
  { to: "/clients/new", label: "Add Client" },
  { to: "/customers/new", label: "Add Customer" },
  { to: "/invoices/new", label: "New Invoice" },
];

export default function MUIAppLayout({ children, title, breadcrumbs, actions }: Props) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { tenants } = useTenant();
  const multiTenant = tenants.length > 1;

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <TenantBadge />
      </Box>
      <List
        subheader={<ListSubheader component="div">Quick Links</ListSubheader>}
        sx={{ flex: 1, p: 0 }}
      >
        {quickLinks.map((link) => (
          <ListItem key={link.label} disablePadding>
            <ListItemButton component={NavLink as any} to={link.to} onClick={() => setMobileOpen(false)}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          border: "1px solid",
          borderColor: "divider",
          backgroundImage: "var(--gradient-finance)",
          backgroundColor: "transparent",
          backdropFilter: "saturate(1.2) blur(10px)",
        }}
      >
        <Toolbar sx={{ gap: 3, minHeight: 72 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {multiTenant && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { sm: "none" } }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={RouterLink as any}
              to="/dashboard"
              sx={{ color: "inherit", textDecoration: "none", fontWeight: 700 }}
            >
              Invoice Manager
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1, justifyContent: "center" }}>
            {moduleLinks.map((module) => {
              const active = pathname === module.to || pathname.startsWith(`${module.to}/`);
              return (
                <Button
                  key={module.to}
                  component={NavLink as any}
                  to={module.to}
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    fontWeight: active ? 600 : 500,
                    opacity: active ? 1 : 0.72,
                    bgcolor: active ? "action.selected" : "transparent",
                    borderRadius: 20,
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      bgcolor: "action.hover",
                      opacity: 1,
                    },
                  }}
                >
                  {module.label}
                </Button>
              );
            })}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {actions}
            <NotificationsBell />
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
      {multiTenant && (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              '& .MuiDrawer-paper': { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              '& .MuiDrawer-paper': { boxSizing: "border-box", width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: {
            xs: "100%",
            sm: multiTenant ? `calc(100% - ${drawerWidth}px)` : "100%",
          },
        }}
      >
        <Toolbar />
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
              {breadcrumbs.map((b, i) =>
                i < breadcrumbs.length - 1 ? (
                  <Link key={i} underline="hover" color="inherit" component={RouterLink as any} to={b.to || "#"}>
                    {b.label}
                  </Link>
                ) : (
                  <Typography key={i} color="text.primary">
                    {b.label}
                  </Typography>
                ),
              )}
            </Breadcrumbs>
          </Box>
        )}
        {title && (
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
}

