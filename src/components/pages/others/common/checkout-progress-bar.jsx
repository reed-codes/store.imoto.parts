import React from 'react';

function CheckoutProgessBar( props ) {
    const { active = 1 } = props;

    return (
        <ul className="checkout-progress-bar">
            <li className={ active === 1 ? 'active' : '' }>
                <span>Delivery Address</span>
            </li>
            <li className={ active === 2 ? 'active' : '' }>
                <span>Order Details</span>
            </li>
            <li className={ active === 3 ? 'active' : '' }>
                <span>Review &amp; Payments</span>
            </li>
            <li className={ active === 4 ? 'active' : '' }>
                <span>Order Placed</span>
            </li>
        </ul>
    )
}

export default React.memo( CheckoutProgessBar );