import React, { useState, useContext } from "react";
import UserSellerContext from "../../../../store/UserSellerContext";

const Addresses = () => {
    const { user } = useContext(UserSellerContext);
    const [ addresses, setAddresses ] = useState(user.User.Address)
    const [editing, setEditing] = useState(false)
    const [editingIdx, setEditingIdx] = useState(-1)
    const [ address, setAddress ] = useState({
        Type: "",
        Address: "",
        Address2: "",
        Address3: "",
        Address4: "",
        Address5: "",
    })


    // handleDeleteAddress deletes an Address off the array
    const handleDeleteAddress = (index) => {
        let tempAddresses = [...addresses]
        tempAddresses.splice(index, 1)
        setAddresses(tempAddresses)
    }

    // handleEditAddress edits the address click
    const handleEditAddress = (index) => {
        let editingAddress = addresses[index]
        setAddress(editingAddress)
        setEditing(true)
        setEditingIdx(index)
    }

    // handleEditAddressClicked handles the submit click of the edit address
    const handleEditAddressClicked = () => {
        setEditing(false)
        let currentAddresses = [...addresses]
        currentAddresses[editingIdx] = address
        setAddresses(currentAddresses)
    }

    // This adds a new Address in the state array
    const handleAddAddressClicked = (event) => {
        event.preventDefault();
        setEditing(false)
        const newAdd = {...address}
        setAddresses([...addresses].concat(newAdd))
        setAddress({
            Type: "",
            Address: "",
            Address2: "",
            Address3: "",
            Address4: "",
            Address5: "",
        })
    }

    // onInputChange is for all input event changes
    const onInputChange = (event) => {
        setAddress({
            ...address,
            [event.target.name]: event.target.value
        })
    }

    return (
        <div>
            <h3>All Delivery Addresses</h3>
                {addresses.map((address, index) => 
                    <div key={address.Type} className="border-bottom border-light">
                        <div className="row">
                            <div className="col-8">
                                <ul style={{ margin: "0px", paddingLeft: "10px"}}>                    
                                    <li>
                                        < br />
                                        <b>Type</b> : {address.Type} <br />
                                        <b>Street Address</b> : {address.Address} <br />
                                        <b>Building / Appartment</b> : {address.Address2} <br />
                                        <b>Suburb</b> : {address.Address3} <br />
                                        <b>Town / City</b> : {address.Address4} <br />
                                        <b>Postal Code</b> : {address.Address5} 
                                    </li>
                                </ul> 
                            </div>
                            <div className="col-4" style={{ paddingTop: "35px" }}>
                                <button 
                                    type="button" 
                                    className="btn" 
                                    data-toggle="modal" 
                                    id="edit" 
                                    data-target="#AddressModal" 
                                    onClick={() => handleEditAddress(index)}
                                >
                                    Edit 
                                </button> 
                                | 
                                <button 
                                    type="button" 
                                    className="btn" 
                                    data-toggle="modal" 
                                    data-target="#DeleteModal" 
                                > 
                                <DeleteModal 
                                    handleDeleteAddress = {() => handleDeleteAddress(index)}
                                />
                                    Delete 
                                </button>
                            </div> <br />
                        </div>
                    </div>
                )}
                <br />
                <button 
                    type="button" 
                    className="btn btn-primary btn-lg btn-block" 
                    data-toggle="modal" 
                    data-target="#AddressModal"
                >
                    Add Address
                </button>
                < Modal
                    editing = {editing}
                    address = {address}
                    onInputChange = {onInputChange}
                    handleAddAddressClicked ={handleAddAddressClicked}
                    handleEditAddressClicked = {handleEditAddressClicked}
                />
        </div>
    )
}

export default Addresses;


const Modal = ( props ) => {


    return(
        <>
            <div 
                className="modal fade" 
                id="AddressModal" 
                tabIndex="-1" 
                aria-labelledby="exampleModalLabel" 
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 
                                className="modal-title" 
                                id="exampleModalLabel"
                            >
                                {props.editing 
                                    ? 
                                    "Editing Address" 
                                    : 
                                    "Add New Address"
                                }
                            </h5>
                            <button 
                                type="button" 
                                className="close" 
                                data-dismiss="modal" 
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div>
                                    <label> Type </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        onChange = {props.onInputChange} 
                                        name={"Type"} 
                                        value={props.address.Type} 
                                    />
                                </div>
                                <div>
                                    <label> Street Address </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        onChange = {props.onInputChange} 
                                        name={"Address"} 
                                        value={props.address.Address} 
                                    />
                                </div>
                                <div>
                                    <label> Building / Apartment </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        onChange = {props.onInputChange} 
                                        name={"Address2"} 
                                        value={props.address.Address2} 
                                    />
                                </div>
                                <div>
                                    <label> Suburb </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        onChange = {props.onInputChange} 
                                        name={"Address3"} 
                                        value={props.address.Address3} 
                                    />
                                </div>
                                <div>
                                    <label> Town / City </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        onChange = {props.onInputChange} 
                                        name={"Address4"} 
                                        value={props.address.Address4} 
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Postal Code</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                onChange = {props.onInputChange} 
                                                name={"Address5"} 
                                                value={props.address.Address5} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-sm" 
                                data-dismiss="modal" 
                            >
                                Close
                            </button>
                            <button 
                                type="submit" 
                                onClick={
                                        props.editing 
                                        ? 
                                        props.handleEditAddressClicked 
                                        : 
                                        props.handleAddAddressClicked
                                    } 
                                className="btn btn-primary btn-sm" 
                                data-dismiss="modal"
                            > 
                                { props.editing 
                                    ? 
                                    "Save Address" 
                                    : 
                                    "Add Address"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const DeleteModal = ( props ) => {
    return (
        <div 
            className="modal fade bd-example-modal-sm" 
            id="DeleteModal" 
            role="dialog" 
            aria-labelledby="DeleteModal" 
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 
                            style={{ paddingTop: 20, paddingLeft: 0}} 
                            className="modal-title font-weight-bold"
                        >
                            Confirm Delete Address
                            </h2>
                        <button 
                            type="button" 
                            className="close" 
                            data-dismiss="modal" 
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">     
                        <div className="row">
                            <h4 
                                className ="font-weight-normal" 
                                style={{paddingLeft: 10}}
                            >
                                Are you sure you want to delete this address?
                            </h4>
                        </div>
                        <div className = "float-right">
                            <button 
                                type="button" 
                                style={{margin: 5}} 
                                className="btn btn-primary" 
                                data-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                onClick={props.handleDeleteAddress}
                            >
                                Delete Address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
)}