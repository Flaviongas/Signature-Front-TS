import { useState } from "react";
import Login from "./components/Login";
import MainContent from "./Routes/MainContent";

function App() {
  return (
    <>
      <MainContent />
    </>
  );

  const [authToken, setAuthToken] = useState("");

  const token = localStorage.getItem("Token") || "";
  const onLogin = (token: string) => {
    setAuthToken(token)
  }



  if (authToken || token) {
    console.log("token", token);
    return <MainContent />;
  } else {
    console.log("no token", token);
    return <Login onLoginSuccess={onLogin} backLink="http://localhost:8000" />;
  }
}

export default App;
