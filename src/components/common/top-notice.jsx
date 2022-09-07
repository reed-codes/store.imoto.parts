import React from "react";
import { Link } from "react-router-dom";
import { useSellerConfig } from "../../store/sellerConfigContext";
import { adjustColorBrightness } from "../../utils";

function TopNotice() {
  const { sellerConfigs } = useSellerConfig();
  const closeNotice = () => {
    document.querySelector(".top-notice").classList.add("d-none");
  };

  return (
    <div
      className="top-notice"
      style={{
        color: sellerConfigs.Theme.ColorPalette.White,
        background: sellerConfigs.Theme.ColorPalette.Primary,
        borderBottom: "1px #0000001a solid",
      }}
    >
      <div className="container text-center">
        <h5 className="d-inline-block mb-0 mr-3 text-nowrap">
          Get Up to <b>40% OFF</b> New-Season Styles
        </h5>
        <Link
          to={`${process.env.PUBLIC_URL}/categories/full-width`}
          className="category"
          style={{
            color: sellerConfigs.Theme.ColorPalette.White,
            background: adjustColorBrightness(
              sellerConfigs.Theme.ColorPalette.Primary,
              -25
            ),
          }}
        >
          MEN
        </Link>
        <Link
          to={`${process.env.PUBLIC_URL}/categories/full-width`}
          className="category  ml-3 mr-4"
          style={{
            color: sellerConfigs.Theme.ColorPalette.White,
            background: adjustColorBrightness(
              sellerConfigs.Theme.ColorPalette.Primary,
              -25
            ),
          }}
        >
          WOMEN
        </Link>
        <small>* Limited time only</small>
        <button
          title="Close (Esc)"
          onClick={closeNotice}
          type="button"
          className="mfp-close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default React.memo(TopNotice);
