import React, { useState } from "react";
import { useSellerConfig } from "../../../../../../store/sellerConfigContext";
import { toast } from "react-toastify";

const EditFooterSocialMediaModalContent = (props) => {
  const { sellerConfigs } = useSellerConfig();
  const [column, setColumn] = useState(
    sellerConfigs.UIConfig.Footer.columns[2]
  );

  const IS_EDITED =
    JSON.stringify(column) !==
    JSON.stringify(sellerConfigs.UIConfig.Footer.columns[2]);

  const handleTitleChange = (e) => {
    setColumn({
      ...column,
      title: e.target.value,
    });
  };

  const handleTagsListTextChange = (e) => {
    setColumn({
      ...column,
      commaSeparateditemList: e.target.value,
    });
  };

  const handleSave = () => {
    if (IS_EDITED) {
      props.save(column, 2);
      props.close();
    } else {
      toast.warning("No changes detected", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          minHeight: 260,
        }}
      >
        <div
          style={{
            width: "100%",
            borderBottom: "1px #efefef solid",
            padding: "10px 0 10px 0",
          }}
        >
          <input
            type="text"
            className="form-control section-sub-title"
            placeholder="type column title here."
            style={{
              textAlign: "center",
              fontWeight: "700",
            }}
            onChange={handleTitleChange}
            value={column.title}
          />
        </div>

        <textarea
          className="form-control"
          rows="4"
          cols="50"
          onChange={handleTagsListTextChange}
          value={column.commaSeparateditemList}
        ></textarea>

        <div
          className="alert alert-primary d-flex align-items-center"
          role="alert"
          style={{
            marginBottom: "1rem",
            fontSize: "1.2rem",
            minHeight: "59px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-info-circle-fill"
            viewBox="0 0 16 16"
            style={{ marginRight: 10 }}
          >
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          <div>
            Enter items via a <b>comma separated</b> list
          </div>
        </div>

        <ModalActions
          save={handleSave}
          close={props.close}
          edited={IS_EDITED}
        />
      </div>
    </>
  );
};

const ModalActions = (props) => {
  return (
    <div
      style={{
        width: "100%",
        padding: "1rem 0",
        paddingTop: "3px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "63px",
          background: "#fff",
          position: "fixed",
          bottom: "0px",
          left: 0,
          padding: "1rem 3rem",
          zIndex: 10000,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              minWidth: 150,
            }}
            className="btn btn-outline-danger btn-sm mr-3 rounded"
            onClick={props.close}
          >
            Cancle
          </button>

          <button
            className={`btn ${
              props.edited ? "animate__animated animate__bounce" : ""
            } btn-outline-primary btn-sm mr-2 rounded button-white-backdrop`}
            style={{
              position: "relative",
              opacity: props.edited ? 1 : 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              borderColor: "#08C",
              minWidth: 150,
              zIndex: 10,
            }}
            onClick={props.save}
          >
            {!props.edited && (
              <div
                style={{
                  cursor: "not-allowed",
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 10,
                }}
              />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFooterSocialMediaModalContent;
