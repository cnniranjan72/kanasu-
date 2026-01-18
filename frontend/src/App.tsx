import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CareerFormProvider } from "@/contexts/CareerFormContext";

import { MainLayout } from "@/components/MainLayout";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Institutions from "./pages/Institutions";
import Chat from "./pages/Chat";

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

              {/* MAIN LAYOUT */}
              <Route element={<MainLayout />}>

                <Route path="/home" element={<LandingPage />} />

                {/* 
                  SHARED PROVIDER (FIX)
                  Both pages use CareerFormContext
                */}
                <Route
                  element={
                    <CareerFormProvider>
                      <Outlet />
                    </CareerFormProvider>
                  }
                >
                  <Route path="/career-recommender" element={<CareerRecommender />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                </Route>

                <Route path="/institutions" element={<Institutions />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>

        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
