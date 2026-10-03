import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import SideBar from "./component/SideBar/SideBar";

import Dashboard from "./pages/Dashboard/Dashboard";
import ResumeAnalysis from "./pages/ResumeAnalysis/ResumeAnalysis";

import History from "./pages/History/History";
import Settings from "./pages/Settings/Settings";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import LogoutLogin from "./pages/Login/LogoutLogin";

import "./App.css";

function AppLayout() {
  return (
    <div className="App">
      <SideBar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route
            path="/resume-analysis/:id"
            element={<ResumeAnalysis />}
          />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const { showLogoutLogin } = useAuth();

  return (
    <BrowserRouter>
      <AppLayout />

      {showLogoutLogin && <LogoutLogin />}
    </BrowserRouter>
  );
}

export default App;