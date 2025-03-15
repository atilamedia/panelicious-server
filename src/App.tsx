
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Nginx from "./pages/Nginx";
import PHP from "./pages/PHP";
import MySQL from "./pages/MySQL";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import FileManager from "./pages/FileManager";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/nginx" element={<ProtectedRoute><Nginx /></ProtectedRoute>} />
            <Route path="/php" element={<ProtectedRoute><PHP /></ProtectedRoute>} />
            <Route path="/mysql" element={<ProtectedRoute><MySQL /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/files" element={<ProtectedRoute><FileManager /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
