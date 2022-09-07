import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Carousel from '../../features/carousel';
import SidebarNav from './sidebar-nav';
// import Blog from '../blog';

// import posts from '../../../mock-data/blog';

function Sidebar() {

    function toggleSidebar() {
        let main = document.querySelector( '.main' );

        if ( main.classList.contains( 'sidebar-opened' ) ) {
            main.classList.remove( 'sidebar-opened' );
        } else {
            main.classList.add( 'sidebar-opened' );
        }
    }

    const sidebarOverlay = ( e ) => {
        document.querySelector( ".main" ).classList.toggle( "sidebar-opened" );
    }

    return (
        <>
            <div className="sidebar-overlay" onClick={ sidebarOverlay }></div>
            <div className="sidebar-toggle" onClick={ toggleSidebar }><i className="fas fa-sliders-h"></i></div>
            <aside className="sidebar-home col-lg-3 order-lg-first mobile-sidebar">
                <div className="side-menu-wrapper text-uppercase mb-2 d-none d-lg-block">
                    <h2 className="side-menu-title bg-gray ls-n-25">Browse Categories</h2>

                    <SidebarNav active={ 0 } addClass="sidebar-nav" />
                </div>

                {/* <div className="widget widget-banners px-5 pb-3 text-center">
                    <Carousel>
                        <div className="banner d-flex flex-column align-items-center">
                            <h3 className="badge-sale bg-primary d-flex flex-column align-items-center justify-content-center text-uppercase"><em className="pt-3 ls-0">Sale</em>Many Item</h3>
                            <h4 className="sale-text font1 text-uppercase m-b-3">45<sup>%</sup><sub>off</sub></h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            <Link to={ `${ process.env.PUBLIC_URL }/categories` } className="btn btn-dark btn-md font1">View Sale</Link>
                        </div>

                        <div className="banner d-flex flex-column align-items-center">
                            <h3 className="badge-sale bg-primary d-flex flex-column align-items-center justify-content-center text-uppercase"><em className="pt-3 ls-0">Sale</em>Many Item</h3>
                            <h4 className="sale-text font1 text-uppercase m-b-3">45<sup>%</sup><sub>off</sub></h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            <Link to={ `${ process.env.PUBLIC_URL }/categories` } className="btn btn-dark btn-md font1">View Sale</Link>
                        </div>

                        <div className="banner d-flex flex-column align-items-center">
                            <h3 className="badge-sale bg-primary d-flex flex-column align-items-center justify-content-center text-uppercase"><em className="pt-3 ls-0">Sale</em>Many Item</h3>
                            <h4 className="sale-text font1 text-uppercase m-b-3">45<sup>%</sup><sub>off</sub></h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            <Link to={ `${ process.env.PUBLIC_URL }/categories` } className="btn btn-dark btn-md font1">View Sale</Link>
                        </div>
                    </Carousel>
                </div> */}

                {/* <div className="widget widget-newsletters bg-gray text-center">
                    <h3 className="widget-title text-uppercase">Subscribe Newsletter</h3>
                    <p className="mb-2">Get all the latest information on Events, Sales and Offers. </p>
                    <form action="#">
                        <div className="form-group position-relative sicon-envolope-letter">
                            <input type="email" className="form-control" name="newsletter-email" placeholder="Email address" />
                        </div>
                        <input type="submit" className="btn btn-primary btn-md" value="Subscribe" />
                    </form>
                </div> */}

                {/* <div className="widget widget-testimonials">
                    <Carousel addClass="dots-left">
                        <div className="testimonial">
                            <div className="testimonial-owner">
                                <figure>
                                    <div className="lazy-overlay bg-transparent"></div>
                                    <LazyLoadImage
                                        alt="client"
                                        src={ `${ process.env.PUBLIC_URL }/assets/images/demo/clients/client-1.jpg` }
                                        threshold={ 500 }
                                        effect="blur"
                                        width={ 55 }
                                        height={ 55 }
                                    />
                                </figure>

                                <div>
                                    <h4 className="testimonial-title">john Smith</h4>
                                    <span>CEO &amp; Founder</span>
                                </div>
                            </div>

                            <blockquote className="ml-4 pr-0">
                                <p>Lorem ipsum dolor sit amet, consectetur elitad adipiscing Cras non placerat mi.</p>
                            </blockquote>
                        </div>

                        <div className="testimonial">
                            <div className="testimonial-owner">
                                <figure>
                                    <div className="lazy-overlay bg-transparent"></div>
                                    <LazyLoadImage
                                        alt="client"
                                        src={ `${ process.env.PUBLIC_URL }/assets/images/demo/clients/client-2.jpg` }
                                        threshold={ 500 }
                                        effect="blur"
                                        width={ 55 }
                                        height={ 55 }
                                    />
                                </figure>

                                <div>
                                    <h4 className="testimonial-title">Dae Smith</h4>
                                    <span>Co-founder</span>
                                </div>
                            </div>

                            <blockquote className="ml-4 pr-0">
                                <p>Lorem ipsum dolor sit amet, consectetur elitad adipiscing Cras non placerat mi.</p>
                            </blockquote>
                        </div>

                        <div className="testimonial">
                            <div className="testimonial-owner">
                                <figure>
                                    <div className="lazy-overlay bg-transparent"></div>
                                    <LazyLoadImage
                                        alt="client"
                                        src={ `${ process.env.PUBLIC_URL }/assets/images/demo/clients/client-3.jpg` }
                                        threshold={ 500 }
                                        effect="blur"
                                        width={ 55 }
                                        height={ 55 }
                                    />
                                </figure>

                                <div>
                                    <h4 className="testimonial-title">John Doe</h4>
                                    <span>CEO &amp; Founder</span>
                                </div>
                            </div>

                            <blockquote className="ml-4 pr-0">
                                <p>Lorem ipsum dolor sit amet, consectetur elitad adipiscing Cras non placerat mi.</p>
                            </blockquote>
                        </div>
                    </Carousel>
                </div> */}

                {/* <div className="widget widget-posts post-date-in-media">
                    <Carousel addClass="dots-left dots-m-0" settings={ { margin: 20 } }>
                        {
                            posts.slice( 4, 7 ).map( ( blog, index ) => (
                                <Blog blog={ blog } key={ index } />
                            ) )
                        }
                    </Carousel>
                </div> */}
            </aside>
        </>
    )
}

export default Sidebar;
