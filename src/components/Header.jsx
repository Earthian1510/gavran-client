import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { setSearchQuery } from '../features/products/filterSlice'
import { useDispatch } from 'react-redux'


const Header = () => {
    const [search, setSearch] = useState('');
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        dispatch(setSearchQuery(search))
        setSearch('')
        navigate('/products/')
    }


    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to='/'>Gavran</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse mx-auto" id="navbarSupportedContent">
                        <form className="d-flex mx-auto" role="search">
                            <input
                                className="form-control me-1"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                style={{ width: '300px', height: '36px' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="btn btn-sm btn-outline-success" type="submit" style={{ height: '35px', width: '35px' }} onClick={handleSearchSubmit}>
                                <i className="bi bi-search" style={{ fontSize: '18px' }}></i>
                            </button>
                        </form>
                        <ul className="navbar-nav mx-2">
                            <li className="nav-item">
                                <NavLink className="nav-link active" aria-current="page" to='/user'>
                                    <i className="bi bi-person-circle" style={{ fontSize: '20px' }}></i>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to='/wishlist'>
                                    <i className="bi bi-suit-heart" style={{ fontSize: '20px' }}></i>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to='/cart'>
                                    <i className="bi bi-cart4" style={{ fontSize: '20px' }}></i>
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right" style={{ fontSize: '20px', color: 'black' }}></i>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header