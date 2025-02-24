import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, increaseItemQuantity, decreaseItemQuantity, removeFromCart, clearUserCart } from './cartSlice';
import { addToWishlist } from '../wishlist/wishlistSlice';
import { decodeToken } from '../../utils/decodeToken';
import { Link } from 'react-router-dom';

const Cart = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  const userId = decodeToken();
  if(!userId){
    console.error("User is not logged in!")
    navigate('/login')
  }

  const { items, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart(userId));
  }, []);

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseItemQuantity({ userId, productId }));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseItemQuantity({ userId, productId }));
  };

  const handleAddToWishlist = (productId) => {
    dispatch(removeFromCart({ userId, productId }))
      .then(() => {
        dispatch(addToWishlist({ userId, productId }))
      })
      .then(() => {
        setMsg("Product moved to wishlist!");
        setShowMsg(true);
        setTimeout(() => {
          setShowMsg(false);
          setMsg('');
        }, 1000);
      });
  }

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart({ userId, productId }))
      .then(() => {
        setMsg("Product removed from cart!");
        setShowMsg(true);
        setTimeout(() => {
          setShowMsg(false);
          setMsg('');
        }, 1000);
      });
  };

  const handleClearCart = () => {
    dispatch(clearUserCart(userId));
  };

  const totalProductPrice = (items ?? []).reduce((acc, product) => acc + (product.productId.price_per_kg * product.quantity), 0);
  const deliveryCharge = totalProductPrice * 0.20;

  return (
    <div>
      <Header />
      <div className="container">

        <div className="row mb-2">

          <div className="col-md-5 mb-0">
            <h3 className='my-3'>Cart items ({(items?.length || 0)})</h3>
            {
              showMsg && <Modal show={showMsg} message={msg} />
            }
            {
              status == 'loading' && <div className='alert alert-warning mt-2'>Loading...</div>
            }

            {
              (status == 'success' && items?.length > 0)
              &&
              (
                <div>
                  <div>
                    {
                      items?.length !== 0 && (
                        <button onClick={handleClearCart} className='btn btn-link p-0' style={{ cursor: 'pointer' }}>Clear Cart</button>
                      )
                    }
                  </div>
                  <div>
                    {
                      items.map((product) => (
                        <div key={product.productId._id} className="col mt-2">
                          <div className="card" style={{ height: '120px' }}>
                            <div className="row">
                              <div className="col-4" style={{}}>
                                <img
                                  className='img-fluid rounded'
                                  style={{ height: '118px', objectFit: 'cover' }}
                                  src={product.productId.imageUrl}
                                  alt={product.productId.name}
                                />
                              </div>
                              <div className="col p-2">
                                <h4 style={{ fontFamily: "DM Serif Text, serif" }} className='mb-0'>{product.productId.name}</h4>
                                <h4 className='fw-bold mb-0' style={{ fontFamily: "DM Serif Text, serif" }}>
                                  ₹ {product.productId.price_per_kg || product.productId.price} <span style={{ fontSize: '1rem', fontWeight: '400' }}>/Kg</span>
                                </h4>
                                <div className='d-flex justify-content-between align-items-center' style={{ paddingRight: '20px' }}>
                                  <div>
                                    Quantity:

                                    <button style={{ marginInline: '5px', cursor: 'pointer', focus: 'none' }} className='btn p-0' onClick={() => handleDecreaseQuantity(product.productId._id)}><i className="bi bi-dash-square" style={{ fontSize: '20px' }} ></i></button>
                                    <span className='fw-bold' style={{ fontFamily: "DM Serif Text, serif" }}>{product.quantity || 1}</span>
                                    <button style={{ marginInline: '5px', cursor: 'pointer' }} className='btn p-0' onClick={() => handleIncreaseQuantity(product.productId._id)}><i className="bi bi-plus-square" style={{ fontSize: '20px' }} ></i></button>

                                  </div>
                                  <div className='d-flex mt-1' style={{ height: '32px' }}>
                                    <button className='btn btn-sm btn-dark' onClick={() => handleRemoveFromCart(product.productId._id)}>
                                      Remove
                                    </button>
                                    <button className='btn btn-sm btn-info mx-1' onClick={() => handleAddToWishlist(product.productId._id)}>
                                      Wishlist
                                    </button>

                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

              )}
            
            {
              error && <div className='alert alert-danger'>Error occured, Please try again later!</div>
            }

            <div className='mt-2'>
              {
                (status == 'success' && items?.length > 0)
                && (
                  <div className="card p-3">
                    <h5 className='fw-bold'>Price Details</h5>
                    <table className='table table-borderless' style={{ borderTop: '1px solid gray' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid' }}>
                          <td> Total Price ({items.length} items)</td>
                          <td>₹ {totalProductPrice}</td>
                        </tr>
                        <tr className='py-0'>
                          <td>Delivery Charges</td>
                          <td>₹ {deliveryCharge.toFixed(2)}</td>
                        </tr>
                        <tr className='fw-bold' style={{ borderBlock: '1px solid gray' }}>
                          <td>Cart Total</td>
                          <td>₹ {(totalProductPrice + deliveryCharge).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* <UserAddress setSelectedAddress={setSelectedAddress} /> */}
                    
                    <Link className='btn btn-success' to='/order' state={items}>Next</Link>
                  </div>
                )}

            </div>

          </div>

          {
            (status == 'success' && items.length == 0)
            &&
            <div className='text-center' style={{ fontFamily: 'DM Serif Text, serif', marginBlock: '2rem' }}>
              <h4 >Your Cart is empty!</h4>

              <Link to={`/products`}>Add products to cart</Link>
            </div>
          }
        </div>

      </div>
    </div>
  );
};

export default Cart;
