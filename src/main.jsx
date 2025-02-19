import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import store from './store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import Cart from './features/cart/Cart.jsx'
import Wishlist from './features/wishlist/Wishlist.jsx'
import User from './features/user/User.jsx'
import Signup from './features/signup/Signup.jsx'
import Login from './pages/Login.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import Order from './features/order/Order.jsx'
import OrderInvoice from './features/order/OrderInvoice.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/products',
    element: <Products/>
  },
  {
    path: '/products/category/:category',
    element: <Products/>
  },
  {
    path: '/products/:id',
    element: <ProductDetails/>
  },
  {
    path: '/cart',
    element: <Cart/>
  },
  {
    path: '/wishlist',
    element: <Wishlist/>
  },
  {
    path: '/order',
    element: <Order/>
  },
  {
    path: '/order/:id',
    element: <OrderInvoice/>
  },
  {
    path: '/user',
    element: (<ProtectedRoute element={<User/>} />)
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  {
    path: '/login',
    element: <Login/>
  },


])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
