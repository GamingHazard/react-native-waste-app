import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserType = createContext();

const UserContext = ({ children }) => {
  const [UserToken, setUserToken] = useState(null);
  const [UserID, setUserID] = useState(null);
  const [UserInfo, setUserInfo] = useState(null);
  const [UserRole, setUserRole] = useState(null);
  // Check if the token exists in sessionStorage to set the initial authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!AsyncStorage.getItem("userToken")
  );

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const id = await AsyncStorage.getItem("userId");
        const profile = await AsyncStorage.getItem("profile");
        const role = await AsyncStorage.getItem("userRole");

        if (token && id) {
          setUserToken(token);
          setUserID(id);
          setUserRole(role);
          setUserInfo(profile); // Ensure profile is parsed if stored as a JSON string
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  //User Registration
  const register = (token, id, data) => {
    setIsAuthenticated(true);
    setUserToken(token);
    setUserRole(role);
    setUserID(id);
    setUserInfo(data);
    AsyncStorage.setItem("userToken", token);
    AsyncStorage.setItem("profile", JSON.stringify(data));
    AsyncStorage.setItem("userId", id);
  };

  //User Login
  const login = (token, role, id, data) => {
    setIsAuthenticated(true);
    setUserToken(token);
    setUserRole(role);
    setUserID(id);
    setUserInfo(data);
    AsyncStorage.setItem("userToken", token);
    AsyncStorage.setItem("userRole", role);
    AsyncStorage.setItem("profile", JSON.stringify(data));

    AsyncStorage.setItem("userId", id);
  };

  // User Logout
  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    setUserID(null);
    await AsyncStorage.clear();
  };

  return (
    <UserType.Provider
      value={{ UserID, UserToken, UserInfo, logout, UserRole, login, register }}
    >
      {children}
    </UserType.Provider>
  );
};

export { UserType, UserContext };
