import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../components/Modal';
import { decodeToken } from '../../utils/decodeToken';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllOrders, createOrder, updateOrder } from './orderSlice';

const OrderListing = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const userId = decodeToken()

    const [msg, setMsg] = useState('');
    const [showMsg, setShowMsg] = useState(false);

    const { allOrders, status, error } = useSelector((state) => state.orders)

    useEffect(() => {
        dispatch(fetchAllOrders(userId))
    }, [])

    return (
        <div>
            <h2 className='my-4 text-center' style={{ fontFamily: 'DM Serif Text, serif' }}>Orders</h2>

            {
                status === 'loading' && <div className='alert alert-info text-center'>Loading...</div>
            }
            {
                error && <div className='alert alert-danger text-center'>Error occured, Please try again later!</div>
            }
            {
                allOrders
                    ?
                    <div>
                        {
                            allOrders?.map((order) => (
                                <div key={order._id} className='card p-3' style={{ display: 'flex'}} >
                                    <div style={{ display: 'flex' }} className=''>
                                        {
                                            order.orderInfo?.map((product) => (
                                                <div className='' >
                                                    <img src={`${product.productId.imageUrl}`} style={{ height: '80px' }} />
                                                        <p className='text-center' style={{ fontFamily: 'DM Serif Text, serif' }}>
                                                            {product.productId.name}
                                                            <br />
                                                            <span style={{ fontSize: '14px' }}>
                                                                ₹{product.productId.price_per_kg}/kg x {product.quantity} kg
                                                            </span>
                                                            <br />
                                                            ₹{product.productId.price_per_kg * product.quantity}
                                                        </p>
                                            
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className=''>
                                        <Link className='float-end' to={`/order/${order._id}`} state={{ order }}>View Invoice</Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    :
                    <div>No Orders Found!</div>
            }

        </div>
    )
}

export default OrderListing