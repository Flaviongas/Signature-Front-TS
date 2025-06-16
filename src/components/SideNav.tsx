import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import { useContext, useState, useEffect } from "react";
import { User, Major } from "../types";
import MajorContext from "../contexts/MajorContext";
import { getUser } from "../services/userService";


function SideNav() {
  const { setSelectedMajor } = useContext(MajorContext);
  const [userMajors, setUserMajors] = useState<Major[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await getUser(parseInt(userId));
          const userData: User = response.data;
          setUserMajors(userData.majors);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Renderización condicional según si los datos están cargando o no
  return loading ? (
    <Box p={2}>
      {[...Array(5)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={40}
          sx={{ mb: 2 }}
        />
      ))}
    </Box>
  ) : (
    <Paper
      elevation={0}
      sx={{
        height:"100vh",
        p: 2,
        overflowY: "clip",
        bgcolor: "transparent",
        borderRadius: 0,
        color: "#ccd7f2",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, textAlign: "center", my: 2, color: "white" }}
      >
        Carreras
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Buscar carrera"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        inputProps={{
          style: { textAlign: "center" },
        }}
        sx={{
          textAlign: "center",
          bgcolor: "white",
          borderRadius: "11px",
          mb: 2,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderRadius: "11px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "black",
              borderWidth: 2,
              borderRadius: "11px",
            },
          },
        }}
      />

      <List>
        {userMajors
          .filter((major) =>
            major.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((major) => (
            <ListItemButton
              key={major.id}
              onClick={() => {
                const selected = { id: major.id, name: major.name };
                setSelectedMajor(selected);
                localStorage.setItem("SelectedMajor", JSON.stringify(selected));
              }}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&:hover": {
                  bgcolor: "#ccd7f2",
                  color: "black",
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    textAlign="center"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {major.name}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
      </List>
    </Paper>
  );
}

export default SideNav;
