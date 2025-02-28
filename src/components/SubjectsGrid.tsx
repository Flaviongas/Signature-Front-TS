import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import MajorContext from "../contexts/MajorContext";
import { MajorShort, MajorShortResponse, Subject, SubjectList } from "../types";
import axios from "axios";
import SubjectContext from "../contexts/SubjectContext";
type Props = {};

function SubjectsGrid({}: Props) {
  const { selectedMajors } = useContext(MajorContext);
  const { setSubjectData } = useContext(SubjectContext);
  const url = "https://signature.gidua.xyz/api/subjects/";
  const [data, setData] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const filteredSubjects = data.filter((e) =>
    e.major.includes(selectedMajors.id)
  );

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

  return (
    <>
      <h1>Carrera: {selectedMajors.name}</h1>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20} p={4}>
        {filteredSubjects.length === 0 ? (
          <Text fontSize="lg" fontWeight="bold" color="gray.600">
            No hay materias disponibles para esta carrera.
          </Text>
        ) : (
          filteredSubjects.map((e) => (
            <Card key={e.id} boxShadow="md" borderRadius="lg" p={4}>
              <CardHeader>
                <Heading size="md">{e.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text color="gray.500">
                  Cantidad de Alumnos {e.students.length}
                </Text>
              </CardBody>
              <CardFooter>
                <Button colorScheme="blue" w="full">
                  Asistencia
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </SimpleGrid>
    </>
  );
}

export default SubjectsGrid;
