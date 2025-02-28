import React, { useContext } from "react";
import SubjectContext from "../contexts/SubjectContext";
import { li } from "framer-motion/client";

type Props = {};

function Asistencia({}: Props) {
  const { SubjectData } = useContext(SubjectContext);
  console.log("SubjectData:", SubjectData);

  if (SubjectData.length === 0) return <p>Cargando...</p>;

  return (
    <div>
      <ul>
        {SubjectData.map((e) => (
          <li key={e.id}>
            {e.name}
            <ul>
              {e.students.map((f) => (
                <li key={f.id}>{f.first_name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Asistencia;
