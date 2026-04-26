import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import { Layout } from "./components/Layout";
import { Dashboard } from "./screens/Dashboard";
import { Modules } from "./screens/Modules";
import { Quiz } from "./screens/Quiz";
import { Certificates } from "./screens/Certificates";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";
import { Login } from "./screens/Login";
import { About } from "./screens/About";
import { AnimatePresence } from "motion/react";
import { Toaster } from 'sonner';

function ProtectedRoute() {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  return (
    <AnimatePresence mode="wait">
      {/* @ts-expect-error - key is a valid React prop but omitted from RoutesProps */}
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const theme = useAppStore(state => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Notice we removed the top-level checking of isAuthenticated
  // because AnimatedRoutes and ProtectedRoute will handle it.

  return (
    <Router>
      <AnimatedRoutes />
      <Toaster position="bottom-right" />
    </Router>
  );
}
