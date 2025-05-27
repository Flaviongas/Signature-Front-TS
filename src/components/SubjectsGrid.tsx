import { useContext, useState } from "react";
import { Box, Typography, Card, Button, Container } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import MajorContext from "../contexts/MajorContext";
import { ShortSubject, Student, Subject } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useGetData from "../hooks/useGetData";

import { useNavigate } from "react-router-dom";
import AttendanceModal from "./AttendanceModal";
import AddMajorModal from "./AddMajorModal";

import useIsSuperUser from "../hooks/useIsSuperUser";

import theme from "../theme";

function SubjectsGrid() {
  const { selectedMajor } = useContext(MajorContext);
  const navigate = useNavigate();
  const isSuperUser = useIsSuperUser();

  const apiUrl = import.meta.env.VITE_API_URL + "/api/subjects/";

  const [shouldRefresh, setShouldRefresh] = useState(false);

  // Obtiene datos de materias desde la API
  const { loading, data } = useGetData<Subject>(apiUrl, shouldRefresh);

  const [currentShortSubject, setCurrentShortSubject] = useState<ShortSubject>({
    id: 0,
    name: "",
  });

  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);

  const openModal = () => setIsAssistanceModalOpen(true);
  const closeModal = () => setIsAssistanceModalOpen(false);
  const openMajorModal = () => setIsMajorModalOpen(true);
  const closeMajorModal = () => setIsMajorModalOpen(false);

  const [modalStudents, setModalStudents] = useState<Student[]>([]);

  // Filtra materias según la carrera seleccionada
  const filteredSubjects = data.filter((subject) =>
    subject.major.includes(selectedMajor.id)
  );

  // Abre el modal con estudiantes de una materia específica
  const handleOpenModal = (
    students: Student[],
    subjectId: number,
    subjectName: string
  ) => {
    setModalStudents(students);
    setCurrentShortSubject({ id: subjectId, name: subjectName });
    openModal();
  };

  const handleOpenMajorModal = () => {
    openMajorModal();
  };

  const handleRefresh = () => {
    setShouldRefresh((prev) => !prev);
  };

  const refreshAndCloseMajorModal = () => {
    handleRefresh();
    closeMajorModal();
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
          ></Box>
        </Typography>

        {filteredSubjects.length === 0 && !loading ? (
          <>
            <Typography variant="body1" fontWeight="bold" mb={2}>
              No hay materias disponibles para esta carrera.
            </Typography>
            <Box key="add">
              <Card sx={{ ...cardStyles, cursor: "pointer" }} onClick={handleOpenMajorModal}>
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
                  <Card
                    sx={{
                      ...cardStyles,
                      position: "relative",
                      cursor: "default",

                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "7px",
                        width: "0%",
                        bgcolor: theme.palette.info.main,
                        transition: "width 0.4s ease",
                      },
                      "&:hover::before": {
                        width: "100%",
                      },
                    }}
                  >
                    {isSuperUser && (
                      <CloseIcon
                        color="error"
                        sx={{
                          stroke: "currentColor",
                          strokeWidth: 2,
                          position: "absolute",
                          top: 10,
                          right: 10,
                        }}
                        onClick={() =>
                          handleDeleteSubject(subject.id, subject.name)
                        }
                      />
                    )}

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
                      color="secondary"
                      fullWidth
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        width: '100%',
                      }}
                      onClick={() =>
                        handleOpenModal(
                          filteredStudents,
                          subject.id,
                          subject.name
                        )
                      }
                    >
                      Asistencia
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        width: '100%',
                        fontWeight: "bold",
                      }}
                      onClick={() => navigate("/students", {
                        state: {
                          majorId: selectedMajor.id,
                          subjectId: subject.id,
                          majorName: selectedMajor.name,
                          subjectName: subject.name
                        }
                      })}
                    >
                      Gestionar asignatura
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
              {isSuperUser && (
                <Card sx={cardStyles} onClick={handleOpenMajorModal}>
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
              )}
            </Box>
          </Box>
        )}

        <AttendanceModal
          data={modalStudents}
          isOpen={isAssistanceModalOpen}
          onClose={closeModal}
          shortSubject={currentShortSubject}
        />
        <AddMajorModal
          isOpen={isMajorModalOpen}
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
      }}
    >
      {isSuperUser && (
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-between" },
            flexDirection: { xs: "column", md: "row" },
            alignSelf: { xs: "center" },
            gap: 2,
            width: '100%'
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{
              minWidth: "150px",
              px: 5,
              fontWeight: "bold",
            }}
            onClick={() => navigate("/students-management")}
          >
            Gestionar estudiantes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              minWidth: "150px",
              px: 5,
              fontWeight: "bold",
            }}
            onClick={() => navigate("/users")}
          >
            Gestionar usuarios
          </Button>


        </Box>

      )}
      {content}
    </Container>
  );
}

export default SubjectsGrid;
