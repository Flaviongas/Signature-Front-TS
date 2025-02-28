import React, { useContext } from "react";
import MajorContext from "../contexts/MajorContext";
import { MajorShort } from "../types";

type Props = {};

function Dashboard({}: Props) {
  const { selectedMajors } = useContext(MajorContext);
  return selectedMajors.name;
}

export default Dashboard;
