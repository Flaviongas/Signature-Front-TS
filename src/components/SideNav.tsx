import { Heading, Link, Text, VStack } from "@chakra-ui/react";

type Props = { onSelectCarrera: (category: string) => void };

function SideNav({ onSelectCarrera }: Props) {
  const carreras = ["carrera1", "carrera2"];

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
