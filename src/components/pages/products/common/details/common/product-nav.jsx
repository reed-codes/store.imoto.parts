import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { PricelistContext } from '../../../../../../store/PricelistContext'

function ProductNav( props ) {
    const { pricelistState } = useContext(PricelistContext); 
    const products = pricelistState.pricelist ? pricelistState.pricelist : []
    const { link = "default", toDefault = false, product, addClass = "mb-3" } = props;

    let index = products.indexOf( product );
    const prevProduct = products[ index - 1 ],
        nextProduct = products[ index + 1 ];

    return (
        <div className={ `product-nav d-flex ${ addClass }` }>
            <div className="product-prev">
                {
                    prevProduct ?
                        <Link to={ toDefault ? `${ process.env.PUBLIC_URL }/products/default/15` : `${ process.env.PUBLIC_URL }/products/${ link }/${ prevProduct.ProductID }` }>
                            <span className="product-link"></span>
                            <span className="product-popup">
                                <span className="box-content">
                                    <span className="product-image">
                                        <span className="inner">
                                            <img width="150" height="150" src={ `${ process.env.PUBLIC_URL }/${ prevProduct.ImageURL[ 0 ] }` } alt="product" />
                                        </span>
                                    </span>
                                    <span className="product-details">
                                        <span className="product-title">
                                            { prevProduct.Description }
                                        </span>
                                    </span>
                                </span>
                            </span>
                        </Link>
                        : <span className="product-link disabled"></span>
                }
            </div>
            <div className="product-next">
                {
                    nextProduct ?
                        <Link to={ toDefault ? `${ process.env.PUBLIC_URL }/products/default/15` : `${ process.env.PUBLIC_URL }/products/${ link }/${ nextProduct.ProductID }` }>
                            <span className="product-link"></span>
                            <span className="product-popup">
                                <span className="box-content">
                                    <span className="product-image">
                                        <span className="inner">
                                            <img width="150" height="150" src={ `${ process.env.PUBLIC_URL }/${ nextProduct.ImageURL[ 0 ] }` } alt="product" />
                                        </span>
                                    </span>
                                    <span className="product-details">
                                        <span className="product-title">
                                            { nextProduct.Description }
                                        </span>
                                    </span>
                                </span>
                            </span>
                        </Link>
                        : <span className="product-link disabled"></span>
                }
            </div>
        </div>
    )
}

export default ProductNav;