import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";

function App() {
const token = localStorage.getItem("Token");
const authenticated = token ? token.length > 0 : false;
  return (
    <BrowserRouter basename="/signature">
      <AppRoutes authenticated={authenticated} />
    </BrowserRouter>
  );
}

export default App;
