import { useState } from "react";
import { MajorShort } from "../types";
import MenuSelection from "./MenuSelection";

import SubjectGrid from "./SubjectGrid";
import Tool from "./Tool";

type Props = {
  majors: MajorShort;
};

function Dashboard({ majors }: Props) {
  const [mostrar, setMostrar] = useState(true);
  return (
    <div>
      {mostrar ? (
        <MenuSelection majors={majors} cambiarVista={() => setMostrar(false)} />
      ) : (
        <Tool regresar={() => setMostrar(true)} />
      )}
    </div>
  );
}

export default Dashboard;
