import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import StickyBox from 'react-sticky-box';

import Qty from '../../../../features/qty';
import { findIndex, setStickyValues, stickyContentHandle } from '../../../../../utils';

import { quickAddToCart, addToWishList } from '../../../../../action'

import {WishlistContext} from '../../../../../store/WishlistContext'
import {CartListContext} from '../../../../../store/CartListContext'

function StickyDetail( props ) {
    const { wishlist, wishlistDispach } = useContext(WishlistContext);
    const { cartDispach } = useContext(CartListContext);
    const { product } = props;
    let isInWishlist = findIndex( wishlist.list, product.ProductID ) ? true : false;

    useEffect( () => {
        setStickyValues( 120 );
        window.addEventListener( 'scroll', stickyContentHandle, { passive: true } );

        return () => {
            window.removeEventListener( 'scroll', stickyContentHandle );
        }
    } )

    const selectGroup = ( e ) => {
        e.preventDefault();
        e.currentTarget.parentElement.parentElement.querySelector( ".active" ) && e.currentTarget.parentElement.parentElement.querySelector( ".active" ).classList.remove( "active" );
        e.currentTarget.parentElement && e.currentTarget.parentElement.classList.add( "active" );
    }

    const addToCart = ( e ) => {
        e.preventDefault();
        let val = 1;
        if ( e.currentTarget.parentElement.parentElement.querySelector( ".horizontal-quantity" ) )
            val = parseInt( e.currentTarget.parentElement.parentElement.querySelector( ".horizontal-quantity" ).getAttribute( "value" ) );
            quickAddToCart( props.product, val, cartDispach );
    }

    const onWithWishClick = ( e ) => {
        if ( !props.isInWishlist ) {
            e.preventDefault();
            wishlistDispach( addToWishList( props.product ));
        }
    }

    return (
        <div className="col-lg-3">
            <StickyBox className="sticky-sidebar" offsetTop={ 80 }>
                <div className="skel-pro skel-sticky"></div>
                <div className="product-single-details">

                    <div className="product-filters-container mb-1">
                        <hr className="divider" />

                        <div className="product-single-filter product-single-qty">
                            <label>QTY:</label>
                            <Qty addClass='' stock={ product.Stock } />
                        </div>

                        <hr className="divider" />
                    </div>
                    <div className="product-action mb-2">

                        <Link to="#" className="btn btn-dark add-cart icon-shopping-cart mr-4" title="Add to Cart" onClick={ addToCart }>
                            <span>Add to Cart</span>
                        </Link>

                        <Link to={ `${ process.env.PUBLIC_URL }/pages/wishlist` } className={ `paction add-wishlist ${ isInWishlist === true ? 'checked' : '' }` } title={ isInWishlist ? 'Go to Wishlist' : 'Add to Wishlist' } onClick={ onWithWishClick }>
                            <span>{ isInWishlist ? 'Go to Wishlist' : 'Add to Wishlist' }</span>
                        </Link>
                    </div>
                </div>
            </StickyBox>
        </div >

    )
}


export default StickyDetail;