import { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import MajorContext from "../contexts/MajorContext";
import { Student, Subject, SubjectList } from "../types";
import axios from "axios";
import SubjectContext from "../contexts/SubjectContext";
import RecipeModal from "./RecipeModal";

// type Props = {};

function SubjectsGrid() {
  const { selectedMajors } = useContext(MajorContext);
  const { setSubjectData } = useContext(SubjectContext);
  const url = "https://signature.gidua.xyz/api/subjects/";
  const [data, setData] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  }, []);
  const handleOpenModal = (students: Student[]) => {
    setModalStudents(students);
    onOpen();
  };
  if (loading) {
    return <Text>Cargando...</Text>;
  }
  return (
    <div className="p-4 text-center mx-auto ">
      <h1>{selectedMajors.name !== "" ? `Carrera: ${selectedMajors.name}` : "Seleccione una carrera"}</h1>
      {filteredSubjects.length === 0 && !loading ? (
        <Text fontSize="lg" fontWeight="bold" color="gray.600">
          No hay materias disponibles para esta carrera.
        </Text>
      ) : (
        <div className="flex flex-row flex-wrap justify-center" >
          {filteredSubjects.map((Subject) => {
            const filteredStudents = Subject.students.filter(
              (student) => student.major === selectedMajors.id
            );

            return (
              <Card boxShadow="lg" minWidth={250} key={Subject.id} margin={5} className="transition-transform duration-100 hover:scale-105 ">
                <div className="flex flex-col">
                  <div className="flex h-1/2 w-full min-h-24 mx-auto">
                    <p className="text-center text-xl pt-3 w-72 m-auto">{Subject.name}</p>
                  </div>
                  <p className="text-center text-gray-500">
                    Cantidad de Alumnos:  {filteredStudents.length}
                  </p>

                  <CardFooter className="flex h-1/2">

                    <Button
                      colorScheme="blue"
                      w="full"
                      onClick={() => handleOpenModal(filteredStudents)}
                    >
                      Asistencia
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <RecipeModal data={modalStudents} isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

export default SubjectsGrid;
