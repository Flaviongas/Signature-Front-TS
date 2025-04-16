import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  Button,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import MajorContext from "../contexts/MajorContext";
import { ShortSubject, Student, Subject } from "../types";
import SubjectContext from "../contexts/SubjectContext";
import RecipeModal from "./RecipeModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faPlus } from "@fortawesome/free-solid-svg-icons";
import RecipeModalMajor from "./RecipeModalMajor";
import useGetData from "../hooks/useGetData";

function SubjectsGrid() {
  const { selectedMajors } = useContext(MajorContext);
  const { setSubjectData } = useContext(SubjectContext);

  const apiUrl = import.meta.env.VITE_API_URL + "/api/subjects/";
  console.log("apiUrl subjectsgrid: ", apiUrl);

  const [shouldRefresh, setShouldRefresh] = useState(false);

  // Obtiene datos de materias desde la API
  const { loading, data } = useGetData<Subject>(apiUrl, shouldRefresh);

  const [currentShortSubject, setCurrentShortSubject] = useState<ShortSubject>({
    id: 0,
    name: "",
  });

  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isMajorRecipeModalOpen, setIsMajorRecipeModalOpen] = useState(false);

  const openRecipeModal = () => setIsRecipeModalOpen(true);
  const closeRecipeModal = () => setIsRecipeModalOpen(false);
  const openMajorRecipeModal = () => setIsMajorRecipeModalOpen(true);
  const closeMajorRecipeModal = () => setIsMajorRecipeModalOpen(false);

  const [modalStudents, setModalStudents] = useState<Student[]>([]);

  // Filtra materias según la carrera seleccionada
  const filteredSubjects = data.filter((subject) =>
    subject.major.includes(selectedMajors.id)
  );

  // Actualiza el contexto de materias cada vez que cambian los datos o la carrera
  useEffect(() => {
    setSubjectData(filteredSubjects);
  }, [selectedMajors, data, setSubjectData]);

  // Abre el modal con estudiantes de una materia específica
  const handleOpenRecipeModal = (
    students: Student[],
    subjectId: number,
    subjectName: string
  ) => {
    setModalStudents(students);
    setCurrentShortSubject({ id: subjectId, name: subjectName });
    openRecipeModal();
  };

  const handleOpenMajorRecipeModal = () => {
    openMajorRecipeModal();
  };

  const handleRefresh = () => {
    setShouldRefresh((prev) => !prev);
  };

  const refreshAndCloseMajorModal = () => {
    handleRefresh();
    closeMajorRecipeModal();
  };

  const cardStyles = {
    display: "flex",
    minHeight: 215,
    minWidth: 270,
    maxWidth: 400,
    boxShadow: 3,
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.03)",
    },
    cursor: "pointer",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
  };

  return selectedMajors && selectedMajors.name !== "" ? (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "40vh",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 2,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        {selectedMajors.name}
        <Box ml={2}>
          <IconButton onClick={handleRefresh} sx={{ fontSize: 30 }}>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </IconButton>
        </Box>
      </Typography>

      {filteredSubjects.length === 0 && !loading ? (
        <>
          <Typography variant="body1" fontWeight="bold" mb={2}>
            No hay materias disponibles para esta carrera.
          </Typography>
          <Box key="add">
            <Card sx={cardStyles}>
              <FontAwesomeIcon
                style={{
                  color: "black",
                  margin: "auto",
                  padding: "16px",
                  borderRadius: "4px",
                }}
                fontSize={50}
                icon={faPlus}
                onClick={handleOpenMajorRecipeModal}
              />
            </Card>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
        >
          {filteredSubjects.map((subject) => {
            const filteredStudents = subject.students.filter(
              (student) => student.major === selectedMajors.id
            );

            return (
              <Box key={subject.id} sx={{ margin: 2 }}>
                <Card sx={cardStyles}>
                  <Typography variant="h6" align="center" sx={{ my: "auto" }}>
                    {subject.name}
                  </Typography>
                  <Typography align="center" sx={{ mb: 4 }}>
                    Cantidad de Alumnos: {filteredStudents.length}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      width: "75%",
                      bgcolor: "#3454D1",
                      ":hover": {
                        bgcolor: "#2F4BC0",
                      },
                    }}
                    onClick={() =>
                      handleOpenRecipeModal(
                        filteredStudents,
                        subject.id,
                        subject.name
                      )
                    }
                  >
                    Asistencia
                  </Button>
                </Card>
              </Box>
            );
          })}

          <Box key="add" sx={{ margin: 2 }}>
            <Card sx={cardStyles}>
              <FontAwesomeIcon
                style={{
                  color: "black",
                  margin: "auto",
                  padding: "16px",
                  borderRadius: "4px",
                }}
                fontSize={50}
                icon={faPlus}
                onClick={handleOpenMajorRecipeModal}
              />
            </Card>
          </Box>
        </Box>
      )}

      <RecipeModal
        data={modalStudents}
        isOpen={isRecipeModalOpen}
        onClose={closeRecipeModal}
        shortSubject={currentShortSubject}
        refresh={handleRefresh}
      />
      <RecipeModalMajor
        isOpen={isMajorRecipeModalOpen}
        onClose={refreshAndCloseMajorModal}
      />
    </Box>
  ) : (
    <Box sx={{ p: 4 }} textAlign="center" mx="auto">
      <Typography variant="h4" fontWeight="bold">
        Seleccione una Carrera
      </Typography>
    </Box>
  );
}

export default SubjectsGrid;
