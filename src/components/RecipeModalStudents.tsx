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
import Form from "./Form";
import { ShortSubject, Student } from "../types";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  shortSubject: ShortSubject;
  refresh: () => void;
};

function RecipeModalStudents({
  isOpen,
  onClose,
  shortSubject,
  refresh,
}: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const handleStudentAdded = (newStudent: Student) => {
    console.log("Nuevo estudiante agregado:", newStudent);
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    refresh();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="70vw">
          <ModalHeader>Agregar Estudiantes</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="70vh" overflowY="auto">
            <Form
              subjectId={shortSubject.id}
              onStudentAdded={handleStudentAdded}
            ></Form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RecipeModalStudents;
