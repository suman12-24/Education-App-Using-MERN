import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email: null,
    token: null,
    role: "Guardian",
    favouriteSchools: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            const { email, token, role, favouriteSchools } = action.payload;
            state.email = email;
            state.token = token;
            state.role = role;
            state.favouriteSchools = favouriteSchools || [];
        },
        clearAuth(state) {
            state.email = null;
            state.token = null;
            state.role = 'Guardian';
            state.favouriteSchools = [];
        },
        addFavouriteSchool(state, action) {
            if (!state.favouriteSchools.includes(action.payload)) {
                state.favouriteSchools.push(action.payload);
            }
        },
        removeFavouriteSchool(state, action) {
            state.favouriteSchools = state.favouriteSchools.filter(id => id !== action.payload);
        },
        updateFavouriteSchools(state, action) {
            // Replace the entire favouriteSchools array
            state.favouriteSchools = action.payload;
        },
    },
});

export const { setAuth, clearAuth, addFavouriteSchool, removeFavouriteSchool, updateFavouriteSchools } = authSlice.actions;
export default authSlice.reducer;
