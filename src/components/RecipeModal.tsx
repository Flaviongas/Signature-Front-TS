import React, { useContext } from "react";
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
import { Student, Asistencia, ShortSubject } from "../types";
import { useEffect, useState } from "react";
import useExcel from "../hooks/useExcel";

import axios from "axios";
import Form from "./Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import MajorContext from "../contexts/MajorContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Student[];
  shortSubject: ShortSubject;
};

function RecipeModal({ isOpen, onClose, data, shortSubject }: Props) {
  const [checkedStudents, setCheckedStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [place, setPlace] = useState(false);
  const [textBoton, setTextBoton] = useState<string>("Agregar Estudiantes");
  const [students, setStudents] = useState<Student[]>([]);
  const { selectedMajors } = useContext(MajorContext);
  useEffect(() => {
    if (isOpen) {
      setPlace(false);
      setTextBoton("Agregar Estudiante");
    }
  }, [isOpen]);
  useEffect(() => {
    console.log("Checked students:", checkedStudents);
  }, [checkedStudents]);

  useEffect(() => {
    setStudents(data);
  }, [data]);

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

  const HandleSubmit = () => {
    const currentDate = new Date();
    const ISODate = currentDate.toISOString();
    const asistenciaData: Asistencia = {
      fecha: selectedDate ? new Date(selectedDate).toISOString() : ISODate,
      Students: checkedStudents,
    };
    console.log("Asistencia data:", asistenciaData);
    console.log("ShortSubject:", shortSubject);
    useExcel(asistenciaData, ISODate, shortSubject, selectedMajors);

    setCheckedStudents([]);
    setSelectedDate("");
    onClose();
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la asignatura ${shortSubject.name}?`
    );

    if (!confirmDelete) {
      return;
    }
    if (!shortSubject.id) {
      return;
    }

    try {
      await axios.delete(
        `https://signature.gidua.xyz/api/subjects/${shortSubject.id}/`
      );
      cleanup();
    } catch (err) {
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
  function cleanup() {
    setSelectedDate("");
    setCheckedStudents([]);
    onClose();
  }

  const handleStudentAdded = (newStudent: Student) => {
    console.log("Nuevo estudiante agregado:", newStudent);
    setStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  const handleStudentDelete = async (student: Student) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al estudiante ${student.first_name} ${student.last_name}?`
    );

    if (!confirmDelete) {
      return;
    }

    console.log(student.id);
    if (!student.id) {
      return;
    }

    try {
      await axios.delete(
        `https://signature.gidua.xyz/api/students/${student.id}/`
      );
      setStudents((prevStudents) =>
        prevStudents.filter((s) => s.id !== student.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={cleanup} size="6x1">
      <ModalOverlay />
      <ModalContent maxW="70vw">
        <ModalHeader>Asistencia</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="70vh" overflowY="auto">
          <input
            type="date"
            className="form-control mb-3"
            value={selectedDate}
            id="date-input"
            name="selectedDate"
            onChange={handleDateChange}
          />
          <Button onClick={handlePlace}>{textBoton}</Button>

          {place ? (
            <Form
              subjectId={shortSubject.id}
              onStudentAdded={handleStudentAdded}
            ></Form>
          ) : (
            ""
          )}
          <table className="table">
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  Asistencia
                </th>
                <th className="text-left" scope="col">
                  Rut
                </th>
                <th className="text-left" scope="col">
                  DV
                </th>
                <th className="text-left" scope="col">
                  Nombre
                </th>
                <th className="text-left" scope="col">
                  Segundo Nombre
                </th>
                <th className="text-left" scope="col">
                  Apellido
                </th>
                <th className="text-left" scope="col">
                  Segundo Apellido
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="text-center">
                    <input
                      key={student.id}
                      className="form-check-input"
                      type="checkbox"
                      checked={checkedStudents.some((s) => s.id === student.id)}
                      onChange={() => handleCheckboxChange(student)}
                    />
                  </td>
                  <td>{student.rut}</td>
                  <td>{student.dv}</td>
                  <td>{student.first_name}</td>
                  <td>{student.second_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.second_last_name}</td>
                  <td>
                    <FontAwesomeIcon
                      className="hover:text-red-800"
                      icon={faTrash}
                      onClick={() => handleStudentDelete(student)}
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
            <Button colorScheme="blue" onClick={HandleSubmit}>
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
