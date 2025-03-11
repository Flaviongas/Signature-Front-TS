import { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
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
  const url = import.meta.env.VITE_API_URL + "/api/subjects";
  const [refresh, setRefresh] = useState(false);
  const { loading, data } = useGetData<Subject>(url, refresh);
  const [shortSubject, setShortSubject] = useState<ShortSubject>({
    id: 0,
    name: "",
  });

  const {
    isOpen: isOpenFirst,
    onOpen: onOpenFirst,
    onClose: onCloseFirst,
  } = useDisclosure();

  const {
    isOpen: isOpenSecond,
    onOpen: onOpenSecond,
    onClose: onCloseSecond,
  } = useDisclosure();
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
    return <Text>Cargando...</Text>;
  }

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };
  const refreshAndClose = () => {
    handleRefresh();
    onCloseSecond();
  };

  return selectedMajors && selectedMajors.name !== "" ? (
    <div className="p-4 flex flex-col mb-2 text-center mx-auto h-40 ">
      <h1>Carrera: {selectedMajors.name}</h1>
      <div className="flex justify-end">
        <FontAwesomeIcon
          className="ml-5 text-3xl hover:text-stone-600"
          onClick={handleRefresh}
          icon={faArrowsRotate}
          cursor={"pointer"}
        />
      </div>
      {filteredSubjects.length === 0 && !loading ? (
        <>
          <Text fontSize="lg" fontWeight="bold" color="gray.600">
            No hay materias disponibles para esta carrera.
          </Text>
        </>
      ) : (
        <div className="flex flex-row flex-wrap justify-center">
          {filteredSubjects.map((Subject) => {
            const filteredStudents = Subject.students.filter(
              (student) => student.major === selectedMajors.id
            );

            return (
              <div key={Subject.id}>
                <Card
                  display={"flex"}
                  boxShadow="lg"
                  margin={5}
                  className="transition-transform duration-100 hover:scale-105 "
                >
                  <div className="flex flex-col">
                    <div className="flex h-1/2 w-full min-h-24 mx-auto">
                      <p className="text-center text-xl pt-3 w-72 m-auto">
                        {Subject.name}
                      </p>
                    </div>
                    <p className="text-center text-gray-500">
                      Cantidad de Alumnos: {filteredStudents.length}
                    </p>
                    <CardFooter className="flex h-1/2">
                      <Button
                        colorScheme="blue"
                        w="full"
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
                    </CardFooter>
                  </div>
                </Card>
              </div>
            );
          })}

          <div key="add">
            <Card
              display={"flex"}
              backgroundColor={"gray.100"}
              margin={5}
              minHeight={215}
              minWidth={270}
              className="transition-transform duration-100 hover:scale-105"
              cursor={"pointer"}
            >
              <FontAwesomeIcon
                className="text-black my-auto p-2 rounded-4"
                fontSize={50}
                icon={faPlus}
                onClick={handleOpenModalMajor}
              />
            </Card>
          </div>

        </div>
      )}

      <RecipeModal
        data={modalStudents}
        isOpen={isOpenFirst}
        onClose={onCloseFirst}
        shortSubject={shortSubject}
        refresh={handleRefresh}
      />
      <RecipeModalMajor isOpen={isOpenSecond} onClose={refreshAndClose} />
    </div>
  ) : (
    <div className="p-4 text-center mx-auto ">
      <Text fontSize="50" fontWeight="bold" color="gray.600">
        Seleccione una Carrera
      </Text>
    </div>
  );
}

export default SubjectsGrid;
