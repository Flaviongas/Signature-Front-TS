import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Student } from "../types";
import useGetData from "../hooks/useGetData";
import { useContext, useEffect, useState } from "react";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";

type Props = { setWindow: (a: boolean) => void; refresh: () => void };

function EditStudents({ setWindow, refresh }: Props) {
  const url = import.meta.env.VITE_API_URL + "/api/students/";

  //Falta que esos estudiantes sean de la carrera indicada//
  const { data } = useGetData<Student>(url);
  const { selectedMajors } = useContext(MajorContext);

  const handleCLick = () => {
    setWindow(false);
  };
  const filteredStudents = data.filter((e) => e.major === selectedMajors.id);

  const handleDelete = async (student: Student) => {
    console.log(student.id);
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

    const token = localStorage.getItem("Token");
    try {
      const url = import.meta.env.VITE_API_URL + "/api/students";
      await axios.delete(`${url}/${student.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex justify-start mt-2">
        <FontAwesomeIcon
          className="text-xl cursor-pointer hover:text-yellow-400 "
          onClick={handleCLick}
          icon={faArrowLeft}
        />
      </div>
      <input
        type="text"
        className="form-control mt-2"
        placeholder="Nombre"
      ></input>

      <div className="mt-2 overflow-y-auto max-h-96 mt-4">
        <table className="table">
          <thead>
            <tr>
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
              <th className="text-left" scope="col">
                Borrar
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
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
                    onClick={() => handleDelete(student)}
                    cursor={"pointer"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EditStudents;
