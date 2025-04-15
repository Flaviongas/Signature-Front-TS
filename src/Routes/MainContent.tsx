import { useState } from "react";
import SideNav from "../components/SideNav";
import Dashboard from "../components/Dashboard";
import { MajorShort, Subject } from "../types";
import MajorContext from "../contexts/MajorContext";
import SubjectContext from "../contexts/SubjectContext";

import logo from "../assets/signature.svg";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// type Props = {};

function MainContent() {
  const [selectedMajors, setSelectedMajors] = useState<MajorShort>({
    id: 0,
    name: "",
  });
  const [SubjectData, setSubjectData] = useState<Subject[]>([]);

  const logOut = () => {
    localStorage.setItem("Token", "");
    location.reload();
  };

  return (
    <MajorContext.Provider value={{ selectedMajors, setSelectedMajors }}>
      <SubjectContext.Provider value={{ SubjectData, setSubjectData }}>
        <Box display="flex" flexDirection="row" width="100%" height="100vh">
          <Box minWidth={224} maxWidth={288} bgcolor="#3454D1">
            <Box display="flex" justifyContent="center" my={2}>
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  width: 160,
                  height: 160,
                  objectFit: "contain",
                }}
              />
            </Box>

            <SideNav />

            <Box my={2} px={5}>
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

          {/* Contenido principal */}
          <Box flex={1} bgcolor="#EFEFEF">
            <Dashboard />
          </Box>
        </Box>
      </SubjectContext.Provider>
    </MajorContext.Provider>
  );
}

export default MainContent;
