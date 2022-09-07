import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SlideToggle } from 'react-slide-toggle';

//Import Utils
import { isIEBrowser } from '../../utils';

function MobileMenu() {
    const [ path, setPath ] = useState( "" );

    useEffect( () => {
        setPath( window.location.pathname );
    } )

    useEffect( () => {
        document.querySelector( ".mobile-menu-overlay" ).addEventListener( "click", closeMobileMenu );
        document.querySelector( ".mobile-menu-close" ).addEventListener( "click", closeMobileMenu );

        return () => {
            if ( document.querySelector( "body" ).classList.contains( "mmenu-active" ) ) {
                document.querySelector( "body" ).classList.remove( "mmenu-active" );
            }
        }
    } )

    const closeMobileMenu = ( e ) => {
        e.preventDefault();
        document.querySelector( "body" ).classList.remove( "mmenu-active" );
        if ( document.querySelector( ".menu-toggler" ) ) {
            document.querySelector( ".menu-toggler" ).classList.remove( "active" );
        }

        if ( isIEBrowser() && !document.querySelector( "body" ).classList.contains( "mmenu-active" ) ) {
            document.querySelector( ".mobile-menu-container" ).style.transform = "translateX(-100%)";
        }
    }
    return (
        <>
            <div className="mobile-menu-overlay"></div>
            <div className="mobile-menu-container">
                <div className="mobile-menu-wrapper">
                    <span className="mobile-menu-close"><i className="icon-cancel"></i></span>
                    <nav className="mobile-nav">
                        <ul className="mobile-menu">
                            <li className={ path === process.env.PUBLIC_URL + '/' ? 'active' : '' }><Link to={ `${ process.env.PUBLIC_URL }` }>Home</Link></li>

                            <SlideToggle collapsed={ true }>
                                {
                                    ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                        <li className={ path.indexOf( "categories/" ) > -1 ? 'active' : '' }>
                                            <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Categories
                                                <span className="mmenu-btn"></span>
                                            </Link>
                                            <ul ref={ setCollapsibleElement }>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/full-width` }>Fullwidth Banner</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/boxed-slider` }>Boxed Slider Banner</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/boxed-image` }>Boxed Image Banner</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/sidebar-left` }>Left Sidebar</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/sidebar-right` }>Right Sidebar</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/flex-grid` }>Product Flex Grid</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/horizontal-filter1` }>Horizontal Filter1</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/horizontal-filter2` }>Horizontal Filter2</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/list` }>Product List Item Types</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/infinite-scroll` }>Ajax Infinite Scroll</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/3cols` }>3 Columns Products</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/4cols` }>4 Columns Products</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/5cols` }>5 Columns Products</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/6cols` }>6 Columns Products</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/7cols` }>7 Columns Products</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/categories/8cols` }>8 Columns Products</Link></li>
                                            </ul>
                                        </li>

                                    )
                                }
                            </SlideToggle>
                            <SlideToggle collapsed={ true }>
                                {
                                    ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                        <li className={ path.indexOf( "products/" ) > -1 ? 'active' : '' }>
                                            <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Products
                                            <span className="mmenu-btn"></span>
                                            </Link>
                                            <ul ref={ setCollapsibleElement }>
                                                <SlideToggle collapsed={ true }>
                                                    {
                                                        ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                                            <li>
                                                                <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Variations
                                                                <span className="mmenu-btn"></span>
                                                                </Link>
                                                                <ul ref={ setCollapsibleElement }>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/horizontal/14` }>Horizontal Thumbnails</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/vertical/14` }>Vertical Thumbnails</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/zoom/14` }>Inner Zoom</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/cart-sticky/14` }>Addtocart Sticky</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/accordion/14` }>Accordion Tabs</Link></li>
                                                                </ul>
                                                            </li>
                                                        )
                                                    }
                                                </SlideToggle>
                                                <SlideToggle collapsed={ true }>
                                                    {
                                                        ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                                            <li>
                                                                <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Variations
                                                                <span className="mmenu-btn"></span>
                                                                </Link>
                                                                <ul ref={ setCollapsibleElement }>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/sticky-tab/14` }>Sticky Tabs</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/simple/14` }>Simple Product</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/sidebar-left/14` }>With Left Sidebar</Link></li>
                                                                </ul>
                                                            </li>
                                                        )
                                                    }
                                                </SlideToggle>
                                                <SlideToggle collapsed={ true }>
                                                    {
                                                        ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                                            <li>
                                                                <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Product Layout Types
                                                                <span className="mmenu-btn"></span>
                                                                </Link>
                                                                <ul ref={ setCollapsibleElement }>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/default/14` }>Default Layout</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/extended/14` }>Extended Layout</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/full-width/14` }>Full Width Layout</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/grid/14` }>Grid Images Layout</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/sticky-both/14` }>Sticky Both Side Info</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/sticky-info/14` }>Sticky Right Side Info</Link></li>
                                                                </ul>
                                                            </li>
                                                        )
                                                    }
                                                </SlideToggle>
                                            </ul>
                                        </li>
                                    )
                                }
                            </SlideToggle>
                            <SlideToggle collapsed={ true }>
                                {
                                    ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                        <li className={ `sf-with-ul ${ path.indexOf( "pages/" ) > -1 ? 'active' : '' }` }>
                                            <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Pages
                                                <span className="mmenu-btn"></span>
                                            </Link>
                                            <ul ref={ setCollapsibleElement }>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/cart` }>Shopping Cart</Link></li>
                                                <SlideToggle collapsed={ true }>
                                                    {
                                                       
                                                       ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                                            <li>
                                                                <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Checkout
                                                                <span className="mmenu-btn"></span>
                                                                </Link>
                                                                <ul ref={ setCollapsibleElement }>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/checkout/shipping/one` }>Checkout Shipping</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/checkout/shipping/two` }>Checkout Shipping 2</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/checkout/review` }>Checkout Review</Link></li>
                                                                </ul>
                                                            </li>
                                                        )
                                                   
                                                   }
                                                </SlideToggle>
                                                <SlideToggle collapsed={ true }>
                                                    {
                                                        ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                                            <li>
                                                                <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Dashboard
                                                                <span className="mmenu-btn"></span>
                                                                </Link>
                                                                <ul ref={ setCollapsibleElement }>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/dashboard/board` }>Dashboard</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/dashboard/account` }>My Account</Link></li>
                                                                </ul>
                                                            </li>
                                                        )
                                                    }
                                                </SlideToggle>

                                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/about` }>About Us</Link></li>
                                                <SlideToggle collapsed={ true }>
                                                    {
                                                        ( { onToggle, setCollapsibleElement, toggleState } ) => (
                                                            <li>
                                                                <Link to="#" data-toggle="collapse" onClick={ onToggle } className={ toggleState.toLowerCase() }>Blog<span className="mmenu-btn"></span></Link>
                                                                <ul ref={ setCollapsibleElement }>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/blog` }>Blog</Link></li>
                                                                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/single/2` }>Blog Post</Link></li>
                                                                </ul>
                                                            </li>
                                                        )
                                                    }
                                                </SlideToggle>

                                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/wishlist` }>Wishlist</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/login` } className="login-link">Login</Link></li>
                                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/password` }>Forgot Password</Link></li>
                                            </ul>
                                        </li>
                                    )
                                }
                            </SlideToggle>

                            <li><Link to="https://1.envato.market/DdLk5" rel="noopener noreferrer" target="_blank">Buy Porto!</Link></li>
                        </ul>
                    </nav>

                    <div className="social-icons">
                        <Link to="#" className="social-icon" target="_blank"><i className="icon-facebook"></i></Link>
                        <Link to="#" className="social-icon" target="_blank"><i className="icon-twitter"></i></Link>
                        <Link to="#" className="social-icon" target="_blank"><i className="icon-instagram"></i></Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileMenu;