import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "../../utils/useFetch";
import { setCategories, setSortBy, setPriceRange, clearFilters } from "../../features/products/filterSlice";
import { useNavigate } from "react-router-dom";
import { API } from "../../api";

const ProductFilter = ({ category }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedCategories, sortBy, priceRange } = useSelector((state) => state.filters)
  const { data, error } = useFetch(`${API.categories}`)

  useEffect(() => {
    if (category && !selectedCategories.includes(category)) {
      dispatch(setCategories([category]))
    }
  }, [dispatch, category])

  const handleClearFilters = () => {
    dispatch(clearFilters())
    navigate('/products/')
  }

  const handleCategorySelect = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      dispatch(setCategories([...selectedCategories, value]))
    }
    else {
      dispatch(setCategories(selectedCategories?.filter(cat => cat !== value)))
    }
  }

  const handleSortFilter = (e) => {
    dispatch(setSortBy(e.target.value))
  }

  const handlePriceRange = (e) => {
    dispatch(setPriceRange(e.target.value))
  }

  return (
    <div className="container my-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mt-3 fs-5">Product Filters</h6>

        <button className="btn btn-link mt-2" onClick={handleClearFilters}>
          Clear
        </button>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold">Category</h6>
        {data &&
          data.map((category) => (
            <div key={category._id}>
              <input
                className="mx-2"
                type="checkbox"
                name="category"
                checked={selectedCategories.includes(category.name)}
                value={category.name}
                onChange={handleCategorySelect}
              />
              {category.name} <br />
            </div>
          ))}
      </div>

      <div className="mb-4">
        <label htmlFor="priceRange" className="fw-bold" >Price:</label> ₹ <span style={{ fontFamily: 'DM Serif Text, serif'}} >0 { priceRange ? `- ${priceRange}` : `` }  </span>
        <br />
        <input 
          type="range" 
          name="priceRange" 
          min="0" 
          max="2000" 
          step="50"
          onChange={handlePriceRange}
          value={priceRange}
        /> 
      </div>


      <div className="mb-3">
        <h6 className="fw-bold">Sort by</h6>
        <input
          className="mx-2"
          type="radio"
          name="sortBy"
          value="lowToHigh"
          onChange={handleSortFilter}
          checked={sortBy === 'lowToHigh'}
        />
        Price - low to high <br />
        <input
          className="mx-2"
          type="radio"
          name="sortBy"
          value="highToLow"
          onChange={handleSortFilter}
          checked={sortBy === 'highToLow'}
        />
        Price - high to low <br />
      </div>
    </div>
  );
};

export default ProductFilter;
