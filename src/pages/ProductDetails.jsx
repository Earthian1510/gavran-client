import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useFetch } from '../utils/useFetch'
import Modal from '../components/Modal'
import { API } from '../api'
import { addToCart } from '../features/cart/cartSlice'
import { decodeToken } from '../utils/decodeToken'


const ProductDetails = () => {

  const userId = decodeToken()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showMsg, setShowMsg] = useState(false)
  const [msg, setMsg] = useState('')
  const [quantity, setQuantity] = useState(1)

  const location = useLocation()
  const productInfo = location.state;

  const { data, error } = useFetch(API.products)
  const productArr = data?.filter((product) => product._id !== productInfo._id && product.category.name === productInfo.category.name)


  const handleAddToCart = (productId) => {
    const product = {
      productId,
      quantity
    }
    dispatch(addToCart({ userId, product }))
      .then(() => {
        setQuantity(1)
        setShowMsg(true)
        setMsg("Product added to cart!")
        setTimeout(() => {
          setShowMsg(false)
          setMsg('')
        }, 1500)
      })
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }
  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleBuyNow = () => {
    const items = [
      {
        productId: productInfo,
        quantity
      }
    ];
  
    navigate("/order", { state: items }); 
  };


  return (
    <div>
      <Header />
      <div className='container my-3'>
        <Modal
          show={showMsg}
          message={msg}
        />
        {
          productInfo
          &&
          <div className="row mt-2">
            <div className="col-md-6 mb-4" >
              <img src={productInfo.imageUrl} alt={productInfo.name} className='img-fluid rounded' style={{ objectFit: "contain", height: "26rem", }} />
            </div>
            <div className='col-md-6'>
              <h1 className='fw-light' style={{ fontFamily: 'DM Serif Text, serif' }}>{productInfo.name}</h1>
              <h2 className='fw-bold'>₹ {productInfo.price_per_kg} /Kg</h2>
              <hr />
              <p>
                <b>Description:</b> <br />
                {productInfo.description}
              </p>
              <p><b>Farmer Location:</b> <br />{productInfo.farmer_location}</p>
              <p><b>Stored In:</b><br /> {new Date(productInfo.farm_produce_store_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>

              <div className='d-flex justify-content-between align-items-center' style={{ paddingRight: '20px' }}>
                <div>
                  Quantity:
                  <button style={{ marginInline: '5px', cursor: 'pointer', focus: 'none' }} className='btn p-0' onClick={() => handleDecreaseQuantity(productInfo._id)}><i className="bi bi-dash-square" style={{ fontSize: '20px' }} ></i></button>
                  <span className='fw-bold' style={{ fontFamily: "DM Serif Text, serif" }}>{quantity || 1}</span>
                  <button style={{ marginInline: '5px', cursor: 'pointer' }} className='btn p-0' onClick={() => handleIncreaseQuantity(productInfo._id)}><i className="bi bi-plus-square" style={{ fontSize: '20px' }} ></i></button>
                </div>
              </div>

              <div className='my-3' style={{ display: 'flex', gap: '0.3rem' }}>
                <button className='btn btn btn-success' onClick={() => handleAddToCart(productInfo._id)}>Add to Cart</button>
                <button className='btn btn btn-warning' onClick={() => handleBuyNow()}>Buy Now</button>
              </div>
            </div>
          </div>

        }
        <hr />
        <div className="row">
          {(productArr && productArr.length > 0) ? <h3 className='mb-3' style={{ fontFamily: 'DM Serif Text, serif' }}>You may also like</h3> : <h3></h3>}
          {
            productArr && productArr.length > 0 ? (
              productArr.map((product) => (

                <div className="col-md-4 mb-4 shadow rounded p-3" key={product._id} style={{ width: '200px', marginRight: '1rem' }}>
                  <Link className='text-decoration-none' to={`/products/${product._id}`} state={product}>
                    <div className="card mb-2" style={{ border: "none" }}>
                      <img
                        src={product.imageUrl}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: '120px', objectFit: "contain" }}
                      />
                      <div className="card-body text-center" style={{ padding: '0' }}>
                        <p className="card-text">
                          <span style={{ fontFamily: "DM Serif Text, serif", fontSize: '1.4rem' }}> {product.name}</span> <br />
                          <span className='fs-5 fw-bold'>₹ {product.price_per_kg}</span><span> /Kg</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className='text-center' style={{}}>
                    <button
                      className='btn btn-sm btn-success'
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add to Cart
                    </button>
                    <button className='btn btn-sm btn-dark mx-1' onClick={() => handleAddToWishlist(product._id)}>Wishlist</button>
                  </div>

                </div>
              ))
            ) : (
              <div></div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default ProductDetails