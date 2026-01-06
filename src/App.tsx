import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AssetDetail } from "./pages/AssetDetail";
import LearningLoop from "./pages/LearningLoop";
import NotificationCenter from "./pages/NotificationCenter";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

import { UserProvider } from "./context/UserContext";
import Onboarding from "./pages/Onboarding";

// ...

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/intro" element={<Onboarding />} />

            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/asset" element={<AssetDetail />} />
              <Route path="/asset/:symbol" element={<AssetDetail />} />
              <Route path="/learning-loop" element={<LearningLoop />} />
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
