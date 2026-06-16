import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicOnlyRoute;
