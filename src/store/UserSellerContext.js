import React, { createContext, useReducer } from "react";

import {
  userSellerReducer,
  initialUserSellerState,
} from "./context-reducers/userSellerReducer";

const UserSellerContext = createContext({});

export const UserSellerContextProvider = ({ children }) => {
  const [userSeller, userSellerDispatch] = useReducer(
    userSellerReducer,
    initialUserSellerState
  );
  
  return (
    <UserSellerContext.Provider
      value={{
        userSeller,
        userSellerDispatch,
      }}
    >
      {children}
    </UserSellerContext.Provider>
  );
};

export default UserSellerContext;
