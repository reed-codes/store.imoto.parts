import React, { useContext, useState } from "react";
import NotificationAndDatabaseContext from "../../../../store/NotificationAndDatabaseContext";
import SellerConfigContext from "../../../../store/sellerConfigContext";

import "../../global-css/styles.css";

const Notifications = () => {
  const { sellerConfigs } = useContext(SellerConfigContext);
  const { workersState } = useContext(NotificationAndDatabaseContext);
  const notifications = workersState.notifications.length
    ? workersState.notifications
    : [];

  const [hovered, setHovered] = useState(false);

  return (
    <div className="dropdown cart-dropdown" style={{ marginRight: 15 }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="26"
        viewBox="0 0 16 16"
        className="bi bi-bell"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        fill={
          hovered
            ? sellerConfigs.Theme.ColorPalette["Primary"]
            : sellerConfigs.Theme.ColorPalette["Gray-10"]
        }
      >
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
      </svg>
      {notifications.length === 0 ? null : (
        <span
          className="cart-count badge-circle"
          style={{
            background: sellerConfigs.Theme.ColorPalette["Quaternary"],
            color: sellerConfigs.Theme.ColorPalette["White"],
            top: -4,
            right: -4,
            width: 15,
            height: 15,
            fontSize: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {notifications.length}
        </span>
      )}
    </div>
  );
};

export default Notifications;
