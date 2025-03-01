import React, { useContext } from "react";
import SubjectContext from "../contexts/SubjectContext";
import MajorContext from "../contexts/MajorContext";

type Props = {};

function Asistencia({ }: Props) {
  const { SubjectData } = useContext(SubjectContext);
  const { selectedMajors } = useContext(MajorContext);

  if (!SubjectData || SubjectData.length === 0) {
    return <p>Cargando...</p>;
  }

  const filteredSubjects = SubjectData.filter((subject) =>
    subject.major.includes(selectedMajors.id)
  );

  return (
    <div className="p-4 ">
      <h2>Asistencia</h2>
      {filteredSubjects.length === 0 ? (
        <p>No hay materias para esta carrera.</p>
      ) : (
        <ul>
          {filteredSubjects.map((subject) => {
            const filteredStudents = subject.students.filter(
              (student) => student.major === selectedMajors.id
            );

            return (
              <li key={subject.id}>
                {subject.name}
                {filteredStudents.length === 0 ? (
                  <p>No hay estudiantes en esta materia.</p>
                ) : (
                  <ul>
                    {filteredStudents.map((student) => (
                      <li key={student.id}>{student.first_name}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Asistencia;
