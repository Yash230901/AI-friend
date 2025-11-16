import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        return localStorage.getItem("token") || Cookies.get("jwt") || null
    })
    return (
        <AuthContext.Provider value={[authUser, setAuthUser]}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
//children means all the components in components folder data will be passed to all compnent and wrap the app in contextAPI.