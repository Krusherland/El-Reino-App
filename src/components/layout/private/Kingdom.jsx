

import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UnifiedHeader } from "../shared/UnifiedHeader";
import { Outlet } from "react-router-dom";
import { KingdomLoader } from "../../common/KingdomComponents";

export const Kingdom = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <KingdomLoader message="Esperando palomas mensajeras..." size="medium" />;
  }

  if (!auth || !auth.name) {
    navigate("/login");
    return null;
  }
  
  return (
    <>
      <UnifiedHeader isPrivate={true} />
      <Outlet />
    </>
  );
};
