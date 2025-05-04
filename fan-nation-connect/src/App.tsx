
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SportProvider } from "@/contexts/SportContext";
import { ThreadProvider } from "@/contexts/ThreadContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PollProvider } from "@/contexts/PollContext";

import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import SportPage from "@/pages/SportPage";
import ThreadDetailPage from "@/pages/ThreadDetailPage";
import CreateThreadPage from "@/pages/CreateThreadPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import NotFound from "@/pages/NotFound";
import Polls from "@/pages/Polls";
import CreatePollPage from "@/pages/CreatePollPage";
import Notifications from "@/pages/Notifications";
import SearchPage from "@/pages/SearchPage";
import AdminDashboard from "@/pages/AdminDashboard";
import ModeratorDashboard from "@/pages/ModeratorDashboard";
import DiscoverPage from "@/pages/DiscoverPage";
import ThreadsPage from "@/pages/ThreadsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SportProvider>
          <ThreadProvider>
            <ThemeProvider>
              <NotificationProvider>
                <PollProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/sport/:slug" element={<SportPage />} />
                        <Route path="/thread/:id" element={<ThreadDetailPage />} />
                        <Route path="/create-thread" element={<CreateThreadPage />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                        <Route path="/polls" element={<Polls />} />
                        <Route path="/create-poll" element={<CreatePollPage />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/moderator" element={<ModeratorDashboard />} />
                        <Route path="/discover" element={<DiscoverPage />} />
                        <Route path="/threads" element={<ThreadsPage />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </PollProvider>
              </NotificationProvider>
            </ThemeProvider>
          </ThreadProvider>
        </SportProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;