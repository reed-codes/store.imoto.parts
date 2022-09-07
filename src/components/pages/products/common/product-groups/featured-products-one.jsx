import React,{useContext} from 'react';

import ProductTypeTwo from '../../../../features/product/product-type-two';
import Carousel from '../../../../features/carousel';

import { productFilter } from '../../../../../utils';
import { owlSetting1 } from '../../../../../utils/settings';

import {PricelistContext} from '../../../../../store/PricelistContext'

function FeaturedProductsOne( props ) {
    const { pricelistState } = useContext(PricelistContext);
    const { addClass, isContainer = true, link = "default" } = props;
    let featured = productFilter( pricelistState.pricelist, "featured" );

    return (
        <section className={ `products-section ${ addClass }` }>
            <div className={ isContainer ? 'container' : 'container-fluid' }>
                <h2 className="carousel-title">Related Products</h2>
                <Carousel addClass="product-intro" settings={ owlSetting1 }>
                    {
                        featured.slice( 0, 5 ).map( ( item, index ) => (
                            <ProductTypeTwo addClass="inner-quickview inner-icon" product={ item } link={ link } key={ "product-type-2" + index } />
                        ) )
                    }
                </Carousel>
            </div>
        </section>
    )
}

export default FeaturedProductsOne