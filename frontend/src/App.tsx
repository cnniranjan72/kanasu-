import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CareerFormProvider } from "@/contexts/CareerFormContext";

import { MainLayout } from "@/components/MainLayout";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";

import LandingPage from "./pages/LandingPage";
import CareerRecommender from "./pages/CareerRecommender";
import Roadmap from "./pages/Roadmap";
import Scholarships from "./pages/Scholarships";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>

              {/* DEFAULT ROUTE */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* AUTH ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* MAIN APP LAYOUT */}
              <Route element={<MainLayout />}>

                <Route path="/home" element={<LandingPage />} />

                {/* Wrap ONLY career recommender with the provider */}
                <Route
                  path="/career-recommender"
                  element={
                    <CareerFormProvider>
                      <CareerRecommender />
                    </CareerFormProvider>
                  }
                />

                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/profile" element={<Profile />} />

              </Route>

              {/* NOT FOUND */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>

        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
