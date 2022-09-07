import React from 'react';

function ShippingMethods(props) {
    return (
        <div className="checkout-step-shipping">
            <h2 className="step-title">Shipping Methods</h2>

            <table className="table table-step-shipping">
                <tbody>
                    <tr>
                        <td><input checked type="radio" name="shipping-method" value="flat" onChange={() => props.sellectShippingMethod("Flat Rate - Fixed")}/></td>
                        <td><strong>$20.00</strong></td>
                        <td>Fixed</td>
                        <td>Flat Rate</td>
                    </tr>

                    <tr>
                        <td><input type="radio" name="shipping-method" value="best" onChange={() => props.sellectShippingMethod("Table Rate - Best Way")}/></td>
                        <td><strong>$15.00</strong></td>
                        <td>Table Rate</td>
                        <td>Best Way</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default React.memo( ShippingMethods );