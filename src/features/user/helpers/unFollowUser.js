import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const unFollowUser = createAsyncThunk(
  "user/unfollow",
  async ({ user_id, follower_user_id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/user/unfollow/${user_id}/`,
        {
          headers: { authorization: token },
          data: { follower_user_id: follower_user_id }, // Send data in 'data' field for DELETE requests
        }
      );

      const data = response.data;

      console.log("Response from unfollow user", data);

      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
