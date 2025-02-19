import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from './features/category/categorySlice'
import signupReducer from './features/signup/signupSlice'
import productsReducer from './features/products/productSlice'
import filterReducer from './features/products/filterSlice'
import cartReducer from './features/cart/cartSlice'
import wishlistReducer from './features/wishlist/wishlistSlice'
import userReducer from './features/user/userSlice'
import addressReducer from './features/address/addressSlice'
import orderReducer from './features/order/orderSlice'

const store = configureStore({
    reducer: {
        categories: categoryReducer,
        signup: signupReducer,
        products: productsReducer,
        filters: filterReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        userInfo: userReducer,
        addresses: addressReducer,
        orders: orderReducer,
    }
})

export default store