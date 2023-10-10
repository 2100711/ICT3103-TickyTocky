import { createContext, useContext, useState } from "react";
import {
  RenderMenu,
  RenderRoutes,
} from "../components/structure/RenderNavigation";
import Constants from "../constants";
const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const [user, setUser] = useState({ email: "", isAuthenticated: false });

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
        setUser({ ...user, isAuthenticated: false });
        return { success: true, message: data.message };
      } else {
        throw new Error("An error occurred.");
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <>
        <RenderMenu />
        <RenderRoutes />
      </>
    </AuthContext.Provider>
  );
};
