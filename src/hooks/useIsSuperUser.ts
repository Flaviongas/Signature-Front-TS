import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useIsSuperUser = () => {
  const [isSuperUser, setIsSuperUser] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const superUserStatus = localStorage.getItem("IsSuperUser");
    if (superUserStatus === "true") {
      setIsSuperUser(true);
    } else {
      setIsSuperUser(false);
      navigate("/");
    }
  }, [navigate]);

  return isSuperUser;
};

export default useIsSuperUser;
