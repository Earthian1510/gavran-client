import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../api"

const TOKEN = localStorage.getItem('token')
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (userId) => {
        try {
            const response = await axios.get(`${API.cart}/${userId}`, { headers });
            const data = await response.data;
            return data.items
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ userId, product }) => {
        try {
            const response = await axios.post(`${API.cart}/${userId}/items`, product, { headers });
            const items = response.data.updatedCart.items;

            const lastItem = items[items.length - 1];
            return lastItem;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const increaseItemQuantity = createAsyncThunk(
    'cart/increaseItemQuantity',
    async ({ userId, productId }) => {
        try {
            const response = await axios.patch(`${API.cart}/${userId}/items/${productId}/increase`, {}, { headers })
            const updatedItem = response.data.items.find((item) => item.productId === productId)
            return updatedItem;
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }
)

export const decreaseItemQuantity = createAsyncThunk(
    'cart/decreaseItemQuantity',
    async ({ userId, productId }) => {
        try {
            const response = await axios.patch(`${API.cart}/${userId}/items/${productId}/decrease`, {}, { headers });
            const updatedItem = await response.data.items.find((item) => item.productId === productId)
            return updatedItem;

        } catch (error) {
            console.error(error);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async ({ userId, productId }) => {
        try {
            const response = await axios.delete(`${API.cart}/${userId}/items/${productId}`, { headers })
            return productId;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const clearUserCart = createAsyncThunk(
    'cart/clearUserCart',
    async (userId) => {
        try {
            const response = await axios.delete(`${API.cart}/${userId}`, { headers });
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.status = 'success',
                state.items = action.payload;
        })
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.status = 'error',
                state.error = action.payload.message;
        })

        builder.addCase(addToCart.fulfilled, (state, action) => {

            const updatedCart = action.payload;
            const existingItem = state.items.find((item) => item.productId._id === updatedCart.productId._id);

            if (existingItem) {
                existingItem.quantity += updatedCart.quantity;
            } else {
                state.items.push(updatedCart);
            }
        });

        builder.addCase(increaseItemQuantity.fulfilled, (state, action) => {
            
            const existingItem = state.items.findIndex((item) => 
                item._id == action.payload._id
            );
            state.items[existingItem].quantity += 1;  
        });
        
        builder.addCase(decreaseItemQuantity.fulfilled, (state, action) => {

            console.log(action.payload)
            
            const existingItem = state.items.findIndex((item) => 
                item._id == action.payload._id
            );
            state.items[existingItem].quantity -= 1; 
            
        });
        

        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            const findItem = state.items.findIndex((item) => item.productId._id == action.payload)
            console.log(findItem)
            state.items.splice(findItem, 1)
        })

        builder.addCase(clearUserCart.fulfilled, (state, action) => {
            state.items.length = 0;
        })
    }
})

export default cartSlice.reducer