// import { Button } from "@chakra-ui/react";
import { useContext } from "react";

import { Button, Grid, TextField, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";
import { Student } from "../types";
import { studentForm, studentSchema } from "../schemas/student";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  subjectId: number | null;
  onStudentAdded: (newStudent: Student) => void;
};

function Form({ subjectId, onStudentAdded }: Props) {
  const token = localStorage.getItem("Token");
  console.log("token_form ", token);
  const { selectedMajors } = useContext(MajorContext);
  const url = import.meta.env.VITE_API_URL + "/api/students/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<studentForm>({ resolver: zodResolver(studentSchema) });

  const onSubmit = async (data: studentForm) => {
    try {
      const response = await axios.post(
        url,
        {
          subjects: [subjectId],
          rut: data.rut,
          dv: data.dv,
          first_name: data.first_name,
          second_name: data.second_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          major: selectedMajors.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      onStudentAdded(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ my: 2 }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            label="Rut"
            fullWidth
            {...register("rut")}
            error={!!errors.rut}
            helperText={errors.rut?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <TextField
            label="DV"
            fullWidth
            inputProps={{ maxLength: 1 }}
            {...register("dv")}
            error={!!errors.dv}
            helperText={errors.dv?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Primer Nombre"
            fullWidth
            {...register("first_name")}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Segundo Nombre"
            fullWidth
            {...register("second_name")}
            error={!!errors.second_name}
            helperText={errors.second_name?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Apellido"
            fullWidth
            {...register("last_name")}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Segundo Apellido"
            fullWidth
            {...register("second_last_name")}
            error={!!errors.second_last_name}
            helperText={errors.second_last_name?.message}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 2 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              p: 1.5,
              bgcolor: "#3454D1",
              "&:hover": {
                bgcolor: "#2F4BC0",
              },
            }}
          >
            <FontAwesomeIcon icon={faUserPlus} />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Form;
