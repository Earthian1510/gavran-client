import React, { useEffect, useState } from "react";
import { addAddress, updateAddress } from "../address/addressSlice";
import { useDispatch } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";

const AddressForm = ({ addressData, onCancel }) => {

  const userId = decodeToken()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    apartment: '',
    street: '',
    phoneNo: '', 
    zipcode: '',
    isPrimary: 'false'
  })

  useEffect(() => {
    if(addressData && addressData._id ){
      setFormData({
        name: addressData.name || '',
        city: addressData.city || '',
        state: addressData.state || '',
        apartment: addressData.apartment || '',
        street: addressData.street || '',
        phoneNo: addressData.phoneNo || '',
        zipcode: addressData.zipcode || '',
        isPrimary: addressData.isPrimary ? 'true' : 'false',
      })
    }
  }, [addressData])

  const handleFormData = (e) => {
    const { name, value } = e.target 
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'zipcode' ? Number(value) : value
    }))  
  }

  const handleAddAddress = (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      isPrimary: formData.isPrimary === 'true',
    }

    if(addressData && addressData._id){
      dispatch(updateAddress({ ...payload, _id: addressData._id }))
      .then(() => {
        onCancel();
      })
      .catch((error) =>{
        console.error('Error updating address', error)
      })
    }
    else{
      dispatch(addAddress({ userId, newAddress: payload}))
      .then(() => {
        setFormData({
          name: '',
          city: '',
          state: '',
          apartment: '',
          street: '',
          phoneNo: '',
          zipcode: '',
          isPrimary: 'false'
        })
        onCancel();
      })
      .catch((error) => {
        console.error('Error adding address', error)
      })
    }

   
  }


  return (
    <div>
      <div className="col">
        
        <form onSubmit={handleAddAddress}>
          <div className="row">
            <div className="col mb-3">
              <input 
                placeholder="Name"
                type="text" 
                name="name" 
                className="form-control" 
                value={formData.name}
                onChange={handleFormData}
              />
            </div>
            
          </div>
          <div className="row">
          <div className="col mb-3">
              <input 
                placeholder="Phone no"
                type="number" 
                name="phoneNo" 
                className="form-control" 
                value={formData.phoneNo}
                onChange={handleFormData}
              />
            </div>
            <div className="col mb-3">

              <select name="isPrimary" onChange={handleFormData} value={formData.isPrimary} className="form-select">
                <option value="">Is Primary Address</option>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col mb-3">
             
              <input 
              placeholder="Apartment"
                type="text" 
                name="apartment" 
                className="form-control" 
                value={formData.apartment}
                onChange={handleFormData}
              />
            </div>
            <div className="col mb-3">
             
              <input 
              placeholder="Street"
                type="text" 
                name="street" 
                className="form-control" 
                value={formData.street}
                onChange={handleFormData}
              />
            </div>
            <div className="col mb-3">
             
              <input 
              placeholder="City"
                type="text" 
                name="city" 
                className="form-control" 
                value={formData.city}
                onChange={handleFormData}
              />
            </div>
          </div>
          <div className="row">
            
            <div className="col-5 mb-3">
              <input 
                placeholder="Zipcode"
                type="number" 
                name="zipcode" 
                className="form-control" 
                value={formData.zipcode}
                onChange={handleFormData}
              />
            </div>
            <div className="col mb-3">
              <input 
                placeholder="State"
                type="text" 
                name="state" 
                className="form-control" 
                value={formData.state}
                onChange={handleFormData}
              />
            </div>
            
          </div>
          <button type="submit" className="btn btn-success btn-sm float-end">
            { addressData && addressData._id ? 'Update': 'Add'}
          </button>
          <button 
            type="button"
            className="btn btn-danger btn-sm float-end me-2"
            onClick={onCancel}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
