import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import ProductFilter from '../components/Products/ProductFilter'
import ProductList from '../components/Products/ProductList'
import { useParams } from 'react-router-dom'

const Products = () => {

    const { category } = useParams() 
    return (
        <div>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <ProductFilter category={category}/>
                    </div>
                    <div className="col">
                        <ProductList/>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Products