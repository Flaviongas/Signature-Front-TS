import { createContext } from "react";
import { Subject} from "../types"

type SubjectContext ={
    SubjectData: Subject[]
    setSubjectData:(setSubjectList:Subject[]) => void;

}

export default createContext<SubjectContext> ({} as SubjectContext);
