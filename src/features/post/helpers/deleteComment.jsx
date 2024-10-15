import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const deleteComment = createAsyncThunk(
  "/post/deleteComment",
  async ({ comment_id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/comment/${comment_id}/`);
      console.log("Response post", response);
      const data = response.data;

      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
