import React, { useState } from 'react'

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
})
export default function AuthContextProvider( props ) {

    const [isAutnticated, setIsAutenticated] = useState(false)

    const logUserInHandler = () => {
        setIsAutenticated(true)
    }
    

    return (
        <AuthContext.Provider value={{login: logUserInHandler, isAuth: isAutnticated}}>
            {props.children}
        </AuthContext.Provider>
    )
}
