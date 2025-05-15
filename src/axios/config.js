import axios from 'axios';
import { store, persistor } from '../redux/store'
import { setCredentials, logout } from '../redux/authSlice'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request Interceptor: Attach latest access_token from Redux
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh token if expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state.auth.refresh_token;

        // const res = await axios.post(
        //   `${import.meta.env.VITE_API_BASE_URL}/company/refresh-token`,
        //   { refresh_token: refreshToken }
        // );

        const newAccessToken = res.data.access_token;

        //  Update Redux state with new token
        store.dispatch(setCredentials({ ...state.auth, access_token: newAccessToken }));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // console.error('Token refresh failed:', refreshError);

        // // Optionally log the user out if refresh fails
        // store.dispatch(logout());
        // return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
