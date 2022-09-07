import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSellerConfig } from "../../../store/sellerConfigContext";

function ProductTypeFour(props) {
  const { sellerConfigs } = useSellerConfig();
  let { addClass, link = "default", product } = props;

  return (
    <div
      className={`product-default ${addClass}`}
      style={{
        padding: 3,
        background: sellerConfigs.Theme.ColorPalette["White"],
      }}
    >
      <figure>
        <Link
          to={`${process.env.PUBLIC_URL}/products/${link}/${product.ProductID}`}
        >
          <div className="lazy-overlay bg-3"></div>

          <LazyLoadImage
            alt="product"
            src={product.ImageURL[0]}
            threshold={500}
            effect="blur"
          />
          {product.ImageURL.length >= 2 ? (
            <LazyLoadImage
              alt="product"
              src={product.ImageURL[0]}
              threshold={500}
              effect="blur"
              wrapperClassName="product-image-hover"
            />
          ) : (
            ""
          )}
        </Link>
      </figure>

      <div className="product-details">
        <h4 className="product-title">
          <Link
            to={`${process.env.PUBLIC_URL}/products/${link}/${product.ProductID}`}
            style = {{
              color: sellerConfigs.Theme.ColorPalette["Gray-10"],
            }}
          >
            {product.Description}
          </Link>
        </h4>

        <div className="ratings-container">
          <div className="product-ratings">
            <span
              className="ratings"
              style={{ width: 20 * product.Ranking + "%" }}
            ></span>
            <span className="tooltiptext tooltip-top">
              {product.Ranking.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Get the currancy instead of hardcoding the currancy to ZAR */}
        <h6 className="product-title"
          style = {{
            color: sellerConfigs.Theme.ColorPalette["Gray-10"],
          }}
          >R {product.Price}</h6>
      </div>
    </div>
  );
}

export function ProductTypeFourPlaceholder(props) {
  return (
    <div
      className={`product-default ${props.addClass}`}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        gap: 7,
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          height: 84,
          width: 84,
          minWidth: 84,
          background: "#f4f4f48a",
        }}
      />

      <div
        className="product-details"
        style={{
          width: "100%",
          maxHeight: "unset",
          justifyContent: "flex-start !important",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h4
          className="product-title"
          style={{
            height: 19,
            width: "100%",
            background: "#f4f4f48a",
          }}
        />
        <div
          className="ratings"
          style={{
            height: 19,
            width: "50%",
            background: "#f4f4f48a",
          }}
        />
      </div>
    </div>
  );
}

export function ProductTypeFourPlaceholderActive(props) {
  return (
    <div
      className={`product-default ${props.addClass}`}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        gap: 7,
      }}
    >
      <div
        style={{
          height: 84,
          width: 84,
          minWidth: 84,
          background: "#f4f4f4",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="btn btn-outline-secondary"
          style={{
            padding: 0,
            height: "100%",
            width: "100%",
          }}
          title="Add a product"
          onClick={props.handleOpenProductAdder}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-plus"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </div>

      <div
        className="product-details"
        style={{
          width: "100%",
          maxHeight: "unset",
          justifyContent: "flex-start !important",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            height: 35,
            width: "100%",
            background: "#f4f4f4",
          }}
        />
        <div
          style={{
            height: 25,
            width: "50%",
            background: "#f4f4f4",
          }}
        />
      </div>
    </div>
  );
}

export default ProductTypeFour;
