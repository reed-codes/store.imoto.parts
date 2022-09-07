import React from "react";

const ProductResult = (props) => {
  return (
    <div
      style={{
        height: 70,
        width: "98%",
        display: "flex",
        marginBottom: 8,
        padding: 2,
        boxSizing: "content-box",
        cursor: "pointer",
        border: "1px #f3f3f3 solid",
        borderRadius: 6,
        overflow: "hidden",
      }}
      className="shadow-sm product-result"
      onClick={() => props.select(props.item)}
    >
      <div
        style={{
          height: "100%",
          width: 70,
          minWidth: 70,
          background: "#777",
          pointerEvents: "none",
        }}
      >
        <img
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          src={props.image}
          alt="product image"
        />
      </div>

      <div
        style={{
          height: "100%",
          width: "100%",
          flex: 1,
          marginLeft: 5,
        }}
      >
        <div
          style={{
            width: "100%",
            marginBottom: 2,
            margin: 0,
            padding: 0,
            display: "block",
          }}
          className="product-description text-truncate"
        >
          {props.name}
        </div>

        <div
          style={{
            width: "100%",
            fontSize: 13,
            opacity: 0.7,
            margin: 0,
            padding: 0,
            display: "block",
            whiteSpace: "normal",
          }}
          className="product-description text-truncate"
        >
          {(props.description && props.description.length) > 80
            ? props.description.slice(0, 80) + "..."
            : props.description}
        </div>
      </div>
    </div>
  );
};

export default ProductResult;
