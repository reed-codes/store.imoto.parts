import React from 'react';

const FeatureBoxActions = (props) => {
    return (
      <div
        style={{
          position: "relative",
          margin:'auto',
          marginTop: 15,
          overflow: "hidden",
          display:'flex',
          justifyContent:'center',
          width:'fit-content',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden !important",
          }}
          className="tool-box-option"
          onClick={props.editClicked}
        >
          <svg
            width="20"
            height="20"
            fill="#08C"
            viewBox="0 0 16 16"
            className="bi bi-pencil-fill"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
          </svg>
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden !important",
          }}
          className="tool-box-option"
          onClick={props.deleteClicked}
        >
          <svg
            width="20"
            height="20"
            fill="red"
            viewBox="0 0 16 16"
            className="bi bi-trash-fill"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
          </svg>
        </div> 
      </div>
    );
  }

  export default FeatureBoxActions;