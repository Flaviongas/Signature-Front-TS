import { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import Dashboard from "../components/Dashboard";
import { MajorShort } from "../types";
import ResponsiveAppBar from "../components/navbar/Navbar";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

function MainContent() {
  const [selectedMajor, setSelectedMajor] = useState<MajorShort>({
    id: 0,
    name: "",
  });

  useEffect(() => {
    const storedMajor = localStorage.getItem("SelectedMajor");
    if (storedMajor) {
      const parsed = JSON.parse(storedMajor);
      // Solo actualiza si aún no hay uno seleccionado
      if (parsed.id && selectedMajor.id === 0) {
        setSelectedMajor(parsed);
      }
    }
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box
      sx={{
       background: 'linear-gradient(to top, #3058c3, #5075db)' ,
      }}
    >
      <SideNav />
    </Box>
  );

  return (
    <Box sx={{ display: "flex",flexDirection:"column", height: "100vh", width: "100%" }}>
      <ResponsiveAppBar/>
      <Box component="nav" sx={{ width: { md: 288 }, flexShrink: { md: 0 } }}>
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
              top: "64px",
              height: "calc(100vh - 64px)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Drawer permanente para desktop */}
        <Drawer
          variant="permanent"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 288,
              top: "64px",
              height: "calc(100vh - 64px)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, bgcolor: "#f8f9fc", overflowY: "auto" }}>
        <Dashboard onDrawerToggle={handleDrawerToggle} />
      </Box>
    </Box>
  );
}

export default MainContent;
