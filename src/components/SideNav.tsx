import { Heading, Link, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Major, MajorResponse } from "../types";

type Props = { onSelectMajors: (category: string) => void };

function SideNav({ onSelectMajors }: Props) {
  const majors = ["carrera1", "carrera2"];
  const url = "http://127.0.0.1:8000/categories";
  const [data, setData] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);

  // este useEffect lo dejo para cuando pueda realizar la consulta a la api

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    axios
      .get<MajorResponse>(url, { signal })
      .then(({ data }) => {
        setData(data);
        console.log("Datos recibidos en .then():", data);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  // despues seria remplazar data por carreras

  return (
    <>
      <Heading color="blue.400" fontSize={12} fontWeight="bold" mb={4}>
        CARRERAS
      </Heading>
      {loading ? <p>Cargando...</p> : null}
      <VStack align="stretch">
        {data.map((c) => (
          <Link
            px={2}
            py={1}
            borderRadius={5}
            key={c.name}
            _hover={{ textDecoration: "none" }}
            onClick={() => onSelectMajors(c.name)}
          >
            {c.name}
          </Link>
        ))}
      </VStack>
    </>
  );
}

export default SideNav;
