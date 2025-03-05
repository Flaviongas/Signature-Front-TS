import { Input, Link, SkeletonText, VStack } from "@chakra-ui/react";
import axios from "axios";
import { FormEvent, useContext, useEffect, useState } from "react";
import { MajorShort, MajorShortResponse } from "../types";
import MajorContext from "../contexts/MajorContext";

// type Props = {};

function SideNav() {
  const url = "https://signature.gidua.xyz/api/majors/getMajors/ ";
  const [data, setData] = useState<MajorShort[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<MajorShort>({ id: 0, name: "" });
  const { setSelectedMajors } = useContext(MajorContext);

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
    <nav className="p-4 h-[90vh] overflow-y-auto">
      <a
        onClick={() => {
          setSelectedMajors({ id: 0, name: "" });
        }}
      ></a>
      <form onSubmit={handleSubmit}>
        <Input
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          mb={2}
          textAlign={"center"}
          placeholder="Buscar Carrera"
        />
      </form>
      {loading ? <p>Cargando...</p> : null}
      <VStack align="stretch" className="w-full">
        {data
          .filter((c) =>
            c.name.toLowerCase().includes(search.name.toLowerCase())
          )
          .map((c) => (
            <Link
              px={2}
              py={2}
              borderRadius={5}
              key={c.id}
              onClick={() => setSelectedMajors(c)}
              textAlign={"center"}
              _hover={{
                textDecoration: "none",
                bg: "blue.600",
                color: "white",
              }}
            >
              <p className="cursor-pointer transition-transform duration-100 hover:scale-105 p-0 m-0">
                {" "}
                {c.name}{" "}
              </p>
            </Link>
          ))}
      </VStack>
    </nav>
  );
}

export default SideNav;
