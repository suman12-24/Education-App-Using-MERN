
import { store } from "./store";
import axiosConfiguration from "../Axios_BaseUrl_Token_SetUp/axiosConfiguration";

const API_URL = "/user/update-favourite-schools-list";

export const updateFavouriteSchoolsForUser = async () => {
    try {
        // Get the latest auth state from Redux
        const { email, favouriteSchools } = store.getState().auth;

        if (!email) {
            throw new Error("User email not found in auth state");
        }

        const response = await axiosConfiguration.post(API_URL, {
            email,
            favouriteSchools,
        });

        return response?.data?.success;
    } catch (error) {
        console.error("Error updating favourite schools:", error.response?.data || error.message);
        throw error;
    }
};
