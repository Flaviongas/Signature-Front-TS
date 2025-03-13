import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Student } from "../types";
import useGetData from "../hooks/useGetData";

type Props = { setWindow: (a: boolean) => void };

function EditStudents({ setWindow }: Props) {
  const url = import.meta.env.VITE_API_URL + "/api/students/";

  const { data } = useGetData<Student>(url);
  const handleCLick = () => {
    setWindow(false);
  };
  return (
    <>
      <div className="flex justify-start mt-2">
        <FontAwesomeIcon
          className="text-xl cursor-pointer hover:text-yellow-400"
          onClick={handleCLick}
          icon={faArrowLeft}
        />
      </div>
      <div>
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
            </tr>
          </thead>
          <tbody>
            {data.map((student) => (
              <tr key={student.id}>
                <td>{student.rut}</td>
                <td>{student.dv}</td>
                <td>{student.first_name}</td>
                <td>{student.second_name}</td>
                <td>{student.last_name}</td>
                <td>{student.second_last_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EditStudents;
