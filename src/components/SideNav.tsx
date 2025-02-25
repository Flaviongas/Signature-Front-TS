import { Heading, Link, SkeletonText, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Major, MajorResponse } from "../types";

type Props = { onSelectMajors: (category: string) => void };

function SideNav({ onSelectMajors }: Props) {
  const url = "http://127.0.0.1:8000/categories";
  const [data, setData] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);

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

  return loading ? (
    <SkeletonText mt="1" noOfLines={8} spacing="6" skeletonHeight="2" />
  ) : (
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
