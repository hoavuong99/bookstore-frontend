/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useContext, useMemo, useState } from "react";
import {
  getTokenPayload,
  isAuthenticatedToken,
} from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// authProvider
export const AuthProvide = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!raw || !isAuthenticatedToken(token)) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
      }

      return {
        ...JSON.parse(raw),
        role: getTokenPayload(token).role,
      };
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });
  const [loading] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

  const persistSession = (authData) => {
    const accessToken = authData?.accessToken;
    const tokenPayload = getTokenPayload(accessToken);

    if (!accessToken || !tokenPayload || !isAuthenticatedToken(accessToken)) {
      throw new Error("The server returned an invalid authentication token.");
    }

    const mappedUser = {
      userId: authData?.userId,
      email: authData?.email,
      fullName: authData?.fullName,
      displayName: authData?.fullName,
      name: authData?.fullName,
      role: tokenPayload.role,
    };

    localStorage.setItem("user", JSON.stringify(mappedUser));
    localStorage.setItem("token", accessToken);
    setCurrentUser(mappedUser);
    return mappedUser;
  };

  const extractAuthData = (response) => {
    if (response?.data?.success === true) {
      return response.data.data;
    }
    throw new Error(response?.data?.message || "Authentication failed");
  };

  // register a user
  const registerUser = async ({ email, password, fullName, phone, address }) => {
    const response = await axios.post(`${apiBaseUrl}/auth/register`, {
      email,
      password,
      fullName,
      phone,
      address,
    });

    const authData = extractAuthData(response);
    return persistSession(authData);
  };

  // login the user
  const loginUser = async (email, password) => {
    const response = await axios.post(`${apiBaseUrl}/auth/login`, {
      email,
      password,
    });

    const authData = extractAuthData(response);
    return persistSession(authData);
  };

  // sing up with google
  const signInWithGoogle = async () => {
    throw new Error("Google sign in is not configured for backend auth.");
  };

  // logout the user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const updateCurrentUser = (user) => {
    setCurrentUser((previousUser) => {
      const updatedUser = { ...previousUser, ...user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      registerUser,
      loginUser,
      signInWithGoogle,
      logout,
      updateCurrentUser,
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
