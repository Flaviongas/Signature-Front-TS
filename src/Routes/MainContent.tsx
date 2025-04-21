import { useState } from "react";
import SideNav from "../components/SideNav";
import Dashboard from "../components/Dashboard";
import { MajorShort, Subject } from "../types";
import MajorContext from "../contexts/MajorContext";
import SubjectContext from "../contexts/SubjectContext";

import logo from "../assets/signature.svg";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

// type Props = {};

function MainContent() {
  const [selectedMajor, setSelectedMajor] = useState<MajorShort>({
    id: 0,
    name: "",
  });
  const [SubjectData, setSubjectData] = useState<Subject[]>([]);

  const logOut = () => {
    localStorage.setItem("Token", "");
    location.reload();
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box
      sx={{
        bgcolor: "#3454D1",
        height: "100%",
      }}
    >
      {/* logo */}
      <Box display="flex" justifyContent="center">
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{ width: 160, height: 160, objectFit: "contain" }}
        />
      </Box>

      <SideNav />

      <Box p={2} mt={1}>
        <Button
          variant="contained"
          onClick={logOut}
          sx={{
            backgroundColor: "#D1495B",
            width: "100%",
            "&:hover": {
              backgroundColor: "#C43145",
            },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <MajorContext.Provider value={{ selectedMajor, setSelectedMajor }}>
      <SubjectContext.Provider value={{ SubjectData, setSubjectData }}>
        <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
          <Box
            component="nav"
            sx={{ width: { md: 288 }, flexShrink: { md: 0 } }}
          >
            {/* Drawer para móviles */}
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: 240,
                },
              }}
            >
              {drawerContent}
            </Drawer>

            {/* Drawer permanente para desktop */}
            <Drawer
              variant="permanent"
              open
              sx={{
                display: { xs: "none", md: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: 288,
                  bgcolor: "#3454D1",
                },
              }}
            >
              {drawerContent}
            </Drawer>
          </Box>

          {/* Contenido principal */}
          <Box sx={{ flex: 1, bgcolor: "#EFEFEF", overflowY: "auto" }}>
            <Dashboard onDrawerToggle={handleDrawerToggle} />
          </Box>
        </Box>
      </SubjectContext.Provider>
    </MajorContext.Provider>
  );
}

export default MainContent;
