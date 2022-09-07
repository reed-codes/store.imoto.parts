import React from 'react';

const Alert = ({ open, close, type, message }) => (
    <>
        {open &&
            <div
                className={`alert alert-${type} d-flex  alert-dismissible fade show`}
                role="alert"
                style = {{ marginBottom : 0 }}

            >
                <AlertIcon type={type} />
                <b> {message} </b>
                <button
                    title="Close (Esc)"
                    type="button"
                    className="mfp-close"
                    style = {{ marginTop : 3 }}
                    onClick={ close }
                >
                    ×
                </button>
            </div>
        }
    </>
);

const AlertIcon = ({ type }) => {
    switch (type) {
        case 'info':
            return(
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 10 }} fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
            );
        case 'success':
            return(
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 10 }} fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
            );
        case 'warning':
            return(
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 10 }} fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
            );
        case 'danger':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 10 }} fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
            );
        default: return null;
    }
}

export default Alert;