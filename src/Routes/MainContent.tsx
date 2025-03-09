import { useState } from "react";
import SideNav from "../components/SideNav";
import Dashboard from "../components/Dashboard";
import { MajorShort, Subject } from "../types";
import MajorContext from "../contexts/MajorContext";
import SubjectContext from "../contexts/SubjectContext";

import logo from "../assets/signature.svg";

// type Props = {};

function MainContent() {
  const [selectedMajors, setSelectedMajors] = useState<MajorShort>({
    id: 0,
    name: "",
  });
  const [SubjectData, setSubjectData] = useState<Subject[]>([]);
  return (
    <MajorContext.Provider value={{ selectedMajors, setSelectedMajors }}>
      <SubjectContext.Provider value={{ SubjectData, setSubjectData }}>
        <div className="flex flex-row w-full h-screen">
          <div className="w-1/4 min-w-56 bg-blue-900 text-white max-w-72">
            <img src={logo} alt="logo" className="w-40 h-40 mx-auto my-2" />
            <SideNav />
          </div>
          <div className="w-full bg-gray-100">
            <Dashboard />
          </div>
        </div>
      </SubjectContext.Provider>
    </MajorContext.Provider>
  );
}

export default MainContent;
