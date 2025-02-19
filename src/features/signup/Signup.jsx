import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from './signupSlice'
import { useDispatch } from 'react-redux'
import Modal from '../../components/Modal'

const Signup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showMsg, setShowMsg] = useState(false)
    const [msg, setMsg] = useState('')

    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: ''
    })


    const handleSignupData = (e) => {
        const { name, value } = e.target
        setSignupData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUserSignup = (e) => {
        e.preventDefault()

        dispatch(signupUser(signupData))
            .then(() => {
                
                setSignupData({
                    name: '',
                    email: '',
                    password: ''
                })

                setMsg('Signup Successful!')
                setShowMsg(true)
                
                setTimeout(() => {
                    setMsg('')
                    setShowMsg(false)
                    navigate('/login')
                }, 3000)
            })
    }

    return (
        <div className="container my-5">
            <Modal show={showMsg} message={msg} />
            <div className='d-flex justify-content-center align-items-center mb-5 mt-3'>
                <div className='card p-4' style={{ width: '20rem' }}>
                    <h5 className='text-center' style={{ fontFamily: 'DM Serif Text, serif', margin: '0' }}>Sign up <span className='fst-italic' style={{ fontFamily: 'DM Serif Text, serif' }}>to</span></h5>
                    <h1 className='display-5 fw-bold text-center'>Gavran</h1>
                    <form onSubmit={handleUserSignup}>
                        <div className='mb-2'>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                className='form-control'
                                style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                name="name"
                                value={signupData.name}
                                onChange={handleSignupData}
                                required
                            />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="email">Email:</label>
                            {/* !!! Validate Email */}
                            <input
                                type="email"
                                className='form-control'
                                style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                name="email"
                                value={signupData.email}
                                onChange={handleSignupData}
                                required
                            />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="text"
                                className='form-control'
                                style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                name="password"
                                value={signupData.password}
                                onChange={handleSignupData}
                                required
                            />
                        </div>
                        <div className='text-center'>
                            <button className='btn btn-success mb-2 mt-2' type='submit'>Sign up</button>
                            <p className='fst-italic' style={{ fontSize: '0.9rem' }}>Already have an account? <Link to='/login'>Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>

    )
}

export default Signup