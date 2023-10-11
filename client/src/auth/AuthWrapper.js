import { createContext, useContext, useState } from "react";
import {
  RenderMenu,
  RenderRoutes,
} from "../components/structure/RenderNavigation";
import { useEffect } from "react";
import Constants from "../constants";
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
  }, []);

  const fetchAuthState = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${Constants.backend}/auth/check-auth`, {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();

      if (data.success) {
        setIsLoading(false);
        setUser({ email: data.email, isAuthenticated: data.success });
        if (data.role) {
          setUser((user) => {
            return { ...user, role: data.role };
          });
        }
        return { success: true, message: "Authenticated" };
      } else {
        setIsLoading(false);
        setUser({ email: "", isAuthenticated: false });
        throw new Error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      setUser({ email: "", isAuthenticated: false });
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${Constants.backend}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();

      if (data.success) {
        setUser({ email, isAuthenticated: data.success });
        if (data.role) {
          setUser((user) => {
            return { ...user, role: data.role };
          });
        }
        return { success: true, message: "Successful login" };
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${Constants.backend}/auth/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred.");
      }

      const data = await response.json();

      if (data.success) {
        setUser({ ...user, isAuthenticated: false, role: undefined });
        return { success: true, message: data.message };
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
