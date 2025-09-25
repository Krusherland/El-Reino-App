
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export const Kingdom = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Esperando palomas mensajeras...</div>;
  }

  if (!auth || !auth.name) {
    navigate("/login");
    return null;
  }
  
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
