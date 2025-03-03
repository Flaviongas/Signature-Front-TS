import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import MajorContext from "../contexts/MajorContext";

type Props = { isOpen: boolean; onClose: () => void };

function RecipeModalMajor({ isOpen, onClose }: Props) {
  const { selectedMajors } = useContext(MajorContext);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6x1">
      <ModalOverlay />
      <ModalContent maxW="90vw">
        <ModalHeader>Agregar Asignatura</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="70vh" overflowY="auto">
          {selectedMajors.name}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue">Enviar Asistencia</Button>
          <Button ml={3} onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RecipeModalMajor;
