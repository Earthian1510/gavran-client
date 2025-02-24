import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from '../components/Modal';
import { API } from '../api'
import { decodeToken } from '../utils/decodeToken';

const Login = () => {

    const navigate = useNavigate()
    const userId = decodeToken()

    const [showMsg, setShowMsg] = useState(false)
    const [msg, setMsg] = useState('')
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })

    const handleLoginData = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLoginUser = async (e) => {
        e.preventDefault();

        const response = await fetch(API.login, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(loginData)
        })

        const data = await response.json()
        localStorage.setItem("token", data.token);

        setLoginData({
            email: '',
            password: ''
        })

        setMsg('Login Successful!')
        setShowMsg(true)

        setTimeout(() => {
            setMsg('')
            setShowMsg(false)
            navigate('/')
        }, 2000)
    }

    return (
        <div className='container my-5'>
            <Modal show={showMsg} message={msg} />
            {
                !userId
                &&
                <div className="d-flex justify-content-center align-items-center mb-5 mt-3">
                    <div className='card p-4' style={{ width: '20rem' }}>
                        {/* <h1 style={{ fontFamily: 'DM Serif Text, serif'}}>Sign up to</h1> */}
                        <h5 className='text-center' style={{ fontFamily: 'DM Serif Text, serif', margin: '0' }}>Login <span className='fst-italic' style={{ fontFamily: 'DM Serif Text, serif' }}>to</span></h5>
                        <h1 className='display-5 fw-bold text-center'>Gavran</h1>
                        <form onSubmit={handleLoginUser}>
                            <div className='mb-2'>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    className='form-control'
                                    style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                    name='email'
                                    value={loginData.email}
                                    onChange={handleLoginData}
                                />
                            </div>
                            <div className='mb-2'>
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                    name='password'
                                    value={loginData.password}
                                    onChange={handleLoginData}
                                />
                            </div>
                            <div className='text-center'>
                                <button className='btn btn-success mb-2 mt-2' type='submit'>Login</button>
                                <p className='fst-italic' style={{ fontSize: '0.9rem' }}>Don't have an account? <Link to='/signup'>Register</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}

export default Login