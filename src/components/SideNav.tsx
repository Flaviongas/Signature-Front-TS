import { Heading, Link, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = { onSelectCarrera: (category: string) => void };

function SideNav({ onSelectCarrera }: Props) {
  const carreras = ["carrera1", "carrera2"];
  const url = "http://dominio/api/majors/";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // este useEffect lo dejo para cuando pueda realizar la consulta a la api
  /*
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    axios
      .get(url, { signal })
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  */

  // despues seria remplazar data por carreras

  return (
    <>
      <Heading color="blue.400" fontSize={12} fontWeight="bold" mb={4}>
        CARRERAS
      </Heading>
      <VStack align="stretch">
        {carreras.map((c, index) => (
          <Link
            px={2}
            py={1}
            borderRadius={5}
            key={index}
            _hover={{ textDecoration: "none" }}
            onClick={() => onSelectCarrera(c)}
          >
            {c}
          </Link>
        ))}
      </VStack>
    </>
  );
}

export default SideNav;
