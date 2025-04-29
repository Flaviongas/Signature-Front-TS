import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import { FormEvent, useContext, useState, useEffect } from "react";
import { User, Major } from "../types";
import MajorContext from "../contexts/MajorContext";
import { getUser } from "../services/userService";

function SideNav() {
  const { setSelectedMajor } = useContext(MajorContext);

  const [userMajors, setUserMajors] = useState<Major[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("UserId");
      if (userId) {
        try {
          const response = await getUser(parseInt(userId));
          console.log("Respuesta completa:", response.data);
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

  // Función que se ejecuta al enviar el formulario de búsqueda
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

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
        p: 2,
        height: "70vh",
        overflowY: "auto",
        bgcolor: "#f9f9f9",
        borderRadius: 0,
      }}
    >
      <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
        Carreras
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          placeholder="Buscar carrera"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
      </form>

      <List disablePadding>
        {userMajors
          .filter((major) =>
            major.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((major) => (
            <ListItemButton
              key={major.id}
              onClick={() =>
                setSelectedMajor({
                  id: major.id,
                  name: major.name,
                  // Si necesitas más información del major, puedes pasar el objeto completo
                  // y actualizar el tipo en MajorContext
                })
              }
              sx={{
                borderRadius: 2,
                mb: 1,
                "&:hover": {
                  bgcolor: "#3454D1",
                  color: "white",
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography textAlign="center">{major.name}</Typography>
                }
              />
            </ListItemButton>
          ))}
      </List>
    </Paper>
  );
}

export default SideNav;
