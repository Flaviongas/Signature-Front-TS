import React from "react";

type Props = {
  carrera: string;
};

function Dashboard({ carrera }: Props) {
  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold">
        {carrera
          ? `Carrera seleccionada: ${carrera}`
          : "Seleccione una Carrera"}
      </h1>
    </div>
  );
}

export default Dashboard;
