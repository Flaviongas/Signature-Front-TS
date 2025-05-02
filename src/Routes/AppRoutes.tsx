import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import MainContent from "./MainContent";
import UserManagementPage from "./UserManagementPage";

const isAuthenticated = () => {
  return !!localStorage.getItem("Token");
};

const isSuperUser = () => {
  return localStorage.getItem("IsSuperUser") === "true";
};

function AppRoutes() {
  //   const navigate = useNavigate();
  return (
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
    </Routes>
  );
}

export default AppRoutes;
