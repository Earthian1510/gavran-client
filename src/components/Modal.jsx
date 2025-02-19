import React from 'react'

const Modal = ({ show, message }) => {
    if(!show) return null;

    return (
        <div className='container text-center' style={{ border: '1px solid black', width: '20rem' , borderRadius: '5px', background: '#dafad4'}}>
            <p style={{ fontFamily: "DM Serif Text, serif", marginTop: '10px'}}>{message}</p>
        </div>
    )
}

export default Modal