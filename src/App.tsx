import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/Sidebar";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ProjectProvider } from "./contexts/ProjectContext";
import { Projects } from "./pages/Projects";
// import Practice from "./pages/Practice";
// import TeacherDashboard from "./pages/TeacherDashboard";
// import ProjectLibrary from "./pages/ProjectLibrary";
// import ResourceHub from "./pages/ResourceHub";
// import ClassManagement from "./pages/ClassManagement";
// import Analytics from "./pages/Analytics";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/i18n/locales/index";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <SidebarProvider>
        <AppSidebar className="w-64 border-r" />
        <div className="flex-1 p-4">
          <div className="rounded-xl bg-background min-h-[calc(100vh-2rem)] shadow-lg">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 text-foreground" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                {/* breadcrumbs to eb added later */}
              </div>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProjectProvider>
            <AppContent />
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

// New component to use language after provider is initialized
function AppContent() {
  const { language } = useLanguage();
  return (
    <NextIntlClientProvider
      messages={messages[language as keyof typeof messages]}
      locale={language}
    >
      <div className="app-container">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Dashboard</div>
                  {/* <TeacherDashboard /> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/lesson-planner"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                  {/* <ProjectLibrary /> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <div>assessment</div>
                  {/* <Assessment /> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/class-management"
              element={
                <ProtectedRoute>
                  <div>Class Management</div>
                  {/* <ClassManagement /> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <div>resources</div>
                  {/* <Analytics /> */}
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </div>
    </NextIntlClientProvider>
  );
}

export default App;
