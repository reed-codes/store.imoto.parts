import React, { useState } from "react";
import { useSellerConfig } from "../../../../../store/sellerConfigContext";
import { getPricelistByCategory } from "../../../../../utils";
import { ImpulseSpinner } from "react-spinners-kit";
import ProductResult from "./product-result-item";

const ProductEditor = (props) => {
  const [searchString, setSearchString] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sellerConfigs } = useSellerConfig();
  const sellerID = sellerConfigs.SellerID;

  const HAS_PRODUCTS_RESULTS = Boolean(productResults.length);

  const handleSearchStringChange = (e) => {
    setSearchString(e.target.value);
    setProductResults([]);
  };

  const handleSelectProduct = (product) => {
    props.handleAdd({
      ...product,
      SliderID: props.product.SliderID,
    });
    setProductResults([]);
    setSearchString("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchString) {
      setLoading(true);
      getPricelistByCategory(sellerID, searchString, 1, 5).then((res) => {
        setProductResults(res);
        setLoading(false);
      });
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
      onSubmit={handleSearch}
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
              height: "250px",
              background: "#fff",
              position: "absolute",
              bottom: -245,
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
              height: "170px",
              background: "#fff",
              position: "absolute",
              bottom: -162,
              left: 0,
              zIndex: "10000",
              overflow: "auto",
              padding: 8,
            }}
            className="shadow-lg"
          >
            {productResults.map((product, i) => {
              return (
                <ProductResult
                  key={i + "-product-result"}
                  name={product.Description}
                  description={product.LongDescription}
                  image={product.ImageURL[0]}
                  select={handleSelectProduct}
                  item={product}
                />
              );
            })}
          </div>
        )}
      </div>

      <button
        className="btn btn-primary btn-sm mr-2 rounded"
        onClick={handleSearch}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "30px",
          zIndex: 10000,
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

export default ProductEditor;
