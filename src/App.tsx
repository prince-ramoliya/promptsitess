import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import HowItWorks from "./pages/HowItWorks";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComponents from "./pages/AdminComponents";
import AdminCategories from "./pages/AdminCategories";
import Library from "./pages/Library";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/library" element={<Library />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="components" element={<AdminComponents />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
