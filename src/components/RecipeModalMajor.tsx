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
import React, { FormEvent, useContext, useRef } from "react";
import MajorContext from "../contexts/MajorContext";

type Props = { isOpen: boolean; onClose: () => void };

function RecipeModalMajor({ isOpen, onClose }: Props) {
  const { selectedMajors } = useContext(MajorContext);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(nameRef?.current?.value);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6x1">
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent maxW="90vw">
          <ModalHeader>Agregar Asignatura</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="70vh" overflowY="auto">
            {/*selectedMajors.name*/}

            <FormControl>
              <FormLabel htmlFor="name">Ingresar Nombre</FormLabel>
              <Input ref={nameRef} type="text" />
              <FormHelperText>Ricardo estuvo aqui</FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              Enviar Asistencia
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
