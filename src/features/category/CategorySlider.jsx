import React, { useEffect } from 'react';
import { fetchCategories } from './categorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CategorySlider = () => {
    const dispatch = useDispatch();
    const { categories, status, error } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const carousalCategories = [];
    for (let i = 0; i < categories.length; i += 4) {
        let carousal = categories.slice(i, i + 4);
        if(carousal.length < 4){
            const leftCategories = 4 - carousal.length;
            carousal = carousal.concat(categories.slice(0, leftCategories))
        }
        carousalCategories.push(carousal);
        
    }

    return (
         
          <div className='my-3'>
          {
              status =='loading' && <div className='fs-1 text-center' style={{ fontFamily: "DM Serif Text, serif"}}>Welcome to Our Website</div>
          }
          {
              error && <div className='fs-1 text-center' style={{ fontFamily: "DM Serif Text, serif"}}>Shop with our Super Farmers </div>
          }
          {
              categories
              &&
              <div className='row'>
                  {
                      categories.map((cat) => (
                          <div key={cat._id} className='col-md-3 mb-3'>
                              <Link className='text-decoration-none ' to={`/products/category/${cat.name}`}>
                                  
                                      <img src={`${cat.imageUrl}`} class="img-fluid rounded" alt={`${cat.name}`} style={{ height: '130px', width: '100%', objectFit: 'cover'}}/>
                                      <div style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bolder', background: 'black', textAlign: 'center'}}>
                                          {cat.name}
                                      </div>
                                  
                                  
                              </Link>
                          </div>
                      ))
                  }
              </div>
          }
      </div>
        
    );
};

export default CategorySlider;
