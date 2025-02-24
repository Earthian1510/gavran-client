import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Modal from '../../components/Modal'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { decodeToken } from '../../utils/decodeToken'
import { fetchWishlist, removeFromWishlist } from './wishlistSlice'
import { addToCart } from '../cart/cartSlice'

const Wishlist = () => {

  const [msg, setMsg] = useState('')
  const [showMsg, setShowMsg] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userId = decodeToken();
  if (!userId) {
    console.error("User is not logged in!")
    navigate('/login')
  }

  const { products, status, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist(userId))
  }, [])

  const handleAddToCart = (productId) => {
    const product = {
      productId,
      quantity: 1
    }
    dispatch(removeFromWishlist({ userId, productId }))
      .then(() => {
        dispatch(addToCart({ userId, product }))
        setShowMsg(true)
        setMsg('product moved to cart!')
        setTimeout(() => {
          setMsg('')
          setShowMsg(false)
        }, 1500)
      })
  }

  const handleRemoveFromWishlist = (productId) => {

    dispatch(removeFromWishlist({ userId, productId }))
      .then(() => {
        setShowMsg(true)
        setMsg('product removed from wishlist!')
        setTimeout(() => {
          setMsg('')
          setShowMsg(false)
        }, 1500)
      })
  }

  return (
    <div>
      <Header />
      <div className='container'>
        <h3 className='my-3'>Wishlist items ({(products?.length || 0)})</h3>
        <Modal message={msg} show={showMsg} />
        <div className="row g-2">
          {
            status == 'loading' && <div className='alert alert-success text-center'>Loading Wishlist...</div>
          }
          {
            error && <div className='alert alert-danger text-center'>Error occured please try again later</div>
          }
          {
            (status == 'success' && products.length > 0) &&
            products
              .filter((product) => product && product.productId)
              .map((product) => (

                <div className="col-md-4 mb-4 shadow rounded p-3" key={product.productId._id} style={{ width: '200px', marginRight: '1rem' }}>

                  <Link className='text-decoration-none' to={`/products/${product.productId?._id || ''}`} state={product.productId}>
                    <div className="card mb-2" style={{ border: "none" }}>
                      <img
                        src={product.productId.imageUrl}
                        className="card-img-top"
                        alt={product.productId.name}
                        style={{ height: '120px', objectFit: "contain" }}
                      />
                      <div className="card-body text-center" style={{ padding: '0' }}>
                        <p className="card-text">
                          <span style={{ fontFamily: "DM Serif Text, serif", fontSize: '1.4rem' }}> {product.productId.name}</span> <br />
                          <span className='fs-5 fw-bold'>₹ {product.productId.price_per_kg}</span><span> /Kg</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className='text-center' style={{}}>
                    <button
                      className='btn btn-sm btn-success'
                      onClick={() => handleAddToCart(product.productId._id)}
                    >
                      Add to Cart
                    </button>
                    <button className='btn btn-sm btn-dark mx-1' onClick={() => handleRemoveFromWishlist(product.productId._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          {
            (status == 'success' && products.length <= 0)

            &&
            <div className='text-center' style={{ fontFamily: 'DM Serif Text, serif', marginBlock: '2rem' }}>
              <h4 >Your wishlist is empty!</h4>

              <Link to={`/products`}>Add products to wishlist</Link>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Wishlist