import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getAccessToken } from "../../store/tokenStorage";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => Boolean(state.auth?.isAuthenticated));
  const token = getAccessToken();
  const allowed = Boolean(token) && isAuthenticated;

  const didToastRef = useRef(false);
  useEffect(() => {
    if (!allowed && !didToastRef.current) {
      didToastRef.current = true;
      toast.info("Please sign in to continue to checkout.");
    }
  }, [allowed]);

  if (!allowed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

