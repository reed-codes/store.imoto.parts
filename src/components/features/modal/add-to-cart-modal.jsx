import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

import { HIDE_CART_MODAL } from '../../../constants/action-types'

import { CartWishListContext } from '../../../store/CartWishlistContext';

Modal.setAppElement( '#root' );

function AddToCartModal( ) {
    const {cartWishList, cartWishListDispach} = useContext(CartWishListContext);
    const product = cartWishList.modalProduct ? cartWishList.modalProduct : [];
    const showModal = cartWishList.showModal ? cartWishList.showModal : false;

    const handleHideCartModal = ()=>{
        cartWishListDispach( { type: HIDE_CART_MODAL } );
    }

    function close() {
        document.querySelector( ".add-cart-modal" ) && ( document.querySelector( ".add-cart-modal" ).style.opacity = 0 );
        setTimeout( () => {
            handleHideCartModal();
        }, 40 );
    }

    function afterOpenModal() {
        if ( document.querySelector( ".add-cart-modal" ) ) {
            document.querySelector( ".add-cart-modal" ).style.opacity = 1;
            document.querySelector( ".add-cart-modal .modal-dialog" ).style.transform = "translate(0,0)";
        }
    }

    const closeModal = ( e ) => {
        e.preventDefault();
        close();
    }


    return (
        <Modal
            isOpen={ showModal }
            onRequestClose={ close }
            contentLabel="addCartModal"
            className="add-cart-modal modal"
            id="addCartModal"
            shouldFocusAfterRender={ false }
            portalClassName="ReactModalPortal add-to-cart-portal"
            overlayClassName="cart-modal-overlay"
            onAfterOpen={ afterOpenModal }
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body add-cart-box text-center">
                        <p>You've just added this product to the<br />cart:</p>
                        <h4 id="productTitle">{ product ? product.Description : '' }</h4>
                        <img src={ product.ImageURL ? product.ImageURL[ 0 ]  : '' } id="productImage" width="100" height="100" alt="adding cart" />

                        <div className="btn-actions">
                            <Link to={ `${ process.env.PUBLIC_URL }/pages/cart` }><button className="btn-primary">Go to cart page</button></Link>
                            <Link to="#" onClick={ closeModal }><button className="btn-primary">Continue</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )

}

export default AddToCartModal;