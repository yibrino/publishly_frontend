import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";

export const likePost = createAsyncThunk(
  "post/likePost",
  async ({ postId, user_id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/posts/like/${postId}/`,
        {
          user_id: user_id,
        },
        { headers: { authorization: token } }
      );
      console.log("Response from  like a post", response);
      const data = response.data;

      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
