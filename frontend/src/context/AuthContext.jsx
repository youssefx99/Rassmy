import {createContext, useReducer} from "react";


export const AuthContext = createContext({
    user: null,
});

function reducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                ...action.payload.data
            };
        case "LOGOUT":
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}

export default function UserProvider({children}) {
    const [state, dispatch] = useReducer(reducer, {user: null});
    console.log(state);
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}