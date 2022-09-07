import React from "react";
import Modal from "react-modal";

import FancyEditBox from "../fancy-edit-box";
import FancyEditBoxHeader from "../fancy-edit-box-header";

import { PREDEFINED_ICONS } from "../../../../../utils/icons";
import Alert from "../../../../common/alert";

const DELETE_CONFIRM_STYLES = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
    maxWidth: "600px",
    marginRight: "2rem",
    backgroundColor: "#fff"
  }
};

const EDIT_MODAL_ICON_STYLE = {
  border: "dashed",
  display: "flex",
  textAlign: 'center',
  justifyContent: "center",
  alignItems: "center",
  fontSize: 60,
  margin: 0,
  borderRadius: "50%",
  cursor: 'pointer',
  height: 100,
  width: 100,
  minHeight: 100,
  minWidth: 100,
  maxHeight: 100,
  maxWidth: 100,
  color: "#08C",
}

export const AddFeatureModal = (props) => {
  return (
    <FancyEditBox handleClose={props.handleCloseModal}>
      <section className="feature-boxes-container" style={{padding: 0,}}>    
        <div className="container">
          <FancyEditBoxHeader
            title={props.addingFeatureBox ? "Adding Feature Box" : "Editing Feature Box" }
            handleClose={props.handleCloseModal}
          />
          <div className="row">
            <div
              className="col-md-6"  
              style={{   
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{   
                  margin: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button style={EDIT_MODAL_ICON_STYLE}>
                  <i className={props.state.icon}/>
                </button>
              </div>
              <label>
                Choose Icon <span className="required">*</span>
              </label>
              <div style={{ width: "100%"}}>
                <select
                  name="icon"
                  value={props.state.icon}
                  onChange={(e) => props.handleChange(e)}
                  className="form-control form-control-sm"
                >
                  <option value="">Select your icon here</option>
                  {PREDEFINED_ICONS.map((icon) =>
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  )}
                </select>
              </div>
              <label>
                Heading <span className="required">*</span>
              </label>
              <input
                required
                type="text"
                name="heading"
                placeholder={"Type feature box heading here"}
                value={props.state.heading}
                onChange={(e) => props.handleChange(e)}
                className="form-input form-wide mb-2"
              />
            </div>
            <div className="col-md-6 feature-box feature-box-simple feature-box-content" style={{marginBottom: 0}}>     
              <label>
                Sub-heading <span className="required">*</span>
              </label>
              <input
                required
                type="text"
                name="subheading"
                placeholder={"Type feature box sub heading here"}
                value={props.state.subheading}
                onChange={(e) => props.handleChange(e)}
                className="form-input form-wide mb-2"
              /> 
              <label>
                Paragraph <span className="required">*</span>
              </label>
              <textarea
                rows={4}
                required
                type="text"
                name="paragraph"
                value={props.state.paragraph}
                placeholder={"Type feature box paragraph here"}
                onChange={(e) => props.handleChange(e)}
                className="form-input form-wide mb-2"
              />
            </div>
          </div>
        </div>
      </section>
      <Alert
        open={true}
        type="info"
        message="Use the dropdown to choose an icon for this Feature Box"
      />
      <ModalActions
        handleSave={props.handleSave}
        handleClose={props.handleCloseModal}
      />
    </FancyEditBox>  
  );
}

export const ConfirmDelete = (props) => {
  const { cancel, confirm } = props;

  return (
    <Modal
      isOpen={ true }
      onRequestClose={ cancel }
      contentLabel="login Modal"
      className="login-popup"
      id="login-popup-form"
      overlayClassName="cart-modal-overlay"
      style={ DELETE_CONFIRM_STYLES }
    >  
      <div className="container modal-wrapper">
        <div className="col-md-12">
          <div
            className="row"
            style={{marginBottom: 15, paddingBottom: 15}}
          >
            <form className="mb-1">
              <h5>Are you sure you would like to delete this Feature Box</h5>                
            </form>
          </div>
        </div>
        <ModalActions
          saveTitle="Confirm"
          handleClose={cancel}
          handleSave={confirm}
        />
      </div>
      <button
        title="Close (Esc)"
        type="button"
        className="mfp-close"
        onClick={ cancel }
      >
        ×  
      </button>
    </Modal>
  );
}

const ModalActions = (props) => {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        position: "fixed",
        zIndex: 1000,
        bottom: 0,
        left: 0,
        padding: "1rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
      className="rounded shadow-lg border-top"
    >
       <button
        className={`btn btn-outline-${
            props.deleteConfirmationRequired && props.deleteConfirmationRequired.state
            ? "disabled" : "danger"
        } btn-sm mr-2 rounded`}
        onClick={() => {
            if (!(props.deleteConfirmationRequired) || !(props.deleteConfirmationRequired && props.deleteConfirmationRequired.state)) {
              props.handleClose();
            }
        }}
        style={{
          cursor: props.deleteConfirmationRequired && props.deleteConfirmationRequired.state
            ? "not-allowed" : "pointer",
            width: "150px"
        }}
      >
        Cancel
      </button>

      <button
        className={`btn btn-outline-${
            props.deleteConfirmationRequired && props.deleteConfirmationRequired.state
            ? "disabled" : "primary"
        } btn-sm mr-2 rounded`}
        onClick={() => {
          if (!(props.deleteConfirmationRequired) || !(props.deleteConfirmationRequired && props.deleteConfirmationRequired.state)) {
            props.handleSave();
          }
        }}
        style={{
          cursor: props.deleteConfirmationRequired && props.deleteConfirmationRequired.state
            ? "not-allowed" : "pointer",
            width: "150px"
        }}
      >
        {props.saveTitle ? props.saveTitle : "Save Changes"}
      </button>
    </div>
  );
};


