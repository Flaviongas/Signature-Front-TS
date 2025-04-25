import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  Button,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import MajorContext from "../contexts/MajorContext";
import { ShortSubject, Student, Subject } from "../types";
import SubjectContext from "../contexts/SubjectContext";
import RecipeModal from "./RecipeModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faPlus } from "@fortawesome/free-solid-svg-icons";
import RecipeModalMajor from "./RecipeModalMajor";
import useGetData from "../hooks/useGetData";

import { useNavigate } from "react-router-dom";

function SubjectsGrid() {
  const { selectedMajor } = useContext(MajorContext);
  const { setSubjectData } = useContext(SubjectContext);

  const apiUrl = import.meta.env.VITE_API_URL + "/api/subjects/";

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
    subject.major.includes(selectedMajor.id)
  );

  const navigate = useNavigate();

  // Actualiza el contexto de materias cada vez que cambian los datos o la carrera
  useEffect(() => {
    setSubjectData(filteredSubjects);
  }, [selectedMajor, data, setSubjectData]);

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
  // Elimina la asignatura del card
  const handleDeleteSubject = async (id: number, name: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la asignatura ${name}?`
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("Token");
    try {
      const url = import.meta.env.VITE_API_URL + "/api/subjects";
      await axios.delete(`${url}/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      handleRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const cardStyles = {
    display: "flex",
    minHeight: 215,
    width: 270,
    boxShadow: 3,
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.02)",
    },
    cursor: "pointer",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
  };

  const content =
    selectedMajor && selectedMajor.name !== "" ? (
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            mb: 3,
            fontWeight: "bold",
            display: "flex",
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            alignItems: "center",
          }}
        >
          {selectedMajor.name}
          <Box
            sx={{
              ml: { xs: 0, md: 2 },
            }}
          >
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
              <Card sx={cardStyles} onClick={handleOpenMajorRecipeModal}>
                <FontAwesomeIcon
                  style={{
                    color: "black",
                    margin: "auto",
                    padding: "16px",
                    borderRadius: "4px",
                  }}
                  fontSize={50}
                  icon={faPlus}
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
                (student) => student.major === selectedMajor.id
              );

              return (
                <Box
                  key={subject.id}
                  sx={{
                    m: 2,
                  }}
                >
                  <Card sx={{ ...cardStyles, position: "relative" }}>
                    <IconButton
                      onClick={() =>
                        handleDeleteSubject(subject.id, subject.name)
                      }
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                      }}
                    >
                      <CloseIcon
                        fontSize="small"
                        color="error"
                        sx={{
                          stroke: "currentColor",
                          strokeWidth: 1.5,
                          fontSize: 25,
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        my: "auto",
                        overflow: "hidden",
                        maxWidth: "98%",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
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

            <Box
              key="add"
              sx={{
                m: 2,
              }}
            >
              <Card sx={cardStyles} onClick={handleOpenMajorRecipeModal}>
                <FontAwesomeIcon
                  style={{
                    margin: "auto",
                    padding: "16px",
                    borderRadius: "4px",
                  }}
                  fontSize={50}
                  icon={faPlus}
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

  return (
    <Container
      sx={{
        position: "relative",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: {
          xs: "center",
        },
      }}
    >
      <Box
        sx={{
          alignSelf: { xs: "center", md: "flex-end" },
        }}
      >
        <Button
          variant="contained"
          sx={{
            minWidth: "150px",
            px: 5,
            bgcolor: "#3454D1",
            "&:hover": {
              bgcolor: "#2F4BC0",
            },
          }}
          onClick={() => navigate("/users")}
        >
          Gestionar Usuarios
        </Button>
      </Box>
      {content}
    </Container>
  );
}

export default SubjectsGrid;
