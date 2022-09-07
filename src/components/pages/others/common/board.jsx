import React from 'react';
import { Link } from 'react-router-dom';

function Board() {
    return (
        <div>
            <h2>My Dashboard</h2>

            <div className="alert alert-success alert-intro" role="alert">
                Thank you for registering with Porto - Premium Template.
        </div>

            <div className="alert alert-success" role="alert">
                Hello, <strong>Porto customer!</strong> From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information. Select a link below to view or edit information.
        </div>

            <div className="mb-4"></div>

            <h3>Account Information</h3>

            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            Contact Information
                        <Link to="#" className="card-edit">Edit</Link>
                        </div>

                        <div className="card-body">
                            <p>
                                John Doe<br />
                            porto_shop@gmail.com<br />
                                <Link to="#">Change Password</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            newsletters
                        <Link to="#" className="card-edit">Edit</Link>
                        </div>

                        <div className="card-body">
                            <p>
                                You are currently not subscribed to any newsletter.
                        </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    Address Book
                <Link to="#" className="card-edit">Edit</Link>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h4 className="">Default Billing Address</h4>
                            <address>
                                You have not set a default billing address.<br />
                                <Link to="#">Edit Address</Link>
                            </address>
                        </div>
                        <div className="col-md-6">
                            <h4 className="">Default Shipping Address</h4>
                            <address>
                                You have not set a default shipping address.<br />
                                <Link to="#">Edit Address</Link>
                            </address>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo( Board );