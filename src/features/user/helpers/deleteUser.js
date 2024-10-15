import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const deleteUser = createAsyncThunk(
  "post/deleteUser",
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/user/${user_id}/`);
      console.log("Response User", response);
      const data = response.data;

      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
