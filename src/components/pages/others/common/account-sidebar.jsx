import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const boards = [ "board", "account", "order", "address", "billing", "profile" ];

function AccountSidebar( props ) {
    useEffect( () => {
        const index = boards.indexOf( props.board );
        if ( index >= 0 ) changeActive( index );
    }, [] )

    useEffect( () => {
        const index = boards.indexOf( props.board );
        if ( index >= 0 ) changeActive( index );
    } )

    const changeActive = ( index ) => {
        let list = document.querySelector( ".dashboard-sidebar .list" );
        if ( list.querySelector( ".active" ) )
            list.querySelector( ".active" ).classList.remove( "active" );
        list.childNodes[ index ].classList.add( "active" );
    }

    return (
        <aside className="dashboard-sidebar mobile-sidebar col-lg-3">
            <div className="widget widget-dashboard">
                <h3 className="widget-title">My Account</h3>

                <ul className="list">
                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/dashboard/board` } >Account Dashboard</Link></li>
                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/dashboard/account` }>Account Information</Link></li>
                    <li><Link to= {`${ process.env.PUBLIC_URL }/pages/dashboard/addresses`}>Address Book</Link></li>
                    <li><Link to="#">Orders History</Link></li>
                    {/* <li><Link to="#">Billing Agreements</Link></li> */}
                    {/* <li><Link to="#">Recurring Profiles</Link></li> */}
                    <li><Link to="#">My Product Reviews</Link></li>
                    {/* <li><Link to="#">My Tags</Link></li> */}
                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/wishlist` }>My Cart</Link></li>
                    <li><Link to={ `${ process.env.PUBLIC_URL }/pages/wishlist` }>My Wishlist</Link></li>
                    {/* <li><Link to="#">My Applications</Link></li> */}
                    {/* <li><Link to="#">Newsletter Subscriptions</Link></li> */}
                    {/* <li><Link to="#">My Downloadable Products</Link></li> */}
                </ul>
            </div>
        </aside>
    )
}

export default React.memo( AccountSidebar );
