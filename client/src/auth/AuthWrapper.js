import { createContext, useContext, useState } from "react";
import {
  RenderMenu,
  RenderRoutes,
} from "../components/structure/RenderNavigation";
import { useEffect } from "react";
import { getAuth, postLogin, getLogout, test } from "../api/auth";
const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const [user, setUser] = useState({
    email: "",
    isAuthenticated: false,
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchAuthState();

    test().catch((error) => {
      console.log(error.message);
    });
  }, []);

  const fetchAuthState = async () => {
    setIsLoading(true);
    try {
      const response = await getAuth();
      if (response.success) {
        setIsLoading(false);
        setUser({ email: response.email, isAuthenticated: response.success });
        if (response.role) {
          setUser((user) => {
            return { ...user, role: response.role };
          });
        }
        return { success: true, message: "Authenticated" };
      } else {
        setIsLoading(false);
        setUser({ email: "", isAuthenticated: false });
        throw new Error(response.message);
      }
    } catch (error) {
      setIsLoading(false);
      setUser({ email: "", isAuthenticated: false });
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    const req = { email: email, password: password };
    try {
      const response = await postLogin(req);

      if (response.success) {
        setUser({ email, isAuthenticated: response.success });
        if (response.role) {
          setUser((user) => {
            return { ...user, role: response.role };
          });
        }
        return { success: true, message: "Successful login" };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      const response = await getLogout();

      if (response.success) {
        setUser({ ...user, isAuthenticated: false, role: undefined });
        return { success: true, message: response.message };
      } else {
        throw new Error("An error occurred.");
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchAuthState }}>
      <>
        <RenderMenu />
        <RenderRoutes />
      </>
    </AuthContext.Provider>
  );
};
