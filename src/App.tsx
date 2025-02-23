import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ElevenLabsWidget from "./components/ElevenLabsWidget";
import { useSupabaseUser } from "./hooks/useSupabaseUser";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useSupabaseUser();

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching user data
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Index />
                    {user ? (
                      <ElevenLabsWidget userId={user.id} />
                    ) : (
                      <p>Loading user...</p>
                    )}
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
