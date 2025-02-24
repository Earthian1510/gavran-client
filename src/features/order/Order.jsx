import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { useLocation, useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllAddresses, deleteAddress } from '../address/addressSlice'
import { decodeToken } from '../../utils/decodeToken'
import AddressForm from '../address/AddressForm'
import { createOrder } from './orderSlice'
import { clearUserCart } from '../cart/cartSlice'

const Order = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const [msg, setMsg] = useState('')
    const [showMsg, setShowMsg] = useState(false)
    const userId = decodeToken()

    const [showAddress, setShowAddress] = useState(false)
    const [editAddressData, setEditAddressData] = useState(null);

    const [shippingAddress, setShippingAddress] = useState(null);

    const orderedItems = location.state;

    useEffect(() => {
        dispatch(fetchAllAddresses(userId))
    }, [])

    const addressList = useSelector((state) => state.addresses)
    const addressArr = addressList.allAddresses

    const totalProductPrice = orderedItems.reduce((acc, product) => acc + (product.productId.price_per_kg * product.quantity), 0);
    const deliveryCharge = totalProductPrice * 0.20;

    const handleDeleteAddress = (id) => {
        dispatch(deleteAddress(id))
            .then(() => {
                setMsg('Address deleted successfully.')
                setShowMsg(true)
                setTimeout(() =>
                    setShowMsg(false)
                    , 1200)
            })
            .catch((error) => console.error('Error deleting address', error))
    }

    const handleEditAddress = (address) => {
        setEditAddressData(address)
        setShowAddress(true);
    }

    const handlePlaceOrder = () => {
        if(!shippingAddress){
            setMsg('Please select a shipping address')
            setShowMsg(true)
            setTimeout(() => {
                setShowMsg(false)
                setMsg('')
            }, 1200)
            return;
        }

        const newOrder = {
            shippingAddress: shippingAddress,
            orderInfo: orderedItems
        }

        dispatch(createOrder({userId, newOrder}))
        .then(() => {
            dispatch(clearUserCart(userId))
            setMsg('Order placed successfully.');
            setShowMsg(true)
            setTimeout(() => {
                setMsg('');
                setShowMsg(false)
            }, 3000)
            navigate('/user')
        })
        .catch((error) => {
            console.error('Error placing order', error)
            setMsg('Failed to place order.');
            setShowMsg(true)
            setTimeout(() => {
                setMsg('');
                setShowMsg(false)
            }, 1200)
        })

    }

    return (
        <div>
            <Header />
            <div className="container">
                <div className="row mb-2" style={{ display: 'flex', justifyContent: 'space-around' }}>


                    <div className="col-md-6">
                        <h3 className="my-3">Billing Information</h3>

                        <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>

                            <div className="col">
                                {
                                    orderedItems.length > 0 && (
                                        <div className="py-3">
                                            <div>
                                                <h4>Select Address</h4>
                                                {
                                                    addressArr
                                                    &&
                                                    addressArr?.map((address) => <div className="card p-3 pb-0 mb-2" key={address._id}>
                                                        <div className="row">
                                                            <div className='col-1 my-auto'>
                                                                <input
                                                                    type="radio"
                                                                    name='shippingAddress'
                                                                    className='form-radio'
                                                                    style={{ transform: 'scale(1.3)', marginLeft: '0.4 rem' }}
                                                                    onChange={() => setShippingAddress(address)}
                                                                />
                                                            </div>
                                                            <div className='col'>
                                                                <h5 className="fw-bold">{address.name}</h5>
                                                                <p className='mb-1'>
                                                                    <span>Phone No: </span>
                                                                    + {address.phoneNo}
                                                                    <br />
                                                                    <span>Address: </span>
                                                                    {
                                                                        address.apartment + ", " + address.street + ", " + address.city + ", " + address.state + " - " + address.zipcode
                                                                    }

                                                                </p>
                                                            </div>
                                                            <div className='mb-2 text-end'>
                                                                <button className='btn btn-sm btn-warning' onClick={() => handleEditAddress(address)}>Edit</button>
                                                                <button className='btn btn-sm btn-danger mx-1' onClick={() => handleDeleteAddress(address._id)}>Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>)

                                                }
                                                <button
                                                    className='btn btn-success'
                                                    onClick={() => {
                                                        setShowAddress(!showAddress)
                                                        setEditAddressData(null)
                                                    }}

                                                > New address</button>
                                                {
                                                    showAddress
                                                    &&
                                                    <div className='card mt-2 px-3 py-2'>
                                                        <AddressForm addressData={editAddressData || {}} onCancel={() => setShowAddress(false)} />
                                                    </div>
                                                }

                                            </div>

                                        </div>
                                    )}
                            </div>
                        </div>

                    </div>

                    <div className="col-md-4">
                        <h3 className='my-3'>Ordered items ({(orderedItems?.length || 0)})</h3>
                        {
                            showMsg && <Modal show={showMsg} message={msg} />
                        }

                        {
                            (orderedItems?.length > 0)
                            &&
                            (
                                <div>

                                    <div className='card mb-2'>
                                        {
                                            orderedItems.map((product) => (
                                                <div key={product.productId._id} className="col mt-2">
                                                    <div className="px-2">
                                                        <div className="row">
                                                            <div className="col-4" style={{}}>
                                                                <img
                                                                    className='img-fluid rounded'
                                                                    style={{ objectFit: 'cover' }}
                                                                    src={product.productId.imageUrl}
                                                                    alt={product.productId.name}
                                                                />
                                                            </div>
                                                            <div className="col">
                                                                <h5 style={{ fontFamily: "DM Serif Text, serif" }} className='mb-0'>{product.productId.name}</h5>
                                                                <h5 className='fw-bold mb-0' style={{ fontFamily: "DM Serif Text, serif" }}>
                                                                    ₹ {product.productId.price_per_kg || product.productId.price} <span style={{ fontSize: '1rem', fontWeight: '400' }}>/Kg</span> <br />

                                                                </h5>
                                                                <p style={{ fontFamily: "DM Serif Text, serif" }} >
                                                                    Quantity: {product.quantity}
                                                                </p>

                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                            )}


                        <div className=''>
                            {
                                (orderedItems?.length > 0)
                                && (
                                    <div className="card p-3 pb-0">
                                        <h5 className='fw-bold'>Price Details</h5>
                                        <table className='table table-borderless' style={{ borderTop: '1px solid gray' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid' }}>
                                                    <td> Total Price ({orderedItems.length} items)</td>
                                                    <td>₹ {totalProductPrice}</td>
                                                </tr>
                                                <tr className='py-0'>
                                                    <td>Delivery Charges</td>
                                                    <td>₹ {deliveryCharge.toFixed(2)}</td>
                                                </tr>
                                                <tr className='fw-bold' style={{ borderTop: '1px solid gray', paddingBottom: '0' }}>
                                                    <td>Cart Total</td>
                                                    <td>₹ {(totalProductPrice + deliveryCharge).toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                )}

                        </div>
                        <div> 
                            <button 
                                className='btn btn-primary mt-3'
                                onClick={handlePlaceOrder}
                                disabled={!shippingAddress || orderedItems.length === 0}
                            >
                                Place Order
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order