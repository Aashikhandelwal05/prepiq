import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { useAuth, useCareerProfile, useInterviewSessions, useMockAttempts, useJobApplications } from "@/lib/store";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CareerDNAPage = lazy(() => import("./pages/CareerDNAPage"));
const InterviewPrepPage = lazy(() => import("./pages/InterviewPrepPage"));
const MockInterviewPage = lazy(() => import("./pages/MockInterviewPage"));
const JobTrackerPage = lazy(() => import("./pages/JobTrackerPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
      Loading...
    </div>
  );
}

function AppRoutes() {
  const { user, login, signup, logout, hydrated } = useAuth();
  const { profile, saveProfile } = useCareerProfile(user?.id);
  const { sessions, addSession } = useInterviewSessions(user?.id);
  const { attempts, addAttempt } = useMockAttempts(user?.id);
  const { jobs, addJob, updateJob } = useJobApplications(user?.id);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!hydrated) return <RouteFallback />;
    if (!user) return <Navigate to="/login" replace />;
    return <AppLayout onLogout={logout}>{children}</AppLayout>;
  };

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={!hydrated ? <RouteFallback /> : user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onLogin={login} onSignup={signup} />} />
        <Route path="/signup" element={!hydrated ? <RouteFallback /> : user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="signup" onLogin={login} onSignup={signup} />} />
        <Route path="/onboarding" element={!hydrated ? <RouteFallback /> : user ? <OnboardingPage user={user} onSave={saveProfile} /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage user={user!} profile={profile} sessions={sessions} mocks={attempts} jobs={jobs} /></ProtectedRoute>} />
        <Route path="/career-dna" element={<ProtectedRoute><CareerDNAPage user={user!} profile={profile} /></ProtectedRoute>} />
        <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrepPage sessions={sessions} onAddSession={addSession} userId={user?.id || ""} /></ProtectedRoute>} />
        <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewPage sessions={sessions} attempts={attempts} onAddAttempt={addAttempt} userId={user?.id || ""} /></ProtectedRoute>} />
        <Route path="/job-tracker" element={<ProtectedRoute><JobTrackerPage jobs={jobs} sessions={sessions} onAddJob={addJob} onUpdateJob={updateJob} userId={user?.id || ""} /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage mocks={attempts} sessions={sessions} /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
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
