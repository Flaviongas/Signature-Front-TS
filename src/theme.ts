import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e53935",
      dark: "#C12141",
    },
    secondary: {
      main: "#3D3935",
      dark: "#1C1916",
    },
    info: {
      main: "#2E78BD",
    },
    success: {
      main: "#3454D1",
    },
  },
});

export default theme;
