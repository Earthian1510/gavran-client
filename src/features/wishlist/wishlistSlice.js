import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../api"

const TOKEN = localStorage.getItem('token')
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
};

export const fetchWishlist = createAsyncThunk(
    'cart/fetchWishlist',
    async (userId) => {
        try {
            const response = await axios.get(`${API.wishlist}/${userId}`, { headers });
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const addToWishlist = createAsyncThunk(
    'cart/addToWishlist',
    async ({ userId, productId }) => {
        try {
            const response = await axios.post(`${API.wishlist}/${userId}/products`, { productId }, { headers });
            const lastProduct =  await response.data[response.data.length - 1];
            return lastProduct;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async ({ userId, productId }) => {
        try{
            const response = await axios.delete(`${API.wishlist}/${userId}/products/${productId}`, { headers })
            return productId;
        }
        catch(error){
            console.error(error)
        }
    }
)


const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        products: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchWishlist.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchWishlist.fulfilled, (state, action) => {
            state.status = 'success',
            state.products = action.payload.products;
        })
        builder.addCase(fetchWishlist.rejected, (state, action) => {
            state.status = 'error',
            state.error = action.payload.message;
        })

        builder.addCase(addToWishlist.fulfilled, (state, action) => {
            state.products.push(action.payload); 
          
        })
        builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
            const removedProduct = state.products.findIndex((product) => product._id === action.payload)
            state.products.splice(removedProduct, 1)
        })

    }
})

export default wishlistSlice.reducer;