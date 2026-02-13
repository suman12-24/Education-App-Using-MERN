import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

// Async thunk to update favouriteSchools in the database
export const updateFavouriteSchoolsInDB = createAsyncThunk(
    'auth/updateFavouriteSchoolsInDB',
    async ({ email, favouriteSchools }, { rejectWithValue }) => {
        try {
            const response = await axiosConfiguration.post('/user/update-favourite-schools-list', {
                email,
                favouriteSchools,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating favourite schools");
        }
    }
);

const initialState = {
    email: null,
    token: null,
    role: "Guardian",
    favouriteSchools: [], // Ensure favouriteSchools is always initialized as an empty array
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            const { email, token, role } = action.payload;
            state.email = email;
            state.token = token;
            state.role = role;
            state.favouriteSchools = []; // Reset favouriteSchools here
        },
        clearAuth(state) {
            state.email = null;
            state.token = null;
            state.role = 'Guardian';
            state.favouriteSchools = [];
        },
        addFavouriteSchool(state, action) {
            // Ensure favouriteSchools is an array before calling 'includes'
            if (Array.isArray(state.favouriteSchools) && !state.favouriteSchools.includes(action.payload)) {
                state.favouriteSchools.push(action.payload);
            }
        },
        removeFavouriteSchool(state, action) {
            // Ensure favouriteSchools is an array before calling 'filter'
            if (Array.isArray(state.favouriteSchools)) {
                state.favouriteSchools = state.favouriteSchools.filter(
                    (school) => school !== action.payload
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateFavouriteSchoolsInDB.fulfilled, (state, action) => {
            console.log("Favourite schools successfully updated in DB:", action.payload);
        });
        builder.addCase(updateFavouriteSchoolsInDB.rejected, (state, action) => {
            console.error("Error updating favourite schools:", action.payload);
        });
    },
});

export const { setAuth, clearAuth, addFavouriteSchool, removeFavouriteSchool } = authSlice.actions;

export default authSlice.reducer;
