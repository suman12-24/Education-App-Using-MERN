import axios from 'axios';
import { store } from '../Redux/store';

export const baseURL = 'your base url';

const axiosConfiguration = axios.create({
    baseURL: baseURL,
});

axiosConfiguration.interceptors.request.use(
    async (config) => {
        try {
            // Conditionally delete the Authorization header for a specific request
            if (config.url === '/user/send-login-otp') {
                delete config.headers.Authorization;
                //  console.log('Authorization header deleted for request to:', config.url);
            }
            else {
                if (config.url === '/user/verify-login-otp') {
                    delete config.headers.Authorization;
                    //  console.log('Authorization header deleted for request to:', config.url);
                } else {
                    // Get the token from Redux store using the current state
                    const state = store.getState();
                    const token = state.auth?.token; // Adjust the path to your token in the Redux state

                    // Clear the previous token
                    delete config.headers.Authorization;
                    if (token) {
                        config.headers.Authorization = token;
                        // console.log('Token set in headers:', config.headers.Authorization);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosConfiguration;
