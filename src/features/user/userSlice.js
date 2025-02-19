import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from '../../api';
import axios from "axios";


const TOKEN = localStorage.getItem('token')
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
};

export const fetchUserInfo = createAsyncThunk(
    'userInfo/fetchUserInfo',
    async (userId) => {
        const response = await axios.get(`${API.user}/${userId}`, { headers });
        return response.data;
    }
)

export const updateUserInfo = createAsyncThunk(
    'userInfo/updateUserInfo',
    async ({ userId, userData }) => {
        const response = await axios.put(`${API.user}/${userId}`, userData, { headers });
        return response.data
    }
)

export const uploadUserImage = createAsyncThunk(
    'userInfo/uploadUserImage',
    async(file) => {
       const formData = new FormData();
       formData.append('image', file)
       const uploadResponse = await axios.post(`${API.user}/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${TOKEN}`,
        }
       })
       return uploadResponse.data.imageUrl;

    }
)

const userSlice = createSlice({
    name: 'userInfo',
    initialState: {
        userInfo: {},
        status: 'idle',
        error: null,
        uploadStatus: 'idle'
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserInfo.pending, (state) => {
            state.status = 'loading';
        })
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            state.status = 'success';
            state.userInfo = action.payload
        })
        builder.addCase(fetchUserInfo.rejected, (state, action) => {
            state.status = 'error';
            state.error = action.payload.message
        })
        builder.addCase(updateUserInfo.fulfilled, (state, action) => {
            console.log(action.payload)
        })
        builder.addCase(uploadUserImage.pending, (state) => {
            state.uploadStatus = 'loading';
        });
        builder.addCase(uploadUserImage.fulfilled, (state, action) => {
            state.uploadStatus = 'success';
            state.userInfo.userImage = action.payload;
        });
    }
})

export default userSlice.reducer;