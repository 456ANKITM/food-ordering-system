import { Navigate } from "react-router-dom";
import { Loader } from "./Loader";
import { useSelector } from "react-redux";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector(
    (state) => state.user
  );

  if (!authChecked) return <Loader />;

  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default PublicOnlyRoute;