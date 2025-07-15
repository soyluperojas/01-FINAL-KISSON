import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import SplashScreen from "./pages/SplashScreen";
import IntroNarrative from "./pages/IntroNarrative"; // ✅ NUEVO
import Intro from "./pages/Intro";
import Choosing from "./pages/Choosing";
import IntroText from "./pages/IntroText";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Recipe from "./pages/Recipe";
import NotFound from "./pages/NotFound";
import QrRecipe from "./pages/QrRecipe";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Pantallas iniciales del flujo */}
              <Route path="/" element={<SplashScreen />} />
              <Route path="/narrative" element={<IntroNarrative />} /> {/* ✅ NUEVA pantalla negra */}
              <Route path="/intro" element={<Intro />} />
              <Route path="/choosing" element={<Choosing />} />
              <Route path="/intro-text" element={<IntroText />} />

              {/* Resto del sistema */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="/qr-view/:id" element={<QrRecipe />} />
              <Route path="/index" element={<Index />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/wizard" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
