import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const AddressModal = (props) => {
    const {
        open,
        handleCloseModal,
        handleSaveAddressClicked,
        address,
        handleChangeAddress
    } = props;

    return (
      <Modal
        isOpen={ open }
        onRequestClose={ handleCloseModal }
        shouldFocusAfterRender={ false }
        contentLabel="Shipping Address Modal"
        className="shipping-popup"
        id="shipping-address-form"
        overlayClassName="cart-modal-overlay"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form action="#" style={ { marginBottom: '0' } }>
              <div className="modal-header">
                <h3
                  className="modal-title"
                  id="addressModalLabel"
                >
                  Delivery Address
                </h3>
                <button
                  type="button"
                  className="close"
                  onClick={ handleCloseModal }
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body custom-scrollbar">

              <div className="modal-wrapper"/>
                <div className="row">
                    <div className="col-md-12">
                        <div style={{width: "100%", maxWidth: "unset"}} className="form-group form-group-sm">
                            <label>Address Type<span className="required">*</span></label>
                            <div style={{width: "100%"}} className="select-custom">
                                <select name="Type" value={address.Type} onChange={(e) => handleChangeAddress(e) } className="form-control form-control-sm" >
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Industrial">Industrial</option>
                                </select>
                            </div>
                        </div>

                        <label>Street Address <span className="required">*</span></label>
                        <input name="Address1" value={address.Address1} onChange={(e) => handleChangeAddress(e)} type="address" className="form-input form-wide mb-2" required/>

                        <label>Address Line 2 <span className="required">*</span></label>
                        <input name="Address2" value={address.Address2} onChange={(e) => handleChangeAddress(e)} type="text" className="form-input form-wide mb-2" required/>

                        <label>City/Town<span className="required">*</span></label>
                        <input name="Address3" value={address.Address3} onChange={(e) => handleChangeAddress(e)} type="text" className="form-input form-wide mb-2" required/>

                        <label>Province/State<span className="required">*</span></label>
                        <input name="Address4" value={address.Address4} onChange={(e) => handleChangeAddress(e)} type="text" className="form-input form-wide mb-2" required/>

                        <label>Zip Code<span className="required">*</span></label>
                        <input name="Address5" value={address.Address5} onChange={(e) => handleChangeAddress(e)} type="zip" className="form-input form-wide mb-2" required/>
                    </div>
                </div>
              </div>

              <div className="modal-footer">                
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={ handleCloseModal }
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={ handleSaveAddressClicked }
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
          
    );
}

export default AddressModal;