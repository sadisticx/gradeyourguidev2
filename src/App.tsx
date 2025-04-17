import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "virtual:generated-pages-react";
import AuthGuard from "./components/auth/AuthGuard";
import StudentPortalPage from "./pages/student";
import StudentEvaluationPage from "./pages/student/evaluation";

// Lazy load pages
const LoginPage = lazy(() => import("./pages/login"));
const AdminsPage = lazy(() => import("./pages/admins"));
const FormsPage = lazy(() => import("./pages/forms"));
const QuestionnairesPage = lazy(() => import("./pages/questionnaires"));
const AnalyticsPage = lazy(() => import("./pages/analytics"));
const SectionsPage = lazy(() => import("./pages/sections"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Student routes - accessible without authentication */}
          <Route path="/student" element={<StudentPortalPage />} />
          <Route
            path="/student/evaluation/:formId"
            element={<StudentEvaluationPage />}
          />
          {/* Demo form direct access */}
          <Route path="/demo-evaluation" element={<StudentEvaluationPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
          <Route
            path="/admins"
            element={
              <AuthGuard>
                <AdminsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/forms"
            element={
              <AuthGuard>
                <FormsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/questionnaires"
            element={
              <AuthGuard>
                <QuestionnairesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/analytics"
            element={
              <AuthGuard>
                <AnalyticsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/sections"
            element={
              <AuthGuard>
                <SectionsPage />
              </AuthGuard>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {/* Include dynamic routes */}
        {useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
