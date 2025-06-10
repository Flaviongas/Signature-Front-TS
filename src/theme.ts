import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      // Color rojo
      main: "#e53935",
      dark: "#C12141",
    },
    secondary: {
      // Color gris
      main: "#3D3935",
      dark: "#1C1916",
    },
    info: {
      main: "#2E78BD",
      dark: "#1C4A7A",
    },
    success: {
      main: "#3454D1",
    },
  },
});

export default theme;
