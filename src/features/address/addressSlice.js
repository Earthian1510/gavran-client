import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from '../../api';


const TOKEN = localStorage.getItem('token')
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
};

export const fetchAllAddresses = createAsyncThunk(
    'address/fetchAllAddresses',
    async (userId) => {
        try {
            const response = await axios.get(`${API.address}/${userId}`, { headers })
            return response.data;
        }
        catch (error) {
            console.error(error)
        }
    }
)

export const fetchPrimaryAddress = createAsyncThunk(
    'address/fetchPrimaryAddress',
    async (userId) => {
        try {
            const response = await axios.get(`${API.address}/${userId}/primary`, { headers })
            return response.data;
        }
        catch (error) {
            console.error(error)
        }
    }
)

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async ({ userId, newAddress }) => {
        try {
            const response = await axios.post(`${API.address}/${userId}`, newAddress, { headers })
            return response.data
        }
        catch (error) {
            console.error(error)
        }
    }
)

export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async (updatedAddress) => {
        const response = await axios.put(`${API.address}/${updatedAddress._id}`, updatedAddress, { headers })
        return response.data
    }
)

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (addressId) => {
        await axios.delete(`${API.address}/${addressId}`, { headers })
        return addressId
    }
)

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        allAddresses: [],
        primaryAddress: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllAddresses.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchAllAddresses.fulfilled, (state, action) => {
            state.status = 'success',
                state.allAddresses = action.payload;
        })
        builder.addCase(fetchAllAddresses.rejected, (state, action) => {
            state.status = 'error',
                state.error = action.payload.message;
        })
        builder.addCase(fetchPrimaryAddress.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchPrimaryAddress.fulfilled, (state, action) => {
            state.status = 'success',
                state.primaryAddress = action.payload;
        })
        builder.addCase(fetchPrimaryAddress.rejected, (state, action) => {
            state.status = 'error',
            state.error = action.payload.message;
        })
        builder.addCase(addAddress.fulfilled, (state, action) => {
            state.allAddresses.push(action.payload)
        })
        .addCase(updateAddress.pending, (state) => {
            state.status = 'loading';
        })
        builder.addCase(updateAddress.fulfilled, (state, action) => {
            state.status = 'success';
            const index = state.allAddresses.findIndex((address) => address._id === action.payload._id)
            if (index !== -1) {
                state.allAddresses[index] = action.payload
            }

            if (state.primaryAddress?._id === action.payload._id) {
                state.primaryAddress = action.payload;
            }
        })
        builder.addCase(deleteAddress.fulfilled, (state, action) => {
            state.allAddresses = state.allAddresses.filter((address) => address._id !== action.payload)
        })

    }
})

export default addressSlice.reducer