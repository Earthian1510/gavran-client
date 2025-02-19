import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserInfo, updateUserInfo, uploadUserImage } from './userSlice'
import { decodeToken } from '../../utils/decodeToken'
import { fetchPrimaryAddress, updateAddress, addAddress } from '../address/addressSlice'
import AddressForm from '../address/AddressForm'
import Modal from '../../components/Modal'
import OrderListing from '../order/OrderListing'

const User = () => {

  const dispatch = useDispatch()
  const userId = decodeToken()

  const [msg, setMsg] = useState('')
  const [showMsg, setShowMsg] = useState(false)
  const [imageFile, setImageFile] = useState('')

  const [editToggle, setEditToggle] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { userInfo, status, error } = useSelector((state) => state.userInfo)
  const { primaryAddress } = useSelector((state) => state.addresses)

  useEffect(() => {
    dispatch(fetchUserInfo(userId));
    dispatch(fetchPrimaryAddress(userId));
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setImageFile(file)
    }
  }

  const handleImageUpdate = async () => {
    if (!imageFile){
      setMsg("Please select an image!");
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
      }, 1500);
      return;
    }
  
    try{
      const imageUrl = await dispatch(uploadUserImage(imageFile)).unwrap();
      await dispatch(updateUserInfo({ userId, userData: { userImage: imageUrl}})).unwrap();
      setImageFile('')
      setEditToggle(false);
      setMsg('Image updated successfully.')
      setShowMsg(true)
      setTimeout(() => setShowMsg(false), 1500)
    }
    catch(error){
      setMsg(error.message || 'Failed to update user image.');
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 1500);
    }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row mb-3">
          <div className="col-md-5" >
            <h2 style={{ fontFamily: 'DM Serif Text, serif' }} className='my-4 text-center'>User Info</h2>
            <Modal show={showMsg} message={msg} />
            {
              status == 'loading'
              &&
              <div className='alert alert-warning text-center'>Loading...</div>
            }
            {
              status == 'success'
              &&
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={userInfo.userImage}
                    className="card-img-top rounded mt-3"
                    alt={userInfo.name}
                    style={{ height: '17rem', width: '15rem', objectFit: "cover" }}
                  />
                  <button className='btn btn-sm' style={{ position: "absolute", bottom: '0', right: '0', background: 'gray', color: 'white' }} onClick={(e) => setEditToggle(!editToggle)}><i className="bi bi-pencil-square"></i></button>

                </div>
                {
                  editToggle
                  &&
                  <div className='mt-3'>
                    <input 
                      type="file" 
                      accept='image/*'
                      onChange={handleFileChange} 
                      style={{ width: '200px'}}
                    />
                    <button className='btn btn-sm btn-success' onClick={handleImageUpdate}>Update</button>
                  </div>
                }

                <div className='mt-3' >
                  <h4 className='text-center' style={{ fontFamily: 'DM Serif Text, serif' }}>{userInfo.name}</h4>
                  <p className='text-center'>
                    {userInfo.email} <br />
                    {
                      primaryAddress
                        ?
                        <div>

                          +{primaryAddress.phoneNo} <br />
                          {primaryAddress.apartment + ', ' + primaryAddress.street} <br />
                          {primaryAddress.city + ', ' + primaryAddress.state + ' - ' + primaryAddress.zipcode} <br />


                        </div>
                        :
                        ''
                    }
                  </p>

                </div>
                {
                  !primaryAddress
                    ?

                    <div>
                      {
                        <button className={`btn btn-sm btn-${showAddressForm ? 'dark' : 'success'}`} onClick={() => setShowAddressForm(true)}>Create Profile</button>
                      }
                    </div>


                    :

                    <div>
                      {
                        <button className={`btn btn-sm btn-${!showAddressForm ? 'warning' : 'danger'}`} onClick={() => setShowAddressForm(!showAddressForm)}>
                          {
                            !showAddressForm
                              ?
                              'Edit Profile'
                              :
                              'Cancel'
                          }
                        </button>}
                    </div>

                }


                {
                  showAddressForm
                  &&
                  <div className='px-5'>
                    <div>
                      <h5 className="my-3">{primaryAddress ? "Edit Address" : "Add Address"}</h5>
                    </div>

                    <AddressForm
                      addressData={primaryAddress || {}}
                      onCancel={() => setShowAddressForm(false)}
                    />

                  </div>
                }


              </div>
            }


          </div>
          <div className="col-md-6">
            <OrderListing />
          </div>
        </div>
      </div>
    </div>
  )
}

export default User