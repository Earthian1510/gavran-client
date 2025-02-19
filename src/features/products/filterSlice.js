import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: 'filters',
    initialState: {
        selectedCategories: [],
        sortBy: null,
        searchQuery: "",
        priceRange: 0,
    },
    reducers: {
        setCategories : (state, action) => {
            state.selectedCategories = action.payload
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload
        },
        setSearchQuery: (state, action) => { 
            state.searchQuery = action.payload;
        },
        setPriceRange: (state, action) => {
            state.priceRange = action.payload
        },
        clearFilters: (state) => {
            state.selectedCategories = [];
            state.sortBy = null;
            state.searchQuery = '',
            state.priceRange = 0
        }
    }
})

export const { setCategories, setSortBy, setSearchQuery, setPriceRange,clearFilters } = filterSlice.actions;
export default filterSlice.reducer;