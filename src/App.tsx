import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { useAuth, useCareerProfile, useInterviewSessions, useMockAttempts, useJobApplications } from "@/lib/store";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import CareerDNAPage from "./pages/CareerDNAPage";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import JobTrackerPage from "./pages/JobTrackerPage";
import ProgressPage from "./pages/ProgressPage";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, login, signup, logout } = useAuth();
  const { profile, saveProfile } = useCareerProfile(user?.id);
  const { sessions, addSession } = useInterviewSessions(user?.id);
  const { attempts, addAttempt } = useMockAttempts(user?.id);
  const { jobs, addJob, updateJob } = useJobApplications(user?.id);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <AppLayout onLogout={logout}>{children}</AppLayout>;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onLogin={login} onSignup={signup} />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="signup" onLogin={login} onSignup={signup} />} />
      <Route path="/onboarding" element={user ? <OnboardingPage user={user} onSave={saveProfile} /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage user={user!} profile={profile} sessions={sessions} mocks={attempts} jobs={jobs} /></ProtectedRoute>} />
      <Route path="/career-dna" element={<ProtectedRoute><CareerDNAPage user={user!} profile={profile} /></ProtectedRoute>} />
      <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrepPage sessions={sessions} onAddSession={addSession} userId={user?.id || ""} /></ProtectedRoute>} />
      <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewPage sessions={sessions} attempts={attempts} onAddAttempt={addAttempt} userId={user?.id || ""} /></ProtectedRoute>} />
      <Route path="/job-tracker" element={<ProtectedRoute><JobTrackerPage jobs={jobs} sessions={sessions} onAddJob={addJob} onUpdateJob={updateJob} userId={user?.id || ""} /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressPage mocks={attempts} sessions={sessions} /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
