import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Carousel from '../../features/carousel';
import { owlSetting8 } from '../../../utils/settings';


const AdBannerSlider = () => {
  return (
    <div className="container">

    <div className="banners-container">
        <Carousel addClass="banners-slider owl-carousel owl-theme" settings={ owlSetting8 }>
            <div className="banner banner1 banner-sm-vw">
                <figure>
                    <div className="lazy-overlay bg-3"></div>
                    <LazyLoadImage
                        alt="banner"
                        src={ `${process.env.PUBLIC_URL}/assets/images/demo/banners/banner-1.jpg` }
                        threshold={ 500 }
                        effect="blur"
                        width={ 400 }
                        height={ 200 }
                    />
                </figure>
                <div className="banner-layer banner-layer-middle">
                    <h3 className="m-b-2">Porto Watches</h3>
                    <h4 className="m-b-3 ls-10 text-primary"><sup className="text-dark"><del>20%</del></sup>30%<sup>OFF</sup></h4>
                    <Link to={ `${process.env.PUBLIC_URL}/categories/full-width` } className="btn btn-sm btn-dark ls-10">Shop Now</Link>
                </div>
            </div>

            <div className="banner banner2 banner-sm-vw text-uppercase">
                <figure>
                    <div className="lazy-overlay bg-3"></div>
                    <LazyLoadImage
                        alt="banner"
                        src={ `${process.env.PUBLIC_URL}/assets/images/demo/banners/banner-2.jpg` }
                        threshold={ 500 }
                        effect="blur"
                        width={ 400 }
                        height={ 200 }
                    />
                </figure>
                <div className="banner-layer banner-layer-middle text-center">
                    <div className="row align-items-lg-center">
                        <div className="col-lg-7 text-lg-right">
                            <h3 className="m-b-1">Deal Promos</h3>
                            <h4 className="pb-4 pb-lg-0 mb-0 text-body">Starting at $99</h4>
                        </div>
                        <div className="col-lg-5 text-lg-left px-0 px-xl-3">
                            <Link to={ `${process.env.PUBLIC_URL}/categories/full-width` } className="btn btn-sm btn-dark ls-10">Shop Now</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="banner banner3 banner-sm-vw">
                <figure>
                    <div className="lazy-overlay bg-3"></div>
                    <LazyLoadImage
                        alt="banner"
                        src={ `${process.env.PUBLIC_URL}/assets/images/demo/banners/banner-3.jpg` }
                        threshold={ 500 }
                        effect="blur"
                        width={ 400 }
                        height={ 200 }
                    />
                </figure>
                <div className="banner-layer banner-layer-middle text-right">
                    <h3 className="m-b-2">Handbags</h3>
                    <h4 className="m-b-2 text-secondary text-uppercase">Starting at $99</h4>
                    <Link to={ `${process.env.PUBLIC_URL}/categories/full-width` } className="btn btn-sm btn-dark ls-10">Shop Now</Link>
                </div>
            </div>
        </Carousel>
    </div>
</div>
  )
}

export default AdBannerSlider