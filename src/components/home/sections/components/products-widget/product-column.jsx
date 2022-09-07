import React, { useState } from "react";
import { ProductTypeFourPlaceholder } from "../../../../features/product/product-type-four";
import ProductSearchInput from "./product-seach-input";
import DndListOrderController from "./components/dnd-slides-reorder/dnd-list-order-controller";
import { toast } from "react-toastify";

const ProductColumn = (props) => {
  const [column, setColumn] = useState(props.column);

  const handleTitleChange = (e) => {
    setColumn({
      ...column,
      title: e.target.value.toUpperCase(),
    });
  };

  const reorder = (arr) => {
    setColumn({
      ...column,
      products: arr,
    });
  };

  const handleAddProduct = (product) => {
    setColumn({
      ...column,
      products: [
        ...column.products,
        {
          ...product,
          order: column.products.length,
        },
      ],
    });
  };

  const deleteProduct = (id) => {
    console.log("deleteing...");
    setColumn({
      ...column,
      products: column.products.filter((item) => item.ProductID !== id),
    });
  };

  const handleSave = () => {
    if (!column.title) {
      toast.error("Column title required");
      return;
    }

    props.updateColumn(column);
    props.close();
  };

  return (
    <div
      style={{
        width: "100%",
        marginBottom: "5px",
      }}
    >
      <div
        style={{
          width: "100%",
          borderBottom: "1px #efefef solid",
          padding: "10px 0 10px 0",
        }}
      >
        <input
          type="text"
          className="form-control section-sub-title"
          placeholder="type column title here."
          style={{
            textAlign: "center",
            fontWeight: "700",
          }}
          onChange={handleTitleChange}
          value={column.title}
        />
      </div>

      <div
        style={{
          width: "100%",
          padding: "10px 0 10px 0",
        }}
      >
        <ProductSearchInput addProduct={handleAddProduct} />

        <div
          style={{
            background: "#fff",
            border: "1px #dfdfdf solid",
            padding: "2rem",
            height: 340,
            overflow: "auto",
            position: "relative",
          }}
        >
          {Boolean(column.products.length) ? (
            <DndListOrderController
              list={column.products}
              reorder={reorder}
              deleteProduct={deleteProduct}
            />
          ) : (
            <>
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 10,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#004084"
                  className="bi bi-bag mr-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                </svg>

                <span>No products to display</span>
              </div>
              <ProductTypeFourPlaceholder />
              <ProductTypeFourPlaceholder />
              <ProductTypeFourPlaceholder />
            </>
          )}
        </div>

        <div
          className="alert alert-primary d-flex align-items-center"
          role="alert"
          style={{
            marginBottom: "1rem",
            fontSize: "1.2rem",
            minHeight: "59px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-info-circle-fill"
            viewBox="0 0 16 16"
            style={{ marginRight: 10 }}
          >
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          <div>
            You can <b>re-order</b> the products by dragging and dropping a
            product item into place
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          padding: "1rem 0",
          paddingTop: "3px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "63px",
            background: "#fff",
            position: "fixed",
            bottom: "0px",
            left: 0,
            padding: "1rem 3rem",
            zIndex: 10000,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className={`btn btn-outline-danger btn-sm rounded mr-3`}
            onClick={props.close}
            style={{ minWidth: 150 }}
          >
            Cancel
          </button>

          <button
            className={`btn btn-outline-primary btn-sm rounded`}
            onClick={handleSave}
            style={{ minWidth: 150 }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductColumn;
