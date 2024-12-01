/*
    This component is used to protect private routes, only allowing
    authenticated users to access them.
*/

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/login" />
};

export default PrivateRoute;