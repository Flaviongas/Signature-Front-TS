import { createContext } from "react";
import { Subject, SubjectList } from "../types"

type SubjectContext ={
    SubjectData: Subject[]
    setSubjectData:(setSubjectList:Subject[]) => void;

}

export default createContext<SubjectContext> ({} as SubjectContext);
