import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { Student, Asistencia } from "../types";
import { useState } from "react";

type Props = { isOpen: boolean; onClose: () => void; data: Student[] };

function RecipeModal({ isOpen, onClose, data }: Props) {
  const [checkedStudents, setCheckedStudents] = useState<Student[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleCheckboxChange = (student: Student) => {
    setCheckedStudents((prev) => {
      const exists = prev.find((s) => s.id === student.id);
      if (exists) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      alert("Por favor, selecciona una fecha antes de enviar.");
      return;
    }

    const asistenciaData: Asistencia = {
      // este es objeto que deje para que puedas hacer el execel
      fecha: new Date(selectedDate),
      Students: checkedStudents,
    };

    console.log("Asistencia enviada:", asistenciaData);

    setCheckedStudents([]);
    setSelectedDate("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6x1">
      <ModalOverlay />
      <ModalContent maxW="90vw">
        <ModalHeader>Asistencia</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="70vh" overflowY="auto">
          <input
            type="date"
            className="form-control mb-3"
            value={selectedDate}
            onChange={handleDateChange}
          />

          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Rut</th>
                <th scope="col">DV</th>
                <th scope="col">FirstName</th>
                <th scope="col">SecondName</th>
                <th scope="col">LastName</th>
                <th scope="col">SecondLastName</th>
                <th className="text-center" scope="col">
                  Asistencia
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.rut}</td>
                  <td>{student.dv}</td>
                  <td>{student.first_name}</td>
                  <td>{student.second_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.second_last_name}</td>
                  <td className="text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkedStudents.some((s) => s.id === student.id)}
                      onChange={() => handleCheckboxChange(student)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Enviar Asistencia
          </Button>
          <Button ml={3} onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RecipeModal;
