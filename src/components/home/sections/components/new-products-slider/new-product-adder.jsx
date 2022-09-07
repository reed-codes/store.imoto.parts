import React, { useState } from "react";
import { ImpulseSpinner } from "react-spinners-kit";
import { getPricelistByCategory } from "../../../../../utils";
import ProductResult from "./product-result-item";
import { useSellerConfig } from "../../../../../store/sellerConfigContext";
import { v4 as uuidv4 } from "uuid";

const NewProductAdder = (props) => {
  const [searchString, setSearchString] = useState("");
  const [productResults, setProductResults] = useState({
    list: [],
    searched: false,
  });
  const [loading, setLoading] = useState(false);
  const { sellerConfigs } = useSellerConfig();
  const sellerID = sellerConfigs.SellerID;

  const HAS_PRODUCTS_RESULTS = Boolean(productResults.list.length);
  const CHECKED_FOR_PRODUCTS = Boolean(productResults.searched);

  const handleSearchStringChange = (e) => {
    setSearchString(e.target.value);
    setProductResults({
      searched: false,
      list: [],
    });
  };

  const handleSelectProduct = (product) => {
    props.addProduct(product);
  };

  const search = async (e) => {
    e.preventDefault();

    if (searchString) {
      setLoading(true);

      const cachedRequestDataJSON = localStorage.getItem(
        "products-adder-query-cache"
      );

      if (cachedRequestDataJSON) {
        const cachedRequestData = JSON.parse(cachedRequestDataJSON);

        if (cachedRequestData.searchString === searchString) {
          setProductResults({
            searched: true,
            list: cachedRequestData.response,
          });
          setLoading(false);
          return;
        }
      }

      console.log("doing fresh query...");
      const res = await getPricelistByCategory(sellerID, searchString, 1, 5);

      const cachePayload = {
        searchString: searchString,
        response: res,
      };

      localStorage.setItem(
        "products-adder-query-cache",
        JSON.stringify(cachePayload)
      );

      setProductResults({
        searched: true,
        list: res,
      });

      setLoading(false);
    }
  };

  return (
    <form
      style={{
        height: "125px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: 0,
      }}
      onSubmit={search}
    >
      <div
        className="product-title"
        style={{
          width: "100%",
          position: "relative",
          overflow: "visible",
          marginBottom: 0,
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <input
          type="text"
          placeholder="Enter Product name"
          className="form-control"
          onChange={handleSearchStringChange}
          value={searchString}
          title={"Please select a product category"}
          autoFocus={true}
        />

        {loading && (
          <div
            style={{
              width: "100%",
              height: 170,
              background: "#fff",
              position: "absolute",
              top: 62,
              left: 0,
              zIndex: "10005",
              overflow: "auto",
              padding: 8,
            }}
            className="shadow-lg"
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImpulseSpinner size={30} frontColor="#aaa" />
            </div>
          </div>
        )}

        {!loading && HAS_PRODUCTS_RESULTS && (
          <div
            style={{
              width: "100%",
              maxHeight: 290,
              background: "#fff",
              position: "absolute",
              top: 62,
              left: 0,
              zIndex: 10005,
              overflow: "auto",
              padding: "8px 8px 0",
              transform: "translate(0,0)",
            }}
            className="shadow-lg"
          >
            {productResults.list.map((product, i) => {
              return (
                <ProductResult
                  key={uuidv4()}
                  name={product.Description}
                  description={product.LongDescription}
                  image={product.ImageURL[0]}
                  select={handleSelectProduct}
                  item={product}
                />
              );
            })}
            <div
              style={{
                height: "20px",
                width: "100%",
                position: "sticky",
                bottom: -10,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.08), transparent)",
              }}
            />
          </div>
        )}

        {!loading && !HAS_PRODUCTS_RESULTS && CHECKED_FOR_PRODUCTS && (
          <div
            style={{
              width: "100%",
              maxHeight: "250px",
              background: "#fff",
              position: "absolute",
              top: 62,
              left: 0,
              zIndex: "10005",
              overflow: "auto",
              padding: "8px 8px 0",
              transform: "translate(0,0)",
            }}
            className="shadow-lg"
          >
            <div
              className="alert alert-warning d-flex align-items-center"
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
                className="bi bi-exclamation-triangle-fill"
                viewBox="0 0 16 16"
                style={{ marginRight: 10 }}
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>

              <div>
                <b>No products</b> match the provided search string.
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        className="btn btn-outline-primary btn-sm mr-2 rounded"
        onClick={search}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "30px",
          zIndex: 10000,
          minWidth: 150,
          opacity: !searchString ? 0.7 : 1,
          pointerEvents: !searchString ? "none" : "auto",
        }}
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default NewProductAdder;
