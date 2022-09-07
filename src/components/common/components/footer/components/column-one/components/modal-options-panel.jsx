import React from 'react'

const ModalOptionsPanel = () => {
    return (
      <div
        style={{
          width: "100%",
          height:'64px',
          background: "#fff",
          position: "fixed",
          zIndex: 1000,
          bottom: 0,
          left: 0,
          padding: "1rem 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="rounded shadow-lg border-top"
      />
    );
  };
  
export default ModalOptionsPanel