import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import Container from "@mui/material/Container";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";


function ResponsiveAppBar() {

  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/");
  };

  const handleUserManagementClick = () => {
    navigate("/users");
  };

  const handleLogout = () => {
    localStorage.setItem("Token", "");
    localStorage.removeItem("IsSuperUser");
    localStorage.removeItem("SelectedMajor");
    location.reload();
  };
  

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#eee",
        color: "#858795",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        boxShadow: 3
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{padding: 0}}>

          <Box
            onClick={handleLogoClick}
            sx={{
              width: "20%",
              minWidth: 200,
              backgroundColor: "red",
              borderTopRightRadius: 25,
              borderBottomRightRadius: 8,
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              cursor: "pointer",
            }}
          >
            
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "white",
              }}
            >
              SIGNATURE
            </Typography>
          </Box>

          <Box
            sx={{
              width: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: 3,
            }}
          >
          {/* Espaciador */}
          <Box sx={{ flexGrow: 1 }} />

          <Button
            color="secondary"
            sx={{
              mx: 2,
            }}
            onClick={() => navigate("/students-management")}
          >
            Gestionar estudiantes
          </Button>
          <Button
            onClick={handleUserManagementClick}
            color="secondary"
            sx={{
              mx: 2,
            }}
          >
            Gestionar Usuarios
          </Button>

          {/* Icono de cerrar sesión */}
          <Box sx={{ flexGrow: 0, mr: 1 }}>
            <Tooltip title="Cerrar sesión">
              <IconButton 
                onClick={handleLogout}
                sx={{ 
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)"
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>

            {/* INGRESAR LA LOGICA DE FOTO DE PERFIL*/}
        </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;