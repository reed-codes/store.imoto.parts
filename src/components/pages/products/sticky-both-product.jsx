import React, { useEffect, useLayoutEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import StickyBox from 'react-sticky-box';
import imagesLoaded from 'imagesloaded';

import Breadcrumb from '../../common/breadcrumb';
import InfoThumbnail from './common/thumbnails/info-thumbnail';
import StickyDetail from './common/details/sticky-detail';
import SingleTab from './common/tabs/single-tab';
import FeaturedProductsOne from './common/product-groups/featured-products-one';
import ProductNav from './common/details/common/product-nav';

import { findProductById, stickyContentHandle, setStickyValues } from '../../../utils';

import {PricelistContext} from '../../../store/PricelistContext'

function StickyBothProduct( props ) {
    const { pricelistState } = useContext(PricelistContext);
    const products = pricelistState.pricelist ? pricelistState.pricelist : [];
    const productId  = props.match.params.id ? props.match.params.id : 1;
    let product = findProductById( products, productId );

    if ( !product ) {
        window.location = process.env.PUBLIC_URL + "/pages/404";
    }

    useEffect( () => {
        setStickyValues( 120 );
        window.addEventListener( 'scroll', stickyContentHandle, { passive: true } );

        return () => {
            window.removeEventListener( 'scroll', stickyContentHandle );
        }
    } )

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
                <title>Porto React Ecommerce - Product Sticky Both</title>
            </Helmet>

            <h1 className="d-none">Porto React Ecommerce - Product Page</h1>

            <div className="main">
                <Breadcrumb current="Sticky Both" path="products" />

                <div className="container product-page skeleton-body skel-shop-products">
                    <div className="product-single-container product-both-info">
                        <div className="product-single-details">
                            <div className="product-top-banner position-relative">
                                <h1 className="product-title">{ product.Description }</h1>
                                <ProductNav product={ product } link={ props.link } addClass="mb-0" />
                                <div className="d-block d-sm-flex">
                                    <div className="ratings-container mt-1 mb-1">
                                        <div className="product-ratings">
                                            <span className="ratings" style={ { width: 20 * product.Ranking + '%' } }></span>
                                        </div>

                                        <Link to="#" className="rating-link">{ `( ${ product.reviews } Reviews )` }</Link>
                                    </div>
                                    <div className="product-single-share ml-auto">
                                        <div className="social-icons">
                                            <Link to="#" className="social-icon social-facebook icon-facebook" target="_blank"></Link>
                                            <Link to="#" className="social-icon social-twitter icon-twitter" target="_blank"></Link>
                                            <Link to="#" className="social-icon social-linkedin fab fa-linkedin-in" target="_blank"></Link>
                                            <Link to="#" className="social-icon social-gplus fab fa-google-plus-g" target="_blank"></Link>
                                            <Link to="#" className="social-icon social-mail icon-mail-alt" target="_blank"></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3">
                                <StickyBox className="sticky-sidebar" offsetTop={ 80 }>
                                    <div className="skel-pro skel-sticky"></div>
                                    <div className="product-single-details">

                                        <div className="price-box">
                                            <span className="product-price">${ product.Price.toFixed( 2 ) }</span>
                                        </div>

                                        <div className="product-desc">
                                            <p>{ product.LongDescription }</p>
                                        </div>
                                    </div>
                                </StickyBox>
                            </div>


                            <InfoThumbnail addClass="col-lg-6" product={ product } />

                            <StickyDetail product={ product } />
                        </div>
                    </div>

                    <SingleTab product={ product } />
                </div>

                <FeaturedProductsOne link="sticky-both" />
            </div>
        </>
    )
}


export default StickyBothProduct;