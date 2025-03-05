import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FormEvent, useContext, useRef, useState } from "react";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";

type Props = { isOpen: boolean; onClose: () => void };

function RecipeModalMajor({ isOpen, onClose }: Props) {
  const { selectedMajors } = useContext(MajorContext);
  const nameRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const url = "https://signature.gidua.xyz/api/subjects/";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nameValue = nameRef?.current?.value?.trim();
    if (!nameValue) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    if (!selectedMajors || !selectedMajors.id) {
      setError("Debes seleccionar una carrera.");
      return;
    }

    try {
      const response = await axios.post(
        url,
        {
          name: nameValue.toUpperCase(),
          major: [selectedMajors.id],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Error al hacer la petición");
      console.error(err);
    }

    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6x1">
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent maxW="40vw">
          <ModalHeader>Agregar Asignatura</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="20vh" overflowY="auto">
            {/*selectedMajors.name*/}

            <FormControl>
              <FormLabel htmlFor="name">Ingresar Nombre</FormLabel>
              <Input ref={nameRef} textTransform="uppercase" type="text" />
              <FormHelperText>Ricardo estuvo aqui</FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              Crear
            </Button>

            <Button ml={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

export default RecipeModalMajor;
