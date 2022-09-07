import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function SidebarNav( props ) {

    useEffect( () => {
        let mainNav = document.querySelector( ".side-nav .menu" );
        if ( mainNav.querySelector( ".active" ) )
            mainNav.querySelector( ".active" ).classList.remove( "active" );

        if ( props.active >= 0 )
            mainNav.childNodes[ props.active ].classList.add( "active" );
    } )

    return (
        <nav className="side-nav">
            <ul className="menu menu-vertical sf-arrows">
                <li className="active"><Link to={ `${ process.env.PUBLIC_URL }/` }><i className="icon-home"></i>Home</Link></li>
                <li>
                    <Link to={ `${ process.env.PUBLIC_URL }/categories/full-width` } className="sf-with-ul"><i className="sicon-badge"></i>Categories</Link>
                    <div className="megamenu megamenu-fixed-width megamenu-3cols">
                        <div className="row">
                            <div className="col-lg-4">
                                <Link to="#" className="nolink">VARIATION 1</Link>
                                <ul className="submenu">
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/full-width` }>Fullwidth Banner</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/boxed-slider` }>Boxed Slider Banner</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/boxed-image` }>Boxed Image Banner</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/sidebar-left` }>Left Sidebar</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/sidebar-right` }>Right Sidebar</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/flex-grid` }>Product Flex Grid</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/horizontal-filter1` }>Horizontal Filter1</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/horizontal-filter2` }>Horizontal Filter2</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-4">
                                <Link to="#" className="nolink">VARIATION 2</Link>
                                <ul className="submenu">
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/list` }>Product List Item Types</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/infinite-scroll` }>Ajax Infinite Scroll</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/3cols` }>3 Columns Products</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/4cols` }>4 Columns Products </Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/5cols` }>5 Columns Products</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/6cols` }>6 Columns Products</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/7cols` }>7 Columns Products</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/categories/8cols` }>8 Columns Products</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-4 p-0">
                                <img src={ `${ process.env.PUBLIC_URL }/assets/images/demo/menu-banner.jpg` } alt="Menu banner" />
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <Link to={ `${ process.env.PUBLIC_URL }/products/default/15` } className="sf-with-ul"><i className="sicon-basket"></i>Products</Link>
                    <div className="megamenu megamenu-fixed-width">
                        <div className="row">
                            <div className="col-lg-3">
                                <Link to="#" className="nolink">Variations 1</Link>
                                <ul className="submenu">
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/horizontal/15` }>Horizontal Thumbnails</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/vertical/15` }>Vertical Thumbnails</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/zoom/15` }>Inner Zoom</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/cart-sticky/15` }>Addtocart Sticky</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/accordion/15` }>Accordion Tabs</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-3">
                                <Link to="#" className="nolink">Variations 2</Link>
                                <ul className="submenu">
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/sticky-tab/15` }>Sticky Tabs</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/simple/15` }>Simple Product</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/sidebar-left/15` }>With Left Sidebar</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-3">
                                <Link to="#" className="nolink">Product Layout Types</Link>
                                <ul className="submenu">
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/default/15` }>Default Layout</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/extended/15` }>Extended Layout</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/full-width/15` }>Full Width Layout</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/grid/15` }>Grid Images Layout</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/sticky-both/15` }>Sticky Both Side Info</Link></li>
                                    <li><Link to={ `${ process.env.PUBLIC_URL }/products/sticky-info/15` }>Sticky Right Side Info</Link></li>
                                </ul>
                            </div>

                            <div className="col-lg-3 p-0">
                                <img src={ `${ process.env.PUBLIC_URL }/assets/images/demo/menu-bg.png` } alt="Menu banner" className="product-promo" />
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <Link to={ `${ process.env.PUBLIC_URL }/pages/cart` } className="sf-with-ul"><i className="sicon-envelope"></i>Pages</Link>

                    <ul>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/pages/cart` }>Shopping Cart</Link></li>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/pages/checkout/shipping/one` } className="sf-with-ul">Checkout</Link>
                            <ul>
                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/checkout/shipping/one` }>Checkout Shipping</Link></li>
                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/checkout/shipping/two` }>Checkout Shipping 2</Link></li>
                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/checkout/review` }>Checkout Review</Link></li>
                            </ul>
                        </li>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/pages/dashboard/board` } className="sf-with-ul">Dashboard</Link>
                            <ul>
                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/dashboard/board` }>Dashboard</Link></li>
                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/dashboard/account` }>My Account</Link></li>
                            </ul>
                        </li>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/pages/about` }>About Us</Link></li>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/pages/blog` } className="sf-with-ul">Blog</Link>
                            <ul>
                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/blog` }>Blog</Link></li>
                                <li><Link to={ `${ process.env.PUBLIC_URL }/pages/single/2` }>Blog Post</Link></li>
                            </ul>
                        </li>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/pages/contact` }>Contact Us</Link></li>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/pages/login` } className="login-link">Login</Link></li>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/pages/password` }>Forgot Password</Link></li>
                    </ul>
                </li>
                <li>
                    <Link to={ `${ process.env.PUBLIC_URL }/element/` } className="sf-with-ul"><i className="sicon-book-open"></i>Features</Link>
                    <ul>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/element/products` }>Products</Link></li>
                        <li><Link to={ `${ process.env.PUBLIC_URL }/element/products-category` }>Product Categories</Link></li>
                    </ul>
                </li>
                <li><Link to="#"><i className="sicon-users"></i>About Us</Link></li>
                <li><Link to="#"><i className="icon-cat-gift"></i>Special Offer!</Link></li>
                <li><Link to="https://1.envato.market/DdLk5" target="_blank"><i className="sicon-star"></i>Buy Porto!<span className="tip tip-hot">Hot</span></Link></li>
            </ul>
        </nav>
    )
}

export default SidebarNav;

