import { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import MajorContext from "../contexts/MajorContext";
import { ShortSubject, Student, Subject, SubjectList } from "../types";
import axios from "axios";
import SubjectContext from "../contexts/SubjectContext";
import RecipeModal from "./RecipeModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faPlus } from "@fortawesome/free-solid-svg-icons";
import RecipeModalMajor from "./RecipeModalMajor";

// type Props = {};

function SubjectsGrid() {
  const { selectedMajors, setSelectedMajors } = useContext(MajorContext);
  const { setSubjectData } = useContext(SubjectContext);
  const url = "https://signature.gidua.xyz/api/subjects/";
  const [data, setData] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [shortSubject, setShortSubject] = useState<ShortSubject>({
    id: 0,
    name: "",
  });

  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    axios
      .get<SubjectList>(url, { signal })
      .then(({ data }) => {
        setData(data);
        setSubjectData(data);
        console.log("Datos recibidos en .then():", data);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [refresh]);
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

  return selectedMajors && selectedMajors.name !== "" ? (
    <div className="p-4 text-center mx-auto ">
      <h1>Carrera: {selectedMajors.name}</h1>
      <div className="flex justify-end">
        <FontAwesomeIcon
          className="bg-yellow-300 text-black p-2 rounded-4 hover:bg-yellow-200 hover:text-white"
          fontSize={20}
          icon={faPlus}
          onClick={handleOpenModalMajor}
        />
        <FontAwesomeIcon
          className="ml-5 text-3xl hover:text-stone-600"
          onClick={handleRefresh}
          icon={faArrowsRotate}
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
                  boxShadow="lg"
                  minWidth={250}
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
        </div>
      )}

      <RecipeModal
        data={modalStudents}
        isOpen={isOpenFirst}
        onClose={onCloseFirst}
        shortSubject={shortSubject}
      />
      <RecipeModalMajor isOpen={isOpenSecond} onClose={onCloseSecond} />
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
