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

// type Props = {};

function SideNav() {
  const url = import.meta.env.VITE_API_URL + "/api/majors/getMajors/";

  const { data, loading } = useGetData<MajorShort>(url);
  const [search, setSearch] = useState<MajorShort>({ id: 0, name: "" });
  const { setSelectedMajors } = useContext(MajorContext);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(search);
  };

  return loading ? (
    <Box p={2}>
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={40} sx={{ mb: 2 }} />
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
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          sx={{ mb: 2 }}
        />
      </form>

      <List disablePadding>
        {data
          .filter((c) =>
            c.name.toLowerCase().includes(search.name.toLowerCase())
          )
          .map((c) => (
            <ListItemButton
              key={c.id}
              onClick={() => setSelectedMajors(c)}
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
                primary={<Typography textAlign="center">{c.name}</Typography>}
              />
            </ListItemButton>
          ))}
      </List>
    </Paper>
  );
}

export default SideNav;
