import { createContext } from "react";
import { MajorShort } from "../types";

type MajorContextType = {
  selectedMajor: MajorShort;
  setSelectedMajor: (setSelectedMajor: MajorShort) => void;
  // setSelectedMajor: (major: MajorShort) => void;
};

export default createContext<MajorContextType>({} as MajorContextType);
