import React, { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const Logout = () => {
  const navigate = useNavigate();
  const { setAuth, setCounters } = useAuth();
  useEffect(() => {
    localStorage.clear();
    setAuth({});
    setCounters({});
    navigate("/login");
  }, []);
  return <div>Logout</div>;
};
