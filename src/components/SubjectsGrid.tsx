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

type Props = {};

function SubjectsGrid({}: Props) {
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
  return (
    <>
      <h1>Carrera: {selectedMajors.name}</h1>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20} p={4}>
        {filteredSubjects.length === 0 ? (
          <Text fontSize="lg" fontWeight="bold" color="gray.600">
            No hay materias disponibles para esta carrera.
          </Text>
        ) : (
          filteredSubjects.map((e) => {
            const filteredStudents = e.students.filter(
              (student) => student.major === selectedMajors.id
            );

            return (
              <Card key={e.id} boxShadow="md" borderRadius="lg" p={4}>
                <CardHeader>
                  <Heading size="md">{e.name}</Heading>
                </CardHeader>
                <CardBody>
                  <Text color="gray.500">
                    Cantidad de Alumnos {filteredStudents.length}
                  </Text>
                </CardBody>
                <CardFooter>
                  <Button
                    colorScheme="blue"
                    w="full"
                    onClick={() => handleOpenModal(filteredStudents)}
                  >
                    Asistencia
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </SimpleGrid>

      <RecipeModal data={modalStudents} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default SubjectsGrid;
