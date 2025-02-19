import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from '../../api';
import axios from "axios";

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async () => {
        const response = await axios.get(API.categories);
        return response.data;
    }
)

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.pending, (state) => {
            state.status = 'loading';
        })
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.status = 'success';
            state.categories = action.payload
        })
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.status = 'error';
            state.error = action.payload.message
        })
    }
})

export default categorySlice.reducer;