import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import MainContent from "./MainContent";
import UserManagementPage from "./UserManagementPage";
import StudentSubjectManagementPage from "./StudentSubjectManagementPage"
import StudentManagementPage from "./StudentManagementPage";
import MajorContext from "../contexts/MajorContext";
import { useState, useEffect } from "react";
import { MajorShort } from "../types";


const isSuperUser = () => {
  return localStorage.getItem("IsSuperUser") === "true";
};

function AppRoutes({authenticated}: { authenticated: boolean }) {
  const [selectedMajor, setSelectedMajor] = useState<MajorShort>({
    id: 0,
    name: "",
  });


  useEffect(() => {
    const storedMajor = localStorage.getItem("SelectedMajor");
    if (storedMajor) {
      try {
        const parsed = JSON.parse(storedMajor);
        if (parsed && parsed.id) {
          setSelectedMajor(parsed);
        }
      } catch (error) {
        console.error("Error parsing stored major:", error);
      }
    }
  }, []);

  // Actualizar localStorage cuando cambie selectedMajor
  useEffect(() => {
    if (selectedMajor.id !== 0) {
      localStorage.setItem("SelectedMajor", JSON.stringify(selectedMajor));
    }
  }, [selectedMajor]);

  // Componente de protección para rutas de administración
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (!isSuperUser()) {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };
  
  return (
    <MajorContext.Provider value={{ selectedMajor, setSelectedMajor }}>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? <MainContent /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            authenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                onLoginSuccess={(token: string) => {
                  localStorage.setItem("Token", token);
                  window.location.href = "/";
                }}
                backLink={import.meta.env.VITE_API_URL}
              />
            )
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UserManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/students"
          element={
            
              <StudentSubjectManagementPage/>
            
          }
        />
        <Route
          path="/students-management"
          element={
            <AdminRoute>
              <StudentManagementPage />
            </AdminRoute>
          }
        />
        {/* Ruta wildcard para cualquier otra URL que no coincida */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MajorContext.Provider>
  );
}

export default AppRoutes;