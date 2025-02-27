import React, { useEffect, useState } from "react";
import { MajorShort, Subject, SubjectList } from "../types";
import axios from "axios";

type Props = {
  majors: MajorShort;
};

function Dashboard({ majors }: Props) {
  const url = "https://signature.gidua.xyz/api/subjects/";
  const [data, setData] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const isEmpty = majors.id === 0 && majors.name === "";

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    axios
      .get<SubjectList>(url, { signal })
      .then(({ data }) => {
        setData(data);
        console.log("Datos recibidos en .then():", data);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <div className="flex-1 p-4">
      {isEmpty ? (
        <>
          <p className="text-gray-500">No hay nada seleccionado</p>
          <p className="text-gray-500">Seleccione una Carrera</p>
        </>
      ) : (
        <p className="text-2xl font-bold">
          Carrera seleccionada: {majors.name}
        </p>
      )}
    </div>
  );
}

export default Dashboard;
