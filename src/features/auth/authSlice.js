import { createSlice } from "@reduxjs/toolkit";
import { signInHandler } from "./helpers";
import { toast } from "react-toastify";

const initialState = {
  token: localStorage.getItem("Publishly_User")
    ? JSON.parse(localStorage.getItem("Publishly_User")).token
    : "",
  userData: localStorage.getItem("Publishly_User")
    ? JSON.parse(localStorage.getItem("Publishly_User")).userData
    : {},
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOutHandler: (state) => {
      localStorage.removeItem("Publishly_User");
      state.token = "";
      state.userData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle sign-in pending state (show loader)
      .addCase(signInHandler.pending, (state) => {
        state.isLoading = true;
      })
      // Handle sign-in fulfilled state (store token and user data)
      .addCase(signInHandler.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.token = payload.encodedToken;
        state.userData = payload.foundUser;

        // Store in localStorage
        localStorage.setItem(
          "Publishly_User",
          JSON.stringify({
            token: payload.encodedToken,
            userData: payload.foundUser,
          })
        );
      })
      // Handle sign-in rejected state (show error message)
      .addCase(signInHandler.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error("Password does not match!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      });
  },
});

export const { signOutHandler } = authSlice.actions;

export default authSlice.reducer;
