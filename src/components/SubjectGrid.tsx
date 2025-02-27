import {
  Box,
  Text,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MajorShort, Subject, SubjectList } from "../types";

type Props = {
  majors: MajorShort;
  cambiarVista: () => void;
};

function SubjectGrid({ majors, cambiarVista }: Props) {
  const url = "https://signature.gidua.xyz/api/subjects/";
  const [data, setData] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const filteredSubjects = data.filter((e) => e.major.includes(majors.id));

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    axios
      .get<SubjectList>(url, { signal })
      .then(({ data }) => {
        setData(data);
        console.log("Datos recibidos en .then():", data);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  return (
    <SimpleGrid columns={2} spacing={10}>
      {filteredSubjects.length === 0 ? (
        <Text>No hay materias disponibles para esta carrera.</Text>
      ) : (
        filteredSubjects.map((e) => (
          <Box key={e.id}>
            <SimpleGrid columns={2} spacing={10}>
              <Card boxShadow="lg">
                <CardHeader>
                  <Heading size="md">{e.name}</Heading>
                </CardHeader>
                <CardBody>
                  <Text></Text>
                </CardBody>
                <CardFooter>
                  <Button colorScheme="blue" onClick={cambiarVista}>
                    Asistencia
                  </Button>
                </CardFooter>
              </Card>
            </SimpleGrid>
          </Box>
        ))
      )}
    </SimpleGrid>
  );
}

export default SubjectGrid;
