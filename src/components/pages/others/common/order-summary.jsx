import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SlideToggle } from 'react-slide-toggle';

import { CartWishListContext } from '../../../../store/CartWishlistContext';
import { getCartTotal } from '../../../../utils';

const OrderSummary = () => {
  const { cartWishList } = useContext(CartWishListContext);
  const cartItems = cartWishList.cart ? cartWishList.cart : [];

  return (
    <SlideToggle collapsed={ true }>
      {( { onToggle, setCollapsibleElement, toggleState } ) => (
        <div className="order-summary">
          <h3>Summary</h3>
          <table className="table table-totals">
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>${getCartTotal(cartItems).toFixed(2)}</td>
              </tr>

              <tr>
                <td>Tax</td>
                <td>$0.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Order Total</td>
                <td>${getCartTotal(cartItems).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <h4>
            <Link
              to="#"
              data-toggle="collapse"
              onClick={ onToggle }
              className={ toggleState.toLowerCase() }
            >
              { cartItems.length } Products in Cart
            </Link>
          </h4>

          <div
            className="collapse show"
            ref={ setCollapsibleElement }
            style={ { overflow: 'hidden' } }
            id="order-cart-section"
          >
            <table className="table table-mini-cart">
              <tbody>
                {cartItems.map( ( item, index ) => (
                  <tr key={ "cart-item" + index }>
                    <td className="product-col">
                      <figure className="product-image-container">
                        <Link
                          to={ `${ process.env.PUBLIC_URL }/products/default/${ item.ProductInfo.ProductID }` }
                          className="product-image"
                        >
                          <img
                            style={{ objectFit: "cover", height: "100%" }}
                            src={ item.ProductInfo.ImageURL[ 0 ] }
                            alt="product"
                          />
                        </Link>
                      </figure>
                      <div>
                        <h2 className="product-title">
                          <Link
                            to={ `${ process.env.PUBLIC_URL }/products/default/${ item.ProductInfo.ProductID }` }
                          >
                            { item.ProductInfo.Description }
                          </Link>
                        </h2>
                        <span className="product-qty">Qty:  {item.Quantity}</span>
                      </div>
                    </td>
                    <td className="price-col">${ (item.ProductInfo.Price * item.Quantity).toFixed( 2 ) }</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SlideToggle>
  )
}

export default OrderSummary;