import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from '../../api';

export const signupUser = createAsyncThunk(
    'signup/signupUser',
    async(userData) => {
        const response = await axios.post(API.signup, userData)
        console.log(response.data.message)
        return response.data.message;
    }
)

const signupSlice = createSlice({
    name: 'signup',
    initialState: {
        status: 'idle',
        error: null,
        message: null, 
    },
    reducers: {},
    extraReducers: (builder) => {
       
    }
});

export default signupSlice.reducer;
