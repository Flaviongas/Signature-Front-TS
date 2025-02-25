import React from "react";

type Props = {
  majors: string;
};

function Dashboard({ majors }: Props) {
  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold">
        {majors ? `Carrera seleccionada: ${majors}` : "Seleccione una Carrera"}
      </h1>
    </div>
  );
}

export default Dashboard;
