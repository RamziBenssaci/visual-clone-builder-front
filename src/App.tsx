
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./contexts/StoreContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./components/Dashboard"; // or "./pages/Dashboard" depending on where it is
import NotFound from "./pages/NotFound";
import Customers from "./components/Customers";
import Register from "./components/Register";
import Earn from "./components/Earn";
import Redeem from "./components/Redeem";
import Remove from "./components/Remove";
import Campaigns from "./components/Campaigns";
import Transactions from "./components/Transactions";
import Settings from "./components/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
<Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/register" element={<Register />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/redeem" element={<Redeem />} />
              <Route path="/remove" element={<Remove />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;
