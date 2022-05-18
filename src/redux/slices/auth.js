import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    id: null,
  },
  reducers: {
    login: (state, { payload: { token, id } }) => {
      state.token = token;
      state.id = id;
    },
    logout: (state) => {
      state.token = null;
      state.id = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
