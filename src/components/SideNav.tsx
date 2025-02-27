import { Heading, Input, Link, SkeletonText, VStack } from "@chakra-ui/react";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Major, MajorResponse, MajorShort, MajorShortResponse } from "../types";

type Props = { onSelectMajors: (category: MajorShort) => void };

function SideNav({ onSelectMajors }: Props) {
  const url = "https://signature.gidua.xyz/api/majors/getMajors/ ";
  const [data, setData] = useState<MajorShort[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<MajorShort>({ id: 0, name: "" });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    axios
      .get<MajorShortResponse>(url, { signal })
      .then(({ data }) => {
        setData(data);
        console.log("Datos recibidos en .then():", data);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(search);
  };

  return loading ? (
    <SkeletonText mt="1" noOfLines={8} spacing="6" skeletonHeight="2" />
  ) : (
    <>
      <Heading color="blue.400" fontSize={12} fontWeight="bold" mb={4}>
        CARRERAS
      </Heading>
      <form onSubmit={handleSubmit}>
        <Input
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          mb={2}
          placeholder="Buscar Carrera"
        />
      </form>
      {loading ? <p>Cargando...</p> : null}
      <VStack align="stretch">
        {data
          .filter((c) =>
            c.name.toLowerCase().includes(search.name.toLowerCase())
          )
          .map((c) => (
            <Link
              px={2}
              py={1}
              borderRadius={5}
              key={c.name}
              _hover={{ textDecoration: "none" }}
              onClick={() => onSelectMajors(c)}
            >
              {c.name}
            </Link>
          ))}
      </VStack>
    </>
  );
}

export default SideNav;
