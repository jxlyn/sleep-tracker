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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/log" element={
            <Layout>
              <SleepLogger />
            </Layout>
          } />
          <Route path="/assessment" element={
            <Layout>
              <QualityAssessment />
            </Layout>
          } />
          <Route path="/summary" element={
            <Layout>
              <SleepSummary />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <UserProfile />
            </Layout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
