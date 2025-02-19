import React, { useState, useEffect } from 'react'
import Modal from '../Modal'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useFetch } from '../../utils/useFetch'
import { API } from '../../api'
import { decodeToken } from '../../utils/decodeToken'
import { addToCart } from '../../features/cart/cartSlice'
import { addToWishlist } from '../../features/wishlist/wishlistSlice'

const ProductList = () => {
    
    const [showMsg, setShowMsg] = useState(false)
    const [msg, setMsg] = useState()
    const dispatch = useDispatch()
    const { data, error } = useFetch(API.products)
 
    const { selectedCategories, sortBy, searchQuery, priceRange } = useSelector((state) => state.filters)

    const filteredProducts = data?.filter((product) => {
        if(selectedCategories.length && !selectedCategories.includes(product.category.name)){
            return false;
        }

        if(searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())){
            return false;
        }

        return true
    })

    if(sortBy) {
        filteredProducts.sort((a, b) => {
            if(sortBy === 'lowToHigh'){
                return a.price_per_kg - b.price_per_kg;
            }
            else if(sortBy === 'highToLow'){
                return b.price_per_kg - a.price_per_kg;
            }
            return 0;
        })
    }

    
    const finalProducts = priceRange 
    ? filteredProducts.filter((product) => product.price_per_kg < Number(priceRange))
    : filteredProducts;

    const userId = decodeToken()
    const handleAddToCart = (productId) => {
        const product = {
            productId,
            quantity: 1
        }
        dispatch(addToCart({ userId, product }))
        .then(() => {
            setShowMsg(true)
            setMsg("Product added to cart!")
            setTimeout(() => {
                setShowMsg(false)
                setMsg('')
            }, 1500)
        })
    }

    const handleAddToWishlist = (productId) => {
        dispatch(addToWishlist({ userId, productId }))
        .then(() => {
            setShowMsg(true)
            setMsg("Product added to wishlist!")
            setTimeout(() => {
                setShowMsg(false)
                setMsg('')
            }, 1500)
        })
    }


    return (
        <div className='container my-3'>
            <h2>Products </h2>
            
            {
                finalProducts && <h6 className='mb-2 fw-light'>Showing {finalProducts?.length} Products</h6>
            }

            <Modal
                show={showMsg}
                message={msg}
            />
              
            <div className="row mt-2">
                {finalProducts && finalProducts?.length > 0 ? (
                    finalProducts?.map((product) => (
                        <div className="col-md-4 mb-4 shadow rounded p-3" key={product._id} style={{width: '200px', marginRight: '1rem'}}>
                            <Link className='text-decoration-none' to={`/products/${product._id}`} state={product}>
                                <div className="card mb-2" style={{  border: "none" }}>
                                    <img
                                        src={product.imageUrl}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: '120px', objectFit: "contain" }}
                                    />
                                    <div className="card-body text-center" style={{ padding: '0'}}>
                                        <p className="card-text">
                                            <span style={{ fontFamily: "DM Serif Text, serif", fontSize: '1.4rem'}}> {product.name}</span> <br />
                                            <span className='fs-5 fw-bold'>₹ {product.price_per_kg}</span><span> /Kg</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <div className='text-center' style={{ }}>
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
                    <div className='alert alert-warning text-center'>Products Loading </div>
                )}
            </div>
            
          
        </div>
    )
}

export default ProductList