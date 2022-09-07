import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { setParallax } from "../../utils";
import HomeScreenSlider from "./sections/home-screen-slider";
import InfoBoxesSlider from "./sections/info-boxes-slider";
import FeatureBoxes from "./sections/feature-boxes";
import BrandsCarousel from "./sections/brands-carousel";
import ViewDeletedSectionsToggleButton from "./sections/components/view-deleted-sections-toggle-button";
import CategoriesSlider from "./sections/categories-slider";
import { useSellerConfig } from "../../store/sellerConfigContext";
import { hideDeletedComponents } from "../../action";
import HomePageProductsSlide from "./sections/home-screen-products-slide";
import SectionImage from "./sections/section-image";
// import AdBannerSlider from "./sections/ad-banner-slider"
import ProductsWidget from "./sections/products-widget";
import withAuthCheck from "../hoc/withAuthCheck";
import Sidebar from "./sidebar/sidebar";

const HomePage = () => {
  const { sellerConfigs, sellerConfigDispatch } = useSellerConfig();
  const THEME_HAS_SIDE_BAR = sellerConfigs.Theme.HasSideBar;
  const deletedSectionsNumber = Object.values(sellerConfigs.UIConfig).filter(
    (section) => section.deleted
  ).length;

  useEffect(() => {
    if (!Boolean(deletedSectionsNumber)) {
      sellerConfigDispatch(hideDeletedComponents());
    }
  }, [deletedSectionsNumber]);

  useEffect(() => {
    if (document.querySelector(".parallax")) {
      document.addEventListener("scroll", setParallax);
    }
  });

  /**
   * Handles the showing and hiding depending on whether component is delete or not
   * As well as logic for showing a component when viewDeletedComponents variable is true
   *
   * @param {string}  widgetName  The name of the widget in the seller config file.
   */
  const shouldShowComponent = (widgetName) => {
    return Boolean(
      !sellerConfigs.UIConfig[widgetName].deleted ||
        (sellerConfigs.UIConfig[widgetName].deleted &&
          sellerConfigs.UIConfig.viewDeleteSections)
    );
  };

  return (
    <>
      <Helmet>
        <title>Community Store</title>
      </Helmet>
      <h1 className="d-none">Community Store</h1>
      <div className="main">
        <div className={`${THEME_HAS_SIDE_BAR ? "container mb-2" : ""}`}>
          <div className="row">
            {THEME_HAS_SIDE_BAR && <Sidebar />}

            <div className={`${THEME_HAS_SIDE_BAR ? "col-lg-9" : "col-lg-12"}`}>
              {shouldShowComponent("HomeScreenSlider") && <HomeScreenSlider />}
              {shouldShowComponent("InfoBoxesSlider") && <InfoBoxesSlider />}
              {shouldShowComponent("BrandsCarousel") && <BrandsCarousel />}
              {shouldShowComponent("FeaturedProductsSlider") && (
                <HomePageProductsSlide component="FeaturedProductsSlider" />
              )}
              {shouldShowComponent("AdBannerOne") && (
                <SectionImage component="AdBannerOne" />
              )}
              {shouldShowComponent("NewProductsSlider") && (
                <HomePageProductsSlide component="NewProductsSlider" />
              )}
              {shouldShowComponent("AdBannerTwo") && (
                <SectionImage component="AdBannerTwo" />
              )}
              {shouldShowComponent("CategoriesSlider") && <CategoriesSlider />}
              {shouldShowComponent("FeatureBoxes") && <FeatureBoxes />}
              {shouldShowComponent("ProductsWidget") && (
                <ProductsWidget component="ProductsWidget" />
              )}
            </div>
          </div>
        </div>
      </div>

      {deletedSectionsNumber && sellerConfigs.UserInfo.enableEditing ? (
        <ViewDeletedSectionsToggleButton />
      ) : null}
    </>
  );
};

export default withAuthCheck(HomePage);
