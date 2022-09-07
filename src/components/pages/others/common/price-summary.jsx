import React, { useContext } from 'react';

import { CartWishListContext } from '../../../../store/CartWishlistContext';
import { getCartTotal } from '../../../../utils';

const PriceSummary = () => {
  const { cartWishList } = useContext(CartWishListContext);
  const cartItems = cartWishList.cart ? cartWishList.cart : [];

  return (
    <div className="order-summary" style={{margin: 0, marginLeft: 10,padding: 0, background:"#fff", border: "none"}}>
        <table className="table table-totals" >
        <tbody>
            <tr>
            <td>Subtotal</td>
            <td className="price-box">${getCartTotal(cartItems).toFixed(2)}</td>
            </tr>

            <tr>
            <td>Tax</td>
            <td className="price-box">$0.00</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
            <td>Order Total</td>
            <td className="price-box">${getCartTotal(cartItems).toFixed(2)}</td>
            </tr>
        </tfoot>
        </table>
    </div>
  )
}

export default PriceSummary;