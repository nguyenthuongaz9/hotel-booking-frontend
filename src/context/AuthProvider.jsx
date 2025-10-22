import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null)

export const useAuth = ()=> {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const storeUser = localStorage.getItem("user");
    if(storeUser){
      setUser( JSON.parse(storeUser))
    }
    setLoading(false);
  }, [])

  const login = async (email, password) => {
    const user = {}
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const signup = async (userData) => {
      const user = {} 
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    }
  
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup
  }

  return(
  <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
