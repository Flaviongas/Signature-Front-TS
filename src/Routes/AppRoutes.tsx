import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import MainContent from "./MainContent";
import UserManagementPage from "./UserManagementPage";
import StudentSubjectManagementPage from "./StudentSubjectManagementPage"
import StudentManagementPage from "./StudentManagementPage";
import MajorContext from "../contexts/MajorContext";
import { useState, useEffect } from "react";
import { MajorShort } from "../types";

const isAuthenticated = () => {
  return !!localStorage.getItem("Token");
};

const isSuperUser = () => {
  return localStorage.getItem("IsSuperUser") === "true";
};

function AppRoutes() {
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
  return (
    <MajorContext.Provider value={{ selectedMajor, setSelectedMajor }}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? <MainContent /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
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
            isAuthenticated() ? (
              isSuperUser() ? (
                <UserManagementPage />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/students"
          element={
            isAuthenticated() ? (
              isSuperUser() ? (
                <StudentSubjectManagementPage/>
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/students-management" element={<StudentManagementPage />} />
      </Routes>
    </MajorContext.Provider>
  );
}

export default AppRoutes;
