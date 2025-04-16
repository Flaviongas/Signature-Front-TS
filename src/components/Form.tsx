// import { Button } from "@chakra-ui/react";
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
  console.log("auth_token ", authToken);
  const { selectedMajor } = useContext(MajorContext);
  const apiUrl = import.meta.env.VITE_API_URL + "/api/students/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<studentFormSchema>({ resolver: zodResolver(studentValidationSchema) });

  const handleStudentSubmission = async (formData: studentFormSchema) => {
    try {
      const response = await axios.post(
        apiUrl,
        {
          subjects: [subjectId],
          rut: formData.rut,
          checkDigit: formData.dv,
          firstName: formData.first_name,
          secondName: formData.second_name,
          lastName: formData.last_name,
          secondLastName: formData.second_last_name,
          majorId: selectedMajor.id,
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
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Rut"
            fullWidth
            {...register("rut")}
            error={!!errors.rut}
            helperText={errors.rut?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <TextField
            label="checkDigit"
            fullWidth
            inputProps={{ maxLength: 1 }}
            {...register("checkDigit")}
            error={!!errors.checkDigit}
            helperText={errors.checkDigit?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Primer Nombre"
            fullWidth
            {...register("first_name")}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Segundo Nombre"
            fullWidth
            {...register("second_name")}
            error={!!errors.second_name}
            helperText={errors.second_name?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Apellido"
            fullWidth
            {...register("last_name")}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Segundo Apellido"
            fullWidth
            {...register("second_last_name")}
            error={!!errors.second_last_name}
            helperText={errors.second_last_name?.message}
          />
        </Grid>

        <Grid item xs={12} md={2} sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-start" },
          }}>
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

export default StudentForm;
