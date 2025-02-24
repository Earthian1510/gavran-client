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
       builder.addCase(signupUser.pending, (state) => {
        state.status = 'loading';
       })
       builder.addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.message = action.payload;
       })
       builder.addCase(signupUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload
       })
    }
});

export default signupSlice.reducer;
