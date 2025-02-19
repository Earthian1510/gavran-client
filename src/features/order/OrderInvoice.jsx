import React from 'react'
import Header from '../../components/Header'
import { useParams, useLocation, Link } from 'react-router-dom'

const OrderInvoice = () => {
  const location = useLocation()
  const order = location.state?.order 

  const { id } = useParams()
  console.log(order)

  const totalAmount = order?.orderInfo?.reduce(
    (acc, curr) => acc + curr.productId.price_per_kg * curr.quantity,
    0
  );
  
  const deliveryCharge = totalAmount * 0.20;

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row my-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="col-md-6">
            <div className="card p-4">
              <h5
                className="text-center"
                style={{ fontFamily: "DM Serif Text, serif" }}
              >
                Invoice
              </h5>
              <hr />
              <p style={{ fontSize: "12px" }}>
                To, <br />
                <b style={{ fontSize: '14px'}}>{order?.shippingAddress?.name}</b> <br />
                {order?.shippingAddress.apartment + ", " +  order?.shippingAddress.street + ", " +  order?.shippingAddress.city + ", " } <br />
                {order?.shippingAddress.state + " - " + order?.shippingAddress.zipcode }
                <br />
                Contact No: +{order?.shippingAddress?.phoneNo} <br />
              </p>

              <div className="my-3">
                <table className="table" style={{ fontSize: "12px" }}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Rate</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.orderInfo?.map((item, index) => (
                      <tr key={item.productId._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.productId.name}</td>
                        <td>₹ {item.productId.price_per_kg}</td>
                        <td>{item.quantity}</td>
                        <td>₹ {item.productId.price_per_kg * item.quantity}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3"></td>
                      <td>Delivery Charges</td>
                      <td>₹ {deliveryCharge}</td>
                    </tr>
                    <tr className="fw-bold">
                      <td colSpan="3"></td>
                      <td>Total</td>
                      <td>₹ {totalAmount + deliveryCharge}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-3">
            <Link to='/user' className='float-end'> go back</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderInvoice