import Home from "./Home";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

const Index = () => {
    const { isNewUser } = useUser();

    if (isNewUser) {
        return <Navigate to="/intro" replace />;
    }

    return <Home />;
};

export default Index;
