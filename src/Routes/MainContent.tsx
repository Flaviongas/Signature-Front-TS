import { useState } from "react";
import SideNav from "../components/SideNav";
import Dashboard from "../components/Dashboard";
import { MajorShort, Subject } from "../types";
import MajorContext from "../contexts/MajorContext";
import SubjectContext from "../contexts/SubjectContext";

import logo from '../assets/signature.svg'
import { Button } from "@chakra-ui/react";

// type Props = {};

function MainContent() {
  const [selectedMajors, setSelectedMajors] = useState<MajorShort>({
    id: 0,
    name: "",
  });
  const [SubjectData, setSubjectData] = useState<Subject[]>([]);

  const logOut = () => {
    localStorage.setItem("Token", "");
    location.reload()
  }

  return (
    <MajorContext.Provider value={{ selectedMajors, setSelectedMajors }}>
      <SubjectContext.Provider value={{ SubjectData, setSubjectData }}>
        <div className="flex flex-row w-full">

          <div className="w-1/4 min-w-56 bg-blue-900 text-white max-w-72">
            <img src={logo} alt="logo" className="w-40 h-40 mx-auto my-2" />
            <SideNav />
            <div className="flex text-center justify-center">
              <Button className="flex my-3 align-middle justify-center text-center" onClick={logOut} >Cerrar sesión</Button>
            </div>
          </div>
          <div className="flex w-full bg-gray-100">
            <Dashboard />
          </div>
        </div>
      </SubjectContext.Provider>
    </MajorContext.Provider>
  );
}

export default MainContent;
