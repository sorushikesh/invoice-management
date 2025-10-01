import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteChangeIndicator from "@/components/RouteChangeIndicator";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import CommandPalette from "@/components/CommandPalette";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import InvoicesList from "./pages/Invoices/InvoicesList";
import InvoiceCreate from "./pages/Invoices/InvoiceCreate";
import InvoiceView from "./pages/Invoices/InvoiceView";
import InvoicePreview from "./pages/Invoices/InvoicePreview";
import ProductsList from "./pages/Products/ProductsList";
import ProductCreate from "./pages/Products/ProductCreate";
import VendorsList from "./pages/Vendors/VendorsList";
import VendorDetails from "./pages/Vendors/VendorDetails";
import VendorForm from "./pages/Vendors/VendorForm";
import EstimatesList from "./pages/Estimates/EstimatesList";
import EstimateCreate from "./pages/Estimates/EstimateCreate";
import PaymentsList from "./pages/Payments/PaymentsList";
import PaymentCreate from "./pages/Payments/PaymentCreate";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import TemplatePreview from "./pages/Templates/TemplatePreview";
import ClientsList from "./pages/Clients/ClientsList";
import ClientDetails from "./pages/Clients/ClientDetails";
import CustomerForm from "./pages/Customers/CustomerForm";
import CustomersList from "./pages/Customers/CustomersList";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import ClientRegister from "./pages/ClientRegister";
import TenantsList from "./pages/Tenants/TenantsList";
import TenantCreate from "./pages/Tenants/TenantCreate";
import TenantDetails from "./pages/Tenants/TenantDetails";
import UsersList from "./pages/Users/UsersList";
import AuditLogs from "./pages/AuditLogs/AuditLogs";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import ThemeBridge from "@/material/ThemeBridge";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TenantProvider>
          <ThemeBridge>
            <Toaster />
            <BrowserRouter>
              <RouteChangeIndicator />
              <CommandPalette />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invoices" element={<InvoicesList />} />
                <Route path="/invoices/new" element={<InvoiceCreate />} />
                <Route path="/invoices/:id" element={<InvoiceView />} />
                <Route path="/invoices/:id/preview" element={<InvoicePreview />} />
                <Route path="/products" element={<ProductsList />} />
                <Route path="/products/new" element={<ProductCreate />} />
                <Route path="/vendors" element={<VendorsList />} />
                <Route path="/vendors/new" element={<VendorForm />} />
                <Route path="/vendors/:id" element={<VendorDetails />} />
                <Route path="/vendors/:id/edit" element={<VendorForm />} />
                <Route path="/estimates" element={<EstimatesList />} />
                <Route path="/estimates/new" element={<EstimateCreate />} />
                <Route path="/payments" element={<PaymentsList />} />
                <Route path="/payments/new" element={<PaymentCreate />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
                <Route path="/templates/preview" element={<TemplatePreview />} />
                <Route path="/clients" element={<ClientsList />} />
                <Route path="/clients/:id" element={<ClientDetails />} />
                <Route path="/clients/new" element={<ClientRegister />} />
                <Route path="/clients/:id/edit" element={<ClientRegister />} />
                <Route path="/customers" element={<CustomersList />} />
                <Route path="/customers/:id" element={<CustomerDetails />} />
                <Route path="/customers/new" element={<CustomerForm />} />
                <Route path="/customers/:id/edit" element={<CustomerForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tenants" element={<TenantsList />} />
                <Route path="/tenants/new" element={<TenantCreate />} />
                <Route path="/tenants/:id" element={<TenantDetails />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ThemeBridge>
        </TenantProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;



