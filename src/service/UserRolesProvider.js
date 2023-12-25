import React, { createContext, useContext, useState } from "react";
import { getUserInfo } from "./UsersInfo";

const UserRolesContext = createContext();

export const UserRolesProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState([]);

  React.useEffect(() => {
    getUserInfo().then((data) => {
      setUserRoles(data.roles);
    });
  }, []);

  return (
    <UserRolesContext.Provider value={{ userRoles, setUserRoles }}>
      {children}
    </UserRolesContext.Provider>
  );
};

export const useUserRoles = () => useContext(UserRolesContext);
