import React, { useEffect, useLayoutEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import imagesLoaded from 'imagesloaded';

import Breadcrumb from '../../common/breadcrumb';
import HorizontalThumbnail from './common/thumbnails/horizontal-thumbnail';
import SingleDetail from './common/details/single-detail';
import SingleTab from './common/tabs/single-tab';
import FeaturedProductsOne from './common/product-groups/featured-products-one';

import { findProductById } from '../../../utils';

import {PricelistContext} from '../../../store/PricelistContext'

function HorizontalProduct( props ) {
    const { pricelistState } = useContext(PricelistContext);
    const products = pricelistState.pricelist ? pricelistState.pricelist : [];
    const productId  = props.match.params.id ? props.match.params.id : 1;
    let product = findProductById( products, productId );

    useLayoutEffect( () => {
        document.querySelector( '.skeleton-body' ) && document.querySelector( '.skeleton-body' ).classList.remove( 'loaded' );
    }, [ productId ] )

    useEffect( () => {
        let imgLoad = imagesLoaded( ".product-single-gallery" );

        imgLoad.on( "done", function () {
            document.querySelector( '.skeleton-body' ) && document.querySelector( '.skeleton-body' ).classList.add( 'loaded' );
        } )
    }, [ productId ] )

    if ( !product ) {
        window.location = process.env.PUBLIC_URL + "/pages/404";
    }

    return (
        <>
            <Helmet>
                <title>Porto React Ecommerce - Product Horizontal</title>
            </Helmet>

            <h1 className="d-none">Porto React Ecommerce - Product Page</h1>

            <div className="main">
                <div className="container">
                    <Breadcrumb current="Horizontal" path="products" />
                    <div className="product-single-container product-single-default skeleton-body skel-shop-products">
                        <div className="row">
                            <HorizontalThumbnail addClass="col-md-5" product={ product } />

                            <div className="col-md-7">
                                <SingleDetail product={ product } link="horizontal" />
                            </div>
                        </div>
                    </div>

                    <SingleTab product={ product } />
                </div>

                <FeaturedProductsOne link="horizontal" />
            </div>
        </>
    )
}

export default HorizontalProduct;