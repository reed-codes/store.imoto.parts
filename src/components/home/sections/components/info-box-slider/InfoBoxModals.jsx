import React from "react";

import FancyEditBox from "../fancy-edit-box";
import FancyEditBoxHeader from "../fancy-edit-box-header";
import { PREDEFINED_ICONS } from "../../../../../utils/icons";
import Alert from "../../../../common/alert";
import ModalActions from "../modal-actions";

const ICON_STYLE = {
  border: "none",
  padding: 0,
  textAlign: 'center',
  textDecoration: 'none',
  justifyContent: "center",
  alignItems: "center",
  fontSize: 20,
  margin: 0,
  margin: 0,
  marginLeft: 0,
  paddingLeft: 0,
  borderRadius: "50%",
  cursor: 'pointer',
  height: 60,
  width: 60,
  minHeight: 60,
  minWidth: 60,
  maxHeight: 60,
  maxWidth: 60,
  margin: 5,
}

const SELECTED_ICON_STYLE = {
  border: "dashed",
  padding: 0,
  textAlign: 'center',
  textDecoration: 'none',
  justifyContent: "center",
  alignItems: "center",
  fontSize: 20,
  margin: 0,
  marginLeft: 0,
  paddingLeft: 0,
  borderRadius: "50%",
  cursor: 'pointer',
  height: 60,
  width: 60,
  minHeight: 60,
  minWidth: 60,
  maxHeight: 60,
  maxWidth: 60,
  margin: 5,
  color: "#08C"
}

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
  height: 120,
  width: 120,
  minHeight: 120,
  minWidth: 120,
  maxHeight: 120,
  maxWidth: 120,
  color: "#08C",
}

export const AddInfoBoxModal = (props) => {
  const {
    addingInfoBox,
    state,
    handleChange,
    handleSave,
    handleCloseModal
  } = props;

  return (
    <FancyEditBox handleClose={handleCloseModal}>
      <section
        className="feature-boxes-container"
        style={{padding: 10}}
      >    
        <FancyEditBoxHeader
          title={addingInfoBox ? "Adding Info Box" : "Editing Info Box" }
          handleClose={handleCloseModal}
        />
        <div className="row">
          <div
            className="col-md-6"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button style={EDIT_MODAL_ICON_STYLE}>
              <i className={state.name}/>
            </button>
          </div>
          <div className="col-md-6" style={{paddingRight: 10}}>
            <label>
                Choose Icon <span className="required">*</span>
            </label>
            <div className="select-custom" style={{ width: "100%"}}>
              <select
                value={state.name}
                onChange={(e) => handleChange(e)}
                name="name"
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
            <div className="feature-box-content" >
              <label>
                Title <span className="required">*</span>
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="Type Info Box title here"
                value={state.title}
                onChange={(e) => handleChange(e)}
                className="form-input form-wide mb-2"
              />
              <label>
                Description <span className="required">*</span>
              </label>
              <input
                required
                type="text"
                name="desc"
                placeholder="Type Info Box description here"
                value={state.desc}
                onChange={(e) => handleChange(e)}
                className="form-input form-wide mb-2"
              />
            </div>
          </div>
        </div>
      </section>
      <Alert
        open={true}
        type="info"
        message="Use the dropdown to choose an icon for this Info Box"
      />
      <ModalActions
        closeTitle="Cancel"
        saveTitle="Save"
        handleSave={handleSave}
        handleClose={handleCloseModal}
      />
    </FancyEditBox>  
  );
}

export const SelectInfoBoxSliderIcon = (props) => {
  const {
    selectedIcon,
    setSelectedIcon,
    handleClose,
    modalTitle,
    handleUpdateInfoBoxIcon
  } = props
  
  return (
    <FancyEditBox handleClose={handleClose}>
      <section
        className="feature-boxes-container"
        style={{paddingBottom: 0, paddingTop:0}}
      >    
        <FancyEditBoxHeader
          title={modalTitle}
          handleClose={handleClose}
        />
        <div className={"row"}>
          {PREDEFINED_ICONS.map((index) => 
            <div className="col-md-2">
              <div key={"feature" + index}
                style = {{
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center',
                }}
              >                     
                <button
                  onClick={() => setSelectedIcon(index)}
                  style={index === selectedIcon ? SELECTED_ICON_STYLE : ICON_STYLE}
                >
                  <i className={index}/>
                </button> 
              </div>
            </div>
          )}
        </div>
      </section>
      <ModalActions
        closeTitle="Cancel"
        saveTitle="Save"
        handleSave={handleUpdateInfoBoxIcon}
        handleClose={handleClose}
      />
    </FancyEditBox>  
  );
}