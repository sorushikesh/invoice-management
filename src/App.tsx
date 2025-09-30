import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteChangeIndicator from "@/components/RouteChangeIndicator";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import InvoicesList from "./pages/Invoices/InvoicesList";
import InvoiceCreate from "./pages/Invoices/InvoiceCreate";
import ProductsList from "./pages/Products/ProductsList";
import ProductCreate from "./pages/Products/ProductCreate";
import EstimatesList from "./pages/Estimates/EstimatesList";
import EstimateCreate from "./pages/Estimates/EstimateCreate";
import PaymentsList from "./pages/Payments/PaymentsList";
import PaymentCreate from "./pages/Payments/PaymentCreate";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import TemplatePreview from "./pages/Templates/TemplatePreview";
import ClientRegister from "./pages/ClientRegister";
import ClientsList from "./pages/Clients/ClientsList";
import ClientDetails from "./pages/Clients/ClientDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <RouteChangeIndicator />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesList />} />
          <Route path="/invoices/new" element={<InvoiceCreate />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/new" element={<ProductCreate />} />
          <Route path="/estimates" element={<EstimatesList />} />
          <Route path="/estimates/new" element={<EstimateCreate />} />
          <Route path="/payments" element={<PaymentsList />} />
          <Route path="/payments/new" element={<PaymentCreate />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/templates/preview" element={<TemplatePreview />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/clients/new" element={<ClientRegister />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
