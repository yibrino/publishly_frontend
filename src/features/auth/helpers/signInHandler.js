import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../../utilities/baseUrl";
toast.configure();

export const signInHandler = createAsyncThunk(
  "auth/signIn",
  async ({ user_email, password }, { rejectWithValue }) => {
    try {
      // Make the request to the login API
      const response = await axios.post(`${BASE_URL}/user/login/`, {
        user_email,
        password,
      });
      const data = response.data;

      // Log the response to verify
      console.log("Response", data);

      // If the response is successful, store the token and user data in localStorage
      if (response.status === 200) {
        localStorage.setItem(
          "Publishly_User",
          JSON.stringify({
            token: data.encodedToken,
            userData: data.foundUser,
          })
        );

        // Show success toast
        toast.success("Welcome Back!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });

        // Return the response data to Redux
        return data;
      } else {
        // If response status is not 200, throw an error
        throw new Error("Login failed!");
      }
    } catch (error) {
      console.error("Error during login request", error);

      // Show error toast
      toast.error("Login failed!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });

      // Reject the promise with the error to handle it in the reducer
      return rejectWithValue(error.response.data || "Login failed");
    }
  }
);
