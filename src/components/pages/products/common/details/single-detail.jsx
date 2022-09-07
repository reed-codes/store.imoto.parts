import React, {useContext} from 'react';
import { Link } from 'react-router-dom';

import Qty from '../../../../features/qty';
import ProductNav from './common/product-nav';

import { findIndex, getPrice } from '../../../../../utils';
import { quickAddToCart, addToWishList } from '../../../../../action'

import {WishlistContext} from '../../../../../store/WishlistContext'
import {CartListContext} from '../../../../../store/CartListContext'

function SingleDetail( props ) {
    const { wishlist, wishlistDispach } = useContext(WishlistContext);
    const { cartDispach } = useContext(CartListContext);
    const { product, isSticky = false } = props;
    let isInWishlist = findIndex( wishlist.list, product.ProductID ) ? true : false;
    let maxPrice, minPrice = 0;

    if ( product.variants ) {
        maxPrice = getPrice( product.variants );
        minPrice = getPrice( product.variants, 'min' );
    }

    const selectGroup = ( e ) => {
        e.preventDefault();
        if ( props.noSelect === undefined )
            document.querySelector( ".product-single-gallery .owl-item.active img" ).setAttribute( "src", e.currentTarget.getAttribute( "data-src" ) );

        e.currentTarget.parentElement.parentElement.querySelector( ".active" ) && e.currentTarget.parentElement.parentElement.querySelector( ".active" ).classList.remove( "active" );
        e.currentTarget.parentElement && e.currentTarget.parentElement.classList.add( "active" );
    }

    function addToCart( e ) {
        e.preventDefault();

        let val = 1;
        if ( e.currentTarget.parentElement.querySelector( ".horizontal-quantity" ) )
            val = parseInt( e.currentTarget.parentElement.querySelector( ".horizontal-quantity" ).getAttribute( "value" ) );
            quickAddToCart( props.product, val, cartDispach ) ;
    }

    function onWithWishClick( e ) {
        if ( !isInWishlist ) {
            e.preventDefault();
            wishlistDispach( addToWishList( props.product ) );
        }
    }

    return (
        <>
            <div className="skel-pro skel-detail"></div>
            <div className="product-single-details">
                <ProductNav product={ product } link={ props.link } />
                <h1 className="product-title">{ product.name }</h1>

                <div className="ratings-container">
                    <div className="product-ratings">
                        <span className="ratings" style={ { width: 20 * product.Ranking + '%' } }></span>
                    </div>

                    <Link to="#" className="rating-link">{ `( ${ product.reviews } Reviews )` }</Link>
                </div>

                <hr className="short-divider" />


                {
                    product.variants ?
                        <div className="price-box">
                            <span className="product-price">${ minPrice.toFixed( 2 ) } - ${ maxPrice.toFixed( 2 ) }</span>
                        </div>
                        :
                        product.salePrice ?
                            <div className="price-box">
                                <span className="old-price">${ product.Price.toFixed( 2 ) }</span>
                                <span className="product-price">${ product.salePrice.toFixed( 2 ) }</span>
                            </div>
                            :
                            <div className="price-box">
                                <span className="product-price">${ product.Price.toFixed( 2 ) }</span>
                            </div>
                }

                <div className="product-desc">
                    <p>{ product.LongDescription }</p>
                </div>
                {
                    product.variants ?
                        <div className="product-filters-container">
                            {
                                product.variants.map( ( variant, index ) => (
                                    <div className="product-single-filter" key={ "varient" + index }>
                                        <label>{ variant.name }:</label>
                                        {
                                            variant.name === "size" ?
                                                <ul className="config-size-list">
                                                    {
                                                        variant.type.map( ( item, i ) => (
                                                            <li className={ i === 0 ? "active" : "" } key={ "size" + i } >
                                                                <Link to="#" onClick={ selectGroup } data-src={ item.ImageURL[ 0 ] }>{ item.size }</Link>
                                                            </li>
                                                        ) )
                                                    }
                                                </ul>
                                                : <ul className="config-swatch-list">
                                                    {
                                                        variant.type.map( ( item, i ) => (
                                                            <li className={ i === 0 ? "active" : "" } key={ "color" + i } >
                                                                {
                                                                    item.color ?
                                                                        <Link to="#" onClick={ selectGroup } data-src={ item.ImageURL[ 0 ] } style={ { backgroundColor: item.color } }></Link>
                                                                        : <Link to="#" data-src={ item.ImageURL[ 0 ] } onClick={ selectGroup } style={ { backgroundImage: `url(${ process.env.PUBLIC_URL }/${ item.ImageURL[ 0 ] })` } }></Link>
                                                                }
                                                            </li>
                                                        ) )
                                                    }
                                                </ul>
                                        }
                                    </div>
                                ) )
                            }
                        </div>
                        : ""
                }

                <hr className="divider" />

                {
                    isSticky ?
                        <div className="sticky-wrapper">
                            <div className="sticky-header d-none d-lg-block">
                                <div className="container">
                                    <div className="sticky-img">
                                        <img src={ product.ImageURL[ 0 ] } alt="product" />
                                    </div>

                                    <div className="sticky-detail">
                                        <div className="sticky-product-name">
                                            <h2 className="product-title  w-100">{ product.name }</h2>

                                            {
                                                product.variants ?
                                                    <div className="price-box">
                                                        <span className="product-price">${ minPrice.toFixed( 2 ) } - ${ maxPrice.toFixed( 2 ) }</span>
                                                    </div>
                                                    :
                                                    product.salePrice ?
                                                        <div className="price-box">
                                                            <span className="old-price">${ product.Price.toFixed( 2 ) }</span>
                                                            <span className="product-price">${ product.salePrice.toFixed( 2 ) }</span>
                                                        </div>
                                                        :
                                                        <div className="price-box">
                                                            <span className="product-price">${ product.Price.toFixed( 2 ) }</span>
                                                        </div>
                                            }
                                        </div>
                                        <div className="ratings-container">
                                            <div className="product-ratings">
                                                <span className="ratings" style={ { width: 20 * product.Ranking + '%' } }></span>
                                            </div>

                                            <Link to="#" className="rating-link">{ `( ${ product.Ranking } Reviews )` }</Link>
                                        </div>
                                    </div>

                                    <div className="product-action">
                                        <Qty stock={ product.Stock } />

                                        <Link to="#" className="btn btn-dark add-cart icon-shopping-cart" title="Add to Cart" onClick={ addToCart }>
                                            Add to Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ""
                }

                <div className="product-action">
                    <Qty stock={ product.Stock } />

                    <Link to="#" className="btn btn-dark add-cart icon-shopping-cart" title="Add to Cart" onClick={ addToCart }>
                        Add to Cart
                    </Link>
                </div>

                <hr className="divider mb-1" />

                <div className="product-single-share">
                    <div className="social-icons mr-2">
                        <Link to="#" className="social-icon social-facebook icon-facebook" target="_blank"></Link>
                        <Link to="#" className="social-icon social-twitter icon-twitter" target="_blank"></Link>
                        <Link to="#" className="social-icon social-linkedin fab fa-linkedin-in" target="_blank"></Link>
                        <Link to="#" className="social-icon social-gplus fab fa-google-plus-g" target="_blank"></Link>
                        <Link to="#" className="social-icon social-mail icon-mail-alt" target="_blank"></Link>
                    </div>
                    <Link to={ `${ process.env.PUBLIC_URL }/pages/wishlist` } className={ `paction add-wishlist ${ isInWishlist === true ? 'checked' : '' }` } title={ isInWishlist ? 'Go to Wishlist' : 'Add to Wishlist' } onClick={ onWithWishClick }>
                        { isInWishlist ? 'Go to Wishlist' : 'Add to Wishlist' }
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SingleDetail;