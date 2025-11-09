import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import CreateOrder from "./pages/CreateOrder";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const RequireProfileCompletion = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const hasCompletedProfile =
    typeof window === "undefined" ? true : window.localStorage.getItem("profileCompleted") === "true";

  if (!hasCompletedProfile) {
    if (location.pathname === "/profile") {
      return <>{children}</>;
    }

    return <Navigate replace state={{ from: location.pathname }} to="/profile" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireProfileCompletion>
                <Dashboard />
              </RequireProfileCompletion>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/orders"
            element={
              <RequireProfileCompletion>
                <Orders />
              </RequireProfileCompletion>
            }
          />
          <Route
            path="/orders/new"
            element={
              <RequireProfileCompletion>
                <CreateOrder />
              </RequireProfileCompletion>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <RequireProfileCompletion>
                <OrderDetail />
              </RequireProfileCompletion>
            }
          />
          <Route
            path="/products"
            element={
              <RequireProfileCompletion>
                <Products />
              </RequireProfileCompletion>
            }
          />
          <Route
            path="/products/new"
            element={
              <RequireProfileCompletion>
                <CreateProduct />
              </RequireProfileCompletion>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <RequireProfileCompletion>
                <EditProduct />
              </RequireProfileCompletion>
            }
          />
          <Route
            path="/customers"
            element={
              <RequireProfileCompletion>
                <Customers />
              </RequireProfileCompletion>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireProfileCompletion>
                <Settings />
              </RequireProfileCompletion>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={
              <RequireProfileCompletion>
                <NotFound />
              </RequireProfileCompletion>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
