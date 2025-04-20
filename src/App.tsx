import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  return (
    <BrowserRouter basename="/signature">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
