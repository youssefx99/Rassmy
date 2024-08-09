import {AuthContext} from "../context/AuthContext.jsx";
import {useContext} from "react";

export function useAuthContext() {
    return useContext(AuthContext);
}