import React, { createContext, useReducer } from "react";
import {
    notificationsAndDatabaseReducer,
    initialNotificationAndDatabaseState
} from "./context-reducers/notificationAndDatabaseReducer";

const NotificationAndDatabaseContext = createContext({});

export const NotificationAndDatabaseContextProvider = ({ children }) => {
  const [workersState, workersStateDispatch] = useReducer(
    notificationsAndDatabaseReducer,
    initialNotificationAndDatabaseState
  );
  
  return (
    <NotificationAndDatabaseContext.Provider
      value={{
        workersState,
        workersStateDispatch,
      }}
    >
      {children}
    </NotificationAndDatabaseContext.Provider>
  );
};

export default NotificationAndDatabaseContext;
