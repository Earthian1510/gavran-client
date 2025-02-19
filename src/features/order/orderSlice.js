import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../api";

const TOKEN = localStorage.getItem('token')
const headers = {
    'Content-Type': 'application/json',
    'Authorization': TOKEN ? `Bearer ${TOKEN}` : ''
}

export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAllOrders',
    async (userId) => {
        try {
            const response = await axios.get(`${API.orders}/${userId}`, { headers })
            return response.data
        }
        catch (error) {
            console.error(error)
        }
    }
)

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async({userId, newOrder}) => {
        console.log(userId)
        console.log(newOrder)
        try{
            const response = await axios.post(`${API.orders}/${userId}`, newOrder, {headers})
            return response.data 
        }
        catch(error){
            console.error(error)
        }
    }

)

export const updateOrder = createAsyncThunk(
    'orders/updateOrder',
    async (updateOrder) => {
        const response = await axios.put(`${API.orders}/${updateOrder._id}`, updateOrder, { headers })
        return response.data
    }
)

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        allOrders: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllOrders.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.status = 'success'
            state.allOrders = action.payload
        })
        builder.addCase(fetchAllOrders.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.payload.message
        })
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.allOrders.push(action.payload)
        })
        builder.addCase(updateOrder.fulfilled, (state, action) => {
            state.status = 'success'
            const index = state.allOrders.findIndex((order) => order._id === action.payload._id)

            if(index !== -1){
                state.allOrders[index] = action.payload
            }
        })
    }
})

export default ordersSlice.reducer