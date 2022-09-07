import React, {useEffect, useState, useContext} from "react";
import {Helmet} from "react-helmet";
import imagesLoaded from "imagesloaded";
import Breadcrumb from "../../common/breadcrumb";
import TopBanner from "../../features/banner/top-banner";
import PricelistContainer from "./common/pricelist-container";
import ShopSidebar from "./common/shop-sidebar";
import PricelistHeaderFilter from "./common/pricelist-header-filter";
import Pagination from "../../features/pagination";
import SidebarToggle from "../products/common/sidebars/sidebar-toggle";
import {PricelistContext} from "../../../store/PricelistContext";
import {receiveProducts, paginate} from "../../../action";
import SellerConfigContext from "../../../store/sellerConfigContext";
import {
    getMaxProductPrice,
    getMinProductPrice,
    getPricelistByCategory,
    removeProductDuplicates,
    shopFilterProducts
} from "../../../utils";

function FullWidth() {
    const {pricelistState, pricelistDispach} = useContext(PricelistContext);
    const [isLoading, setIsLoading] = useState(true);
    const {sellerConfigs} = useContext(SellerConfigContext);
    const curPage = pricelistState.viewOptions.page;

    useEffect(() => {
        setIsLoading(true);
        if (sellerConfigs.SellerID) {
            const requestedCategory = pricelistState.filter.categories[pricelistState.filter.categories.length - 1];
            getPricelistByCategory(sellerConfigs.SellerID, requestedCategory, pricelistState.viewOptions.page, pricelistState.viewOptions.numItemsDisplay).then((res) => { // ADDING THE EXTRA PRODUCTS FETCHED FOR THE SUBCATEGORY TO THE OVERALL PRICELIST
                let newGlobalPricelist = [...res];
                    newGlobalPricelist = removeProductDuplicates(newGlobalPricelist);
                let minPrice = getMinProductPrice(newGlobalPricelist);
                let maxPrice = getMaxProductPrice(newGlobalPricelist);

                let newFilteredPricelist = shopFilterProducts(newGlobalPricelist, {
                    ...pricelistState.filter,
                    price: {
                        min: minPrice,
                        max: maxPrice
                    }
                }, pricelistState.viewOptions.sortBy, pricelistState.original.categories);

                pricelistDispach(receiveProducts(newGlobalPricelist, null, newFilteredPricelist));
                setIsLoading(false);
            });
        }
    }, [pricelistState.viewOptions.numItemsDisplay, pricelistState.currentCategory, pricelistState.filter.categories,]);

    useEffect(() => {
        setIsLoading(true);
        if (sellerConfigs.SellerID) {
            const requestedCategory = pricelistState.filter.categories[pricelistState.filter.categories.length - 1];
            getPricelistByCategory(sellerConfigs.SellerID, requestedCategory, pricelistState.viewOptions.page, pricelistState.viewOptions.numItemsDisplay).then((res) => { // ADDING THE EXTRA PRODUCTS FETCHED FOR THE SUBCATEGORY TO THE OVERALL PRICELIST
                let newGlobalPricelist = [...res];
                    newGlobalPricelist = removeProductDuplicates(newGlobalPricelist);
                let minPrice = getMinProductPrice(newGlobalPricelist);
                let maxPrice = getMaxProductPrice(newGlobalPricelist);

                let newFilteredPricelist = shopFilterProducts(newGlobalPricelist, {
                    ...pricelistState.filter,
                    price: {
                        min: minPrice,
                        max: maxPrice
                    }
                }, pricelistState.viewOptions.sortBy, pricelistState.original.categories);

                let preservedViewOptions = pricelistState.viewOptions;

                pricelistDispach(receiveProducts(newGlobalPricelist, null, newFilteredPricelist, preservedViewOptions));
                setIsLoading(false);
            });
        }
    }, [pricelistState.viewOptions.page]);

    useEffect(() => {
        let imgLoad = imagesLoaded(".product-group");

        if (document.querySelector(".skeleton-body")) {
            document.querySelector(".skeleton-body").classList.remove("loaded");
            imgLoad.on("done", function () {
                document.querySelector(".skeleton-body") && document.querySelector(".skeleton-body").classList.add("loaded");
            });
        }
    });

    const onChangeCurPage = (curPageParam) => {
        if (curPage !== curPageParam) {
            pricelistDispach(paginate(curPageParam));
        }
    };

    return (<>
        <Helmet>
            <title>Porto React Ecommerce - Category Full Width</title>
        </Helmet>

        <h1 className="d-none">Porto React Ecommerce - Product Category Page</h1>

        <div className="main">
            <div className="category-banner-container bg-gray">
                <TopBanner/>
            </div>
            <Breadcrumb current="Full Width" path="categories"/>
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 skeleton-body skel-shop-products">
                        <PricelistHeaderFilter/>
                        <PricelistContainer curPage={curPage}
                            isLoading={isLoading}/>
                        <Pagination changeCurrentPage={onChangeCurPage}
                            curPage={curPage}/>
                    </div>
                    <SidebarToggle/>
                    <aside className="sidebar-shop col-lg-3 order-lg-first mobile-sidebar">
                        <ShopSidebar/>
                    </aside>
                </div>
            </div>
            <div className="mb-5"></div>
        </div>
    </>);
}

export default FullWidth;
