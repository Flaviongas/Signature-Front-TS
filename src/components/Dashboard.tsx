import React, { useContext } from "react";
import MajorContext from "../contexts/MajorContext";
import { MajorShort } from "../types";
import SubjectsGrid from "./SubjectsGrid";
import SubjectContext from "../contexts/SubjectContext";
import Asistencia from "./Asistencia";

type Props = {};

function Dashboard({}: Props) {
  const { setSubjectData } = useContext(SubjectContext);
  return (
    <>
      <SubjectsGrid />
      <Asistencia />
    </>
  );
}

export default Dashboard;
