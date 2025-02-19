import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from '../../api'
import axios from "axios";

export const fetchAllProducts = createAsyncThunk(
    'products/fetchAllProducts',
    async () => {
        const response = await axios.get(API.products)
        return response.data
    }
)

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id) => {
        const response = await axios.get(`${API.products}/${id}`)
        return response.data
    }
)

export const fetchProductsFromCategory = createAsyncThunk(
    'products/fetchProductsFromCategory',
    async (category) => {
        const response = await axios.get(`${API.products}/${category}`)
        return response.data;
    }
)

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.status = 'success',
            state.products = action.payload
        })
        builder.addCase(fetchAllProducts.rejected, (state, action) =>{
            state.status = 'error',
            state.error = action.payload.message
        })

        builder.addCase(fetchProductsFromCategory.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchProductsFromCategory.fulfilled, (state, action) => {
            state.status = 'success',
            state.products = action.payload
        })
        builder.addCase(fetchProductsFromCategory.rejected, (state, action) =>{
            state.status = 'error',
            state.error = action.payload.message
        })
    }
})

export default productsSlice.reducer;