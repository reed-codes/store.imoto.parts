import React, { useContext } from 'react';

import ProductTypeFour from '../../../../features/product/product-type-four';
import Carousel from '../../../../features/carousel';

import { productFilter } from '../../../../../utils';

import {PricelistContext} from '../../../../../store/PricelistContext';

function FeaturedProductsTwo( props ) {
    const { pricelistState } = useContext(PricelistContext);
    const { link = "default" } = props;
    let featured = productFilter( pricelistState.pricelist, "featured" );

    return (
        <div className="widget widget-featured">
            <h3 className="widget-title">Featured</h3>

            <div className="widget-body">
                <Carousel addClass="widget-featured-products" isTheme={ false } settings={ { nav: true } }>
                    <div className="featured-col">
                        {
                            featured.slice( 0, 3 ).map( ( item, index ) => (
                                <ProductTypeFour addClass="left-details product-widget" link={ link } product={ item } key={ "product-type-4" + index } />
                            ) )
                        }
                    </div>
                    <div className="featured-col">
                        {
                            featured.slice( 3, 6 ).map( ( item, index ) => (
                                <ProductTypeFour addClass="left-details product-widget" link={ link } product={ item } key={ "product-type" + index } />
                            ) )
                        }
                    </div>
                </Carousel>
            </div>
        </div>
    )
}

export default FeaturedProductsTwo;