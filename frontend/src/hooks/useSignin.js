import {useAuthContext} from "./useAuthContext.js";
import {useState} from "react";


export function useSignin(){
    const {dispatch} = useAuthContext();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const login = async (email, password) => {
        setError('');
        setLoading(true);
        const response = await fetch('http://localhost:4000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();

        if(response.ok){
            dispatch({type: 'LOGIN', payload: data.data});
            setLoading(false);
        }else{
            setLoading(false);
            setError("error");
            console.log(data);
        }
    }
    return {login, error, loading};
}