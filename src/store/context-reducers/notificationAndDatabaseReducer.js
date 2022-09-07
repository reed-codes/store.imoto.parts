import { 
  SET_NOTIFICATIONS,
  SET_DATABASE_WORKER,
  SET_NOTIFICATION_WORKER,
} from "../../constants/action-types";

export const initialNotificationAndDatabaseState = {
  notifications: [],
  databaseWorker: null,
  notificationWorker: null
};

export const notificationsAndDatabaseReducer = (state=initialNotificationAndDatabaseState, action) => {
  switch (action.type) {
    // set notifications
    case SET_NOTIFICATIONS:
      let { notifications } = state;
      if (Array.isArray(action.payload)) {
        notifications = action.payload;
        // now see if we must realod local orders

        // TODO: include the Database worker functionality.
        // dbWorker.postMessage({
        //   msg: "GET_NOTIFICATIONS",
        //   notifications: list,
        // });
      } else {
        // check if the notifiction is deleted, if it is deleted then remove it from context
        // else add the notification to the global state.
        if (action.payload.deleted) {
          notifications = notifications.filter((notif) => notif.Id !== action.payload.Id);
        } else {
          notifications.push(action.payload);
        }

        // order has come in, or status has changed by notif.deleted flag, so let dbworker retrieve it and update orderreducer so pages update
        // or upload results from a pricelist upload have come in
        // switch (action.payload.Type) {
        //   case "Order":
        //     // orders have changed so re-fetch order and aggregates
        //     dbWorker.postMessage({
        //       msg: "GET_ORDER",
        //       orderID: action.payload.Id,
        //       ignoreDB: true,
        //     });
           
        //   case "PLUpdated":
        //     plDispatch({
        //       type: "SET_PLUPLOADED",
        //       payload: true,
        //     });
        //   case "PLUpdatedFromCat":
        //     catDispatch({
        //       type: "SET_CATPOSTED",
        //       payload: true,
        //     });
        //   case "User":
        //     dbWorker.postMessage({
        //       msg: "GET_USER",
        //       userID: action.payload.UserID,//!changed from Id to UserID
        //       ignoreDB: true,//was ignore cache
        //     });
        //     dbWorker.postMessage({
        //       msg: "GET_AGGREGATES",
        //       ignoreCache: true,
        //     });
        //     break;
        // }
      }
      
      return {
        ...state,
        notifications: notifications
      };

    case SET_NOTIFICATION_WORKER:
      return {
        ...state,
        notificationWorker: action.payload,
      };

    case SET_DATABASE_WORKER:
      return {
        ...state,
        databaseWorker: action.payload,
      };

    default: return state;
  }
};
