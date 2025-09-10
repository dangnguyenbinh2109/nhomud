// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";      
import TeacherLayout from "@/layouts/TeacherLayout"; 
import Home from "@/pages/Home/index.jsx";
import LoginPage from "@/pages/Auth/Login";
import TeacherDashboard from "@/pages/Dashboard/TeacherDashboard";

function Protected({ children }) {
  const hasToken = !!localStorage.getItem("token");
  return hasToken ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <Protected>
            <TeacherLayout>
              <TeacherDashboard />
            </TeacherLayout>
          </Protected>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
