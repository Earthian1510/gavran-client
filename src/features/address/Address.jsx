import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddress } from "../store/addressSlice";
import AddressForm from "../../components/AddressForm";
import { Link } from "react-router-dom";
import { deleteAddress } from "../store/addressSlice";

const Address = ({ setSelectedAddress }) => {
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();
  const address = useSelector((state) => state.address.address);

  const handleCloseForm = () => setShowForm(false);
  const handleAddressAdded = (newAddress) => {
    setSelectedAddress(newAddress);
  }

  const handleDeleteAddress = (id) => {
    dispatch(deleteAddress(id))
  }


  return (
    <div className="my-3">
      <div className="card p-3">
        <h5>Select Delivery Address: </h5>

        <div>
          {address?.map((a) => (
            <div className="card p-3 my-2" key={a._id}>
              <div className="row">
                <div className="col-1">
                  <input
                    type="radio"
                    name="address"
                    className="form-check-input"
                    value={a._id}
                    onChange={() =>setSelectedAddress(a)}
                  />
                </div>
                <div className="col">
                  <div className="float-end"> 
                    {/* <Link className="btn btn-sm btn-warning mx-2"> Edit</Link> */}
                    {/* <Link className="btn btn-sm btn-danger" onClick={handleDeleteAddress(a._id)}>Delete</Link> */}
                  </div>
                  <h6 className="fw-bold">{a.name}</h6>
                  <p>
                    <span>Phone No: </span>
                    {
                      a.phoneNo
                    }
                    <br />
                    <span>Address: </span>
                    {
                      a.apartment + ", " +  a.street + ", " +  a.city + ", " + a.state + " - " + a.zipcode 
                    } 
                    
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {
          !showForm
          &&
          <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>Add New</button>
        }
        {
          showForm 
          && 
          <div>
            <AddressForm
              onCloseForm={handleCloseForm}
              onAddressAdded={handleAddressAdded}
            />
          </div>
        }
      </div>
    </div>
  );
};

export default Address;
