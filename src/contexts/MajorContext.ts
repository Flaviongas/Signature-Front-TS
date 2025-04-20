import { createContext } from "react";
import { MajorShort } from "../types";

type MajorContextType = {
  selectedMajors: MajorShort;
  setSelectedMajors: (setSelectedMajors: MajorShort) => void;
};

export default createContext<MajorContextType>({} as MajorContextType);
