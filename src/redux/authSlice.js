import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  access_token: null,
  company_id: null,
  first_name: '',
  role: '',
  email:'',
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { company_id, email, access_token, first_name, role } = action.payload;
      state.access_token = access_token;
      state.company_id = company_id;
      state.first_name = first_name;
      state.role = role;
      state.email = email;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
