import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Student, Subject } from "../types";
import useGetData from "../hooks/useGetData";
import { useContext, useState } from "react";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";

type Props = { setWindow: (a: boolean) => void; refresh: () => void };

function EditStudents({ setWindow, refresh }: Props) {
  const url_students = import.meta.env.VITE_API_URL + "/api/students/";
  const url_subjects = import.meta.env.VITE_API_URL + "/api/subjects/";
  const { data: studentsData } = useGetData<Student>(url_students);
  const { data: subjectsData } = useGetData<Subject>(url_subjects);
  const { selectedMajors } = useContext(MajorContext);
  const [check, setCheck] = useState(false);

  const handleCLick = () => {
    setWindow(false);
  };

  const filteredStudents = studentsData.filter(
    (e) => e.major === selectedMajors.id
  );

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

  const filteredSubjects = subjectsData.filter((e) =>
    e.major.includes(selectedMajors.id)
  );
  const handleCheck = () => {
    check ? setCheck(false) : setCheck(true);
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

      <div className="mt-2 min-h-96 max-h-96 overflow-y-auto">
        <table className="table relative w-full">
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
              <th>Asignaturas</th>
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
                  <div className="btn-group relative">
                    <button
                      type="button"
                      className="btn btn-success dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Ver
                    </button>
                    <ul className="dropdown-menu absolute z-50 hidden bg-white shadow-lg rounded-md w-64 mt-2 max-h-60 overflow-y-auto p-2">
                      <li>
                        <p className="text-center font-bold">Asignaturas</p>
                      </li>
                      <li>
                        <div className="list-group">
                          {filteredSubjects.map((subject) => (
                            <div
                              key={subject.id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span>{subject.name}</span>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onClick={handleCheck}
                                checked={check}
                              />
                            </div>
                          ))}
                        </div>
                      </li>
                    </ul>
                  </div>
                </td>
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
