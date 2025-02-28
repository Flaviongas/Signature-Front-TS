import React, { useContext } from "react";
import MajorContext from "../contexts/MajorContext";
import { MajorShort } from "../types";
import SubjectsGrid from "./SubjectsGrid";

type Props = {};

function Dashboard({}: Props) {
  const { selectedMajors } = useContext(MajorContext);
  return <SubjectsGrid />;
}

export default Dashboard;
