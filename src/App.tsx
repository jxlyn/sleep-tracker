import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SleepLogger } from "./components/SleepLogger";
import { QualityAssessment } from "./components/QualityAssessment";
import { SleepSummary } from "./components/SleepSummary";
import { Layout } from "./components/Layout";
import { UserProfile } from "./components/UserProfile";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { AuthMiddleware } from "./middleware/auth";
import { AuthProvider } from "@/lib/auth.tsx";

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
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={
              <AuthMiddleware>
                <Index />
              </AuthMiddleware>
            } />
            <Route path="/log" element={
              <AuthMiddleware>
                <Layout>
                  <SleepLogger />
                </Layout>
              </AuthMiddleware>
            } />
            <Route path="/assessment" element={
              <AuthMiddleware>
                <Layout>
                  <QualityAssessment />
                </Layout>
              </AuthMiddleware>
            } />
            <Route path="/summary" element={
              <AuthMiddleware>
                <Layout>
                  <SleepSummary />
                </Layout>
              </AuthMiddleware>
            } />
            <Route path="/profile" element={
              <AuthMiddleware>
                <Layout>
                  <UserProfile />
                </Layout>
              </AuthMiddleware>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
