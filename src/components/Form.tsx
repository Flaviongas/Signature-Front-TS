import { useContext } from "react";

import { Button, Grid, TextField, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";
import { Student } from "../types";
import { studentFormSchema, studentValidationSchema } from "../schemas/student";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  subjectId: number | null;
  onStudentAdded: (newStudent: Student) => void;
};

function StudentForm({ subjectId, onStudentAdded }: Props) {
  const authToken = localStorage.getItem("Token");
  const { selectedMajor } = useContext(MajorContext);
  const apiUrl = import.meta.env.VITE_API_URL + "/api/students/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<studentFormSchema>({
    resolver: zodResolver(studentValidationSchema),
  });

  const handleStudentSubmission = async (formData: studentFormSchema) => {
    try {
      const response = await axios.post(
        apiUrl,
        {
          subjects: [subjectId],
          rut: formData.rut,
          dv: formData.dv,
          first_name: formData.first_name,
          second_name: formData.second_name,
          last_name: formData.last_name,
          second_last_name: formData.second_last_name,
          major: selectedMajor.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      onStudentAdded(response.data);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleStudentSubmission)}
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="info"
            sx={{
              width: { xs: "50%", sm: "25%", md: "100%" },
              p: 2.6,
              mb: 3,
            }}
          >
            <FontAwesomeIcon icon={faUserPlus} />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentForm;
