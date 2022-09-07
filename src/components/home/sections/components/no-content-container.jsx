import React from 'react';
import { useSellerConfig } from '../../../../store/sellerConfigContext';

const NoContentContainer = (props) => {
    const { addItem, message, containerHeight} = props;
    const { sellerConfigs } = useSellerConfig();

    if (sellerConfigs.UserInfo.enableEditing) {
      return (
        <div
          style={{
            height: containerHeight ? containerHeight : "214px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f4f4f4",
            border: "1px #90999d29 solid",
          }}
        >
          <button
            className="btn btn-outline-secondary"
            title="Add a Info Box slider"
            onClick={ addItem }
            style={{
              padding: 0,
              height: 50,
              width: 50,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              className="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </button>
          <h6 style={{ margin: 10 }}>
            {message ? message : "Click to add a Item to the Widget"}
          </h6>
        </div>
      );
    }
    return <></>;
  }

  export default NoContentContainer;