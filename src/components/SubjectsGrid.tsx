import { useContext, useEffect, useState } from "react";

import { Box, Typography, IconButton, Card, Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import MajorContext from "../contexts/MajorContext";
import { ShortSubject, Student, Subject } from "../types";

import SubjectContext from "../contexts/SubjectContext";
import RecipeModal from "./RecipeModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faPlus } from "@fortawesome/free-solid-svg-icons";
import RecipeModalMajor from "./RecipeModalMajor";
import useGetData from "../hooks/useGetData";

// type Props = {};

function SubjectsGrid() {
  const { selectedMajors } = useContext(MajorContext);
  const { setSubjectData } = useContext(SubjectContext);
  const url = import.meta.env.VITE_API_URL + "/api/subjects/";
  console.log("url subjectsgrid: ", url);
  const [refresh, setRefresh] = useState(false);
  const { loading, data } = useGetData<Subject>(url, refresh);
  const [shortSubject, setShortSubject] = useState<ShortSubject>({
    id: 0,
    name: "",
  });

  const [isOpenFirst, setIsOpenFirst] = useState(false);
  const [isOpenSecond, setIsOpenSecond] = useState(false);

  const onOpenFirst = () => setIsOpenFirst(true);
  const onCloseFirst = () => setIsOpenFirst(false);

  const onOpenSecond = () => setIsOpenSecond(true);
  const onCloseSecond = () => setIsOpenSecond(false);

  const [modalStudents, setModalStudents] = useState<Student[]>([]);

  const filteredSubjects = data.filter((e) =>
    e.major.includes(selectedMajors.id)
  );

  useEffect(() => {
    const filteredSubjects = data.filter((e) =>
      e.major.includes(selectedMajors.id)
    );
    setSubjectData(filteredSubjects);
  }, [selectedMajors, data, setSubjectData]);

  const handleOpenModal = (
    students: Student[],
    subjectId: number,
    name: string
  ) => {
    setModalStudents(students);
    setShortSubject({ id: subjectId, name: name });
    onOpenFirst();
  };

  const handleOpenModalMajor = () => {
    onOpenSecond();
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };
  const refreshAndClose = () => {
    handleRefresh();
    onCloseSecond();
  };

  const cardStyles = {
    display: "flex",
    minHeight: 215,
    minWidth: 270,
    maxWidth: 270,
    boxShadow: 3,
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.03)",
    },
    cursor: "pointer",
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
          <IconButton
            onClick={handleRefresh}
            sx={{
              fontSize: 30,
            }}
          >
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
                onClick={handleOpenModalMajor}
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
          {filteredSubjects.map((Subject) => {
            const filteredStudents = Subject.students.filter(
              (student) => student.major === selectedMajors.id
            );

            return (
              <Box key={Subject.id} sx={{ margin: 2 }}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: 3,
                    minHeight: 215,
                    minWidth: 270,
                    maxWidth: 400,
                    p: 2,
                  }}
                >
                  <Typography variant="h6" align="center" sx={{ my: "auto" }}>
                    {Subject.name}
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
                      handleOpenModal(
                        filteredStudents,
                        Subject.id,
                        Subject.name
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
                onClick={handleOpenModalMajor}
              />
            </Card>
          </Box>
        </Box>
      )}

      <RecipeModal
        data={modalStudents}
        isOpen={isOpenFirst}
        onClose={onCloseFirst}
        shortSubject={shortSubject}
        refresh={handleRefresh}
      />
      <RecipeModalMajor isOpen={isOpenSecond} onClose={refreshAndClose} />
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
