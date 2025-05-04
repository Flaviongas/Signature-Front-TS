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
  },
});

export default theme;
