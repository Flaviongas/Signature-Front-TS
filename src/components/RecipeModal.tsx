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
import { useContext, useEffect, useState } from "react";
import SubjectContext from "../contexts/SubjectContext";
import axios from "axios";
import Form from "./Form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Student[];
  subjectId: number | null;
};

function RecipeModal({ isOpen, onClose, data, subjectId }: Props) {
  const [checkedStudents, setCheckedStudents] = useState<Student[]>([]);
  const { SubjectData } = useContext(SubjectContext);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [place, setPlace] = useState(false);
  const [textBoton, setTextBoton] = useState<String>("Agregar Estudiantes");

  useEffect(() => {
    if (isOpen) {
      setPlace(false);
      setTextBoton("Agregar Estudiante");
    }
  }, [isOpen]);

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

  const handleDelete = async () => {
    if (!subjectId) {
      setError("No se ha seleccionado ninguna asignatura para eliminar.");
      return;
    }

    try {
      await axios.delete(
        `https://signature.gidua.xyz/api/subjects/${subjectId}/`
      );
      setError(null);
      onClose();
    } catch (err) {
      setError("Error al eliminar la asignatura");
      console.error(err);
    }
  };
  const handlePlace = () => {
    if (place) {
      setPlace(false);
      setTextBoton("Agregar Estudiantes");
    } else {
      setPlace(true);
      setTextBoton("Ocultar");
    }
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
          <Button onClick={handlePlace}>{textBoton}</Button>

          {place ? <Form subjectId={subjectId}></Form> : ""}
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
                      key={student.id}
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
        <ModalFooter className="w-full flex">
          <div className="flex-1 ">
            <Button bg={"red"} color={"white"} onClick={handleDelete}>
              Borrar
            </Button>
          </div>
          <div className="flex gap-3">
            <Button colorScheme="blue" onClick={handleSubmit}>
              Enviar Asistencia
            </Button>
            <Button ml={3} onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RecipeModal;
