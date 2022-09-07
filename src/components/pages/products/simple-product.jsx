import React, { useEffect, useLayoutEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import imagesLoaded from 'imagesloaded';

import Breadcrumb from '../../common/breadcrumb';
import HorizontalThumbnail from './common/thumbnails/horizontal-thumbnail';
import SingleDetail from './common/details/single-detail';
import SingleTab from './common/tabs/single-tab';
import FeaturedProductsOne from './common/product-groups/featured-products-one';
import SidebarToggle from './common/sidebars/sidebar-toggle';
import ProductSidebarTwo from './common/sidebars/product-sidebar-two';

import { findProductById } from '../../../utils';

import {PricelistContext} from '../../../store/PricelistContext'

function SimpleProduct( props ) {
    const { pricelistState } = useContext(PricelistContext);
    const products = pricelistState.pricelist ? pricelistState.pricelist : [];
    const productId  = props.match.params.id ? props.match.params.id : 1;
    let product = findProductById( products, productId );

    if ( !product ) {
        window.location = process.env.PUBLIC_URL + "/pages/404";
    }

    useLayoutEffect( () => {
        document.querySelector( '.skeleton-body' ) && document.querySelector( '.skeleton-body' ).classList.remove( 'loaded' );
    }, [ productId ] )

    useEffect( () => {
        let imgLoad = imagesLoaded( ".product-single-gallery" );

        imgLoad.on( "done", function () {
            document.querySelector( '.skeleton-body' ) && document.querySelector( '.skeleton-body' ).classList.add( 'loaded' );
        } )
    }, [ productId ] )

    return (
        <>
            <Helmet>
                <title>Porto React Ecommerce - Product Page </title>
            </Helmet>

            <h1 className="d-none">Porto React Ecommerce - Product Page</h1>

            <div className="main">
                <Breadcrumb current="Simple" path="products" />

                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 product-page skeleton-body skel-shop-products">
                            <div className="product-single-container product-single-default">
                                <div className="row">
                                    <HorizontalThumbnail addClass="col-lg-7 col-md-6" product={ product } />

                                    <div className="col-lg-5 col-md-6">
                                        <SingleDetail product={ product } link="simple" />
                                    </div>
                                </div>
                            </div>

                            <SingleTab product={ product } isSize={ true } />
                        </div>

                        <SidebarToggle />

                        <ProductSidebarTwo addClass="padding-left-lg" />
                    </div>
                    <FeaturedProductsOne addClass="pt-sm bg-white" isContainer={ false } link="simple" />
                </div>

            </div>
        </>
    )
}

export default SimpleProduct;