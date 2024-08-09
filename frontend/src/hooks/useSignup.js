import { useState} from "react";
import {useAuthContext} from "./useAuthContext.js";


export function useSignup() {
    const {dispatch } = useAuthContext();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const signup = async ({...props}) => {
        setLoading(true);
        setError('');
        const response = await fetch("http://localhost:4000/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...props})
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            setError(data.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        dispatch({type: "LOGIN", payload: data.data});
    };

    return {signup};
}