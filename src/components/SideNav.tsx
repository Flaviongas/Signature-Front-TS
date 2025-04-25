import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import { FormEvent, useContext, useState } from "react";
import { MajorShort } from "../types";
import MajorContext from "../contexts/MajorContext";
import useGetData from "../hooks/useGetData";

function SideNav() {
  // URL de la API para obtener las carreras
  const apiUrl = import.meta.env.VITE_API_URL + "/api/majors/getMajors/";

  // Hook personalizado para obtener datos desde la API
  const { data, loading } = useGetData<MajorShort>(apiUrl);

  // Estado para almacenar el valor de búsqueda del usuario
  const [searchQuery, setSearchQuery] = useState<MajorShort>({
    id: 0,
    name: "",
  });

  // Contexto para manejar las carreras seleccionadas
  const { setSelectedMajor } = useContext(MajorContext);

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
          value={searchQuery.name}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, name: e.target.value })
          }
          sx={{ mb: 2 }}
        />
      </form>

      <List disablePadding>
        {data
          .filter((major) =>
            major.name.toLowerCase().includes(searchQuery.name.toLowerCase())
          )
          .map((major) => (
            <ListItemButton
              key={major.id}
              onClick={() => setSelectedMajor(major)}
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
