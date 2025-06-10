import { useContext, useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MajorContext from "../contexts/MajorContext";
import { ShortSubject, Student, Subject } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import AttendanceModal from "./AttendanceModal";
import AddMajorModal from "./AddMajorModal";
import useIsSuperUser from "../hooks/useIsSuperUser";
import theme from "../theme";
import { getSubjectsByMajor } from "../services/subjectService";
import { removeStudentSubject } from "../services/studentService";
import ConfirmModal from "./helpers/ConfirmModal";
import buttonClickEffect from "../styles/buttonClickEffect";
// Helper para localStorage
const getLocalStorageKey = (majorId: number) => `displayed_subjects_${majorId}`;

function SubjectsGrid() {
  const { selectedMajor } = useContext(MajorContext);
  const navigate = useNavigate();
  const isSuperUser = useIsSuperUser();

  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [isAddSubjectDisplayModalOpen, setIsAddSubjectDisplayModalOpen] =
    useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [subjectToRemove, setSubjectToRemove] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Estado para todas las materias asociadas a la carrera (según el backend)
  const [backendAssociatedSubjects, setBackendAssociatedSubjects] = useState<
    Subject[]
  >([]);
  // Estado para los IDs de las materias que el usuario ha elegido mostrar en la UI
  const [displayedSubjectIds, setDisplayedSubjectIds] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentShortSubject, setCurrentShortSubject] = useState<ShortSubject>({
    id: 0,
    name: "",
  });

    useState(false);

  const openModal = () => setIsAssistanceModalOpen(true);
  const closeModal = () => setIsAssistanceModalOpen(false);
  const openAddSubjectDisplayModal = () =>
    setIsAddSubjectDisplayModalOpen(true);
  const closeAddSubjectDisplayModal = () =>
    setIsAddSubjectDisplayModalOpen(false);

  const [modalStudents, setModalStudents] = useState<Student[]>([]);

  // Lógica de carga y persistencia en localStorage
  useEffect(() => {
    const loadSubjectsAndDisplayState = async () => {
      if (!selectedMajor.id) {
        setBackendAssociatedSubjects([]);
        setDisplayedSubjectIds(new Set());
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Obtener todas las materias asociadas a esta carrera desde el backend
        const response = await getSubjectsByMajor({
          major_id: selectedMajor.id,
        });
        const fetchedSubjects = response.data;
        setBackendAssociatedSubjects(fetchedSubjects);

        // 2. Cargar el estado de visualización desde localStorage
        const storedIdsJson = localStorage.getItem(
          getLocalStorageKey(selectedMajor.id)
        );
        let storedIds: number[] = [];
        try {
          if (storedIdsJson) {
            storedIds = JSON.parse(storedIdsJson);
            if (!Array.isArray(storedIds)) {
              storedIds = [];
            }
          }
        } catch (e) {
          console.error(
            "Error al parsear IDs de materias guardados de localStorage:",
            e
          );
          storedIds = [];
        }

        // 3. Lógica para inicializar `displayedSubjectIds`
        let newDisplayedIds = new Set(storedIds);
        const allFetchedIds = new Set(
          fetchedSubjects.map((s: Subject) => s.id)
        );
        newDisplayedIds = new Set(
          Array.from(newDisplayedIds).filter((id) => allFetchedIds.has(id))
        );

        setDisplayedSubjectIds(newDisplayedIds);
        localStorage.setItem(
          getLocalStorageKey(selectedMajor.id),
          JSON.stringify(Array.from(newDisplayedIds))
        );
      } catch (err: any) {
        console.error(
          "Error al cargar asignaturas asociadas y su estado de visualización:",
          err
        );
        setError(
          "Error al cargar las materias. Por favor, inténtalo de nuevo."
        );
        setBackendAssociatedSubjects([]);
        setDisplayedSubjectIds(new Set());
      } finally {
        setLoading(false);
      }
    };

    loadSubjectsAndDisplayState();
  }, [selectedMajor.id]);

  // Función para agregar un ID de materia a la lista de "mostradas"
  const addSubjectToDisplay = useCallback(
    (subjectId: number) => {
      setDisplayedSubjectIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(subjectId);
        localStorage.setItem(
          getLocalStorageKey(selectedMajor.id),
          JSON.stringify(Array.from(newSet))
        );
        return newSet;
      });
    },
    [selectedMajor.id]
  );

  // Función para remover un ID de materia de la lista de "mostradas" (solo visual y con desenrollado de estudiantes)
  const removeSubjectFromDisplay = useCallback(
    async (subjectId: number, subjectName: string) => {
      setSubjectToRemove({ id: subjectId, name: subjectName });
      setIsConfirmModalOpen(true);
    },
    []
  );

  const confirmRemoveSubject = async () => {
    if (!subjectToRemove) return;

    const { id: subjectId} = subjectToRemove;

    // Buscar la materia completa para obtener sus estudiantes
    const subjectToHide = backendAssociatedSubjects.find(
      (s) => s.id === subjectId
    );

    if (!subjectToHide) {
      alert(
        "Error: No se encontró la asignatura para desenrolar estudiantes."
      );
      return;
    }

    const studentsToUnenroll = subjectToHide.students?.map((s) => s.id) || [];

    try {
      // 1. Llamar al backend para desenrolar a los estudiantes
      if (studentsToUnenroll.length > 0) {
        await removeStudentSubject({
          subject_id: subjectId,
          student_ids: studentsToUnenroll,
        });

      }

      setDisplayedSubjectIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subjectId);
        localStorage.setItem(
          getLocalStorageKey(selectedMajor.id),
          JSON.stringify(Array.from(newSet))
        );
        return newSet;
      });
    } catch (err: any) {
      console.error(
        "Error al borrar asignatura o desenrolar estudiantes:",
        err
      );
      // Manejar el error y mostrar un mensaje al usuario
      alert(
        `Error al realizar la operación: ${
          err.response?.data?.detail || err.message
        }. Por favor, inténtalo de nuevo.`
      );
    } finally {
      setSubjectToRemove(null);
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSubjectToRemove(null);
  };

  const handleOpenModal = (
    students: Student[],
    subjectId: number,
    subjectName: string
  ) => {
    setModalStudents(students);
    setCurrentShortSubject({ id: subjectId, name: subjectName });
    openModal();
  };

  const handleOpenAddSubjectDisplayModal = () => {
    openAddSubjectDisplayModal();
  };

  const refreshAndCloseAddSubjectDisplayModal = () => {
    closeAddSubjectDisplayModal();
  };

  const subjectsToDisplay = backendAssociatedSubjects.filter((subject) =>
    displayedSubjectIds.has(subject.id)
  );

  const cardStyles = {
    display: "flex",
    minHeight: 215,
    width: 270,
    boxShadow: 3,
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress color="secondary" />
            <Typography ml={2}>Cargando materias...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" align="center" variant="h6">
            {error}
          </Typography>
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
          >
            {subjectsToDisplay.length === 0 && (
              <Typography
                variant="body1"
                fontWeight="bold"
                mb={2}
                sx={{ width: "100%", textAlign: "center" }}
              >
                No hay materias visibles para esta carrera
              </Typography>
            )}

            {subjectsToDisplay.map((subject) => {
              const studentsForSubject =
                subject.students?.filter((student) => {
                  return student.major === selectedMajor.id;
                }) || [];

              return (
                <Box
                  key={subject.id}
                  sx={{
                    m: 2,
                    display: "flex",
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
                          cursor: "pointer",
                          strokeWidth: 2,
                          position: "absolute",
                          top: 8,
                          right: 3,
                        }}
                        onClick={() =>
                          removeSubjectFromDisplay(subject.id, subject.name)
                        }
                      />
                    )}

                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        overflow: "hidden",
                        maxWidth: "98%",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: "2.8em", // Asegura un espacio mínimo para 2 líneas (aprox. 1.4em por línea)
                        lineHeight: "1.4em", // Mantiene la altura de línea consistente
                        flexGrow: 1, // Permite que ocupe el espacio disponible
                        display: "flex", // Necesario para centrar verticalmente con alignItems
                        alignItems: "center", // Centra el texto verticalmente dentro de su minHeight
                        justifyContent: "center", // Centra el texto horizontalmente
                      }}
                    >
                      {subject.name}
                    </Typography>
                    <Typography align="center" sx={{ mb: 4 }}>
                      Cantidad de Alumnos: {studentsForSubject.length}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        width: "100%",
                      }}
                      onClick={() =>
                        handleOpenModal(
                          studentsForSubject, // Pasamos los estudiantes ya filtrados
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
                        width: "100%",
                        ...buttonClickEffect,
                      }}
                      onClick={() =>
                        navigate("/students", {
                          state: {
                            majorId: selectedMajor.id,
                            subjectId: subject.id,
                            majorName: selectedMajor.name,
                            subjectName: subject.name,
                          },
                        })
                      }
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
                <Card
                  sx={{
                    ...cardStyles,
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={handleOpenAddSubjectDisplayModal}
                >
                  <Box
                    sx={{
                      minHeight: "2.8em",
                      lineHeight: "1.4em",
                      flexGrow: 1,
                    }}
                  />
                  <Box sx={{ height: "1.5em", mb: 4 }} />
                  <Box sx={{ height: "40px", mb: 1 }} />
                  <Box sx={{ height: "40px" }} />

                  <FontAwesomeIcon
                    style={{
                      position: "absolute", // Posicionar absolutamente para que los espaciadores manejen el flujo
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 50,
                      color: "black",
                      padding: "16px",
                      borderRadius: "4px",
                    }}
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
          isOpen={isAddSubjectDisplayModalOpen}
          onClose={refreshAndCloseAddSubjectDisplayModal}
          majorId={selectedMajor.id}
          majorName={selectedMajor.name}
          // Pasamos la lista completa de materias asociadas a esta carrera (desde backend)
          backendAssociatedSubjects={backendAssociatedSubjects.map(
            (subject) => ({
              subject_id: subject.id,
              name: subject.name,
              student_ids: subject.students?.map((student) => student.id) || [],
            })
          )}
          // Pasamos el Set de IDs de materias actualmente visibles
          currentlyDisplayedSubjectIds={displayedSubjectIds}
          // Pasamos la función callback para añadir una materia a la lista de "mostradas"
          onAddSubjectToDisplay={addSubjectToDisplay}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmModal}
          onConfirm={confirmRemoveSubject}
          title="Borrar Asignatura"
          message={
            subjectToRemove
              ? `¿Estás seguro de que deseas borrar la asignatura "${subjectToRemove.name}"? Esto también desenrolará a todos los estudiantes asociados a ella.`
              : ""
          }
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
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{
              minWidth: "150px",
              px: 5,
              ...buttonClickEffect,
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
              ...buttonClickEffect,
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
