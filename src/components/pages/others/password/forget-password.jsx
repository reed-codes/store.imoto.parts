import React from 'react';
import { Helmet } from 'react-helmet';

import Breadcrumb from '../../../common/breadcrumb';

function ForgetPassword() {
    return (
        <>
            <Helmet>
                <title>Porto React Ecommerce - Forget Password Page </title>
            </Helmet>

            <h1 className="d-none">Porto React Ecommerce - Forget Password Page</h1>

            <div className="main">
                <div className="page-header page-header-bg" style={ { background: `#EDEFEC no-repeat 60%/cover url('${ process.env.PUBLIC_URL }/assets/images/demo/page-header-bg.jpg')` } }>
                    <div className="container">
                        <h1 className="mb-0">Reset Password</h1>
                    </div>
                </div>

                <Breadcrumb current="Forgot Password" />

                <div className="container">
                    <div className="col-lg-6 mx-auto mt-4">
                        <div className="heading mb-4">
                            <h2 className="title">Reset Password</h2>
                            <p>Please enter your email address below to receive a password reset link.</p>
                        </div>

                        <form action="#">
                            <div className="form-group required-field">
                                <label htmlFor="reset-email">Email</label>
                                <input type="email" className="form-control" id="reset-email" name="reset-email" required />
                            </div>
                            <div className="form-footer">
                                <button type="submit" className="btn btn-primary">Reset My Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgetPassword;