import { MajorShort } from "../types";

import SubjectGrid from "./SubjectGrid";

type Props = {
  majors: MajorShort;
};

function Dashboard({ majors }: Props) {
  const isEmpty = majors.id === 0 && majors.name === "";

  return (
    <div className="flex-1 p-4">
      {isEmpty ? (
        <>
          <p className="text-gray-500">No hay nada seleccionado</p>
          <p className="text-gray-500">Seleccione una Carrera</p>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold">
            Carrera seleccionada: {majors.name}
          </p>
          <SubjectGrid majors={majors} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
