import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { HeaderNav } from './components/layout/HeaderNav';
import { PageFooter } from './components/layout/PageFooter';
import { HomePage } from './pages/home/HomePage';
import { BrowseJobsPage } from './pages/jobs/BrowseJobsPage';
import { JobDetailPage } from './pages/jobs/JobDetailPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { EmployerDashboard } from './pages/employer/EmployerDashboard';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

function App() {
  const { user, profile, loading, signIn, signUp, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <HeaderNav user={user} profile={profile} onLogout={signOut} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<BrowseJobsPage />} />
            <Route
              path="/jobs/:id"
              element={<JobDetailPage user={user} profile={profile} />}
            />

            <Route
              path="/auth/login"
              element={
                user ? <Navigate to="/" replace /> : <LoginPage onLogin={signIn} />
              }
            />
            <Route
              path="/auth/register"
              element={
                user ? <Navigate to="/" replace /> : <RegisterPage onRegister={signUp} />
              }
            />

            <Route
              path="/employer/dashboard"
              element={
                user && profile?.role === 'employer' ? (
                  <EmployerDashboard profile={profile} />
                ) : (
                  <Navigate to="/auth/login" replace />
                )
              }
            />

            <Route
              path="/candidate/dashboard"
              element={
                user && profile?.role === 'candidate' ? (
                  <CandidateDashboard profile={profile} />
                ) : (
                  <Navigate to="/auth/login" replace />
                )
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <PageFooter />
      </div>
    </Router>
  );
}

export default App;
