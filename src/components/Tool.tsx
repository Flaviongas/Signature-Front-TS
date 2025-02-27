import { Button } from "@chakra-ui/react";

type Props = {
  regresar: () => void;
};
function Tool({ regresar }: Props) {
  return (
    <div>
      <Button mb={4} colorScheme="blue" onClick={regresar}>
        Regresar
      </Button>
      <h2>Asistencia</h2>
    </div>
  );
}

export default Tool;
