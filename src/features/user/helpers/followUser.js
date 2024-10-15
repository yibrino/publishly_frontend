import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const followUser = createAsyncThunk(
  "user/follow",
  async ({ user_id, follower_user_id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/follow/${user_id}/`,
        {
          follower_user_id: follower_user_id,
        },
        { headers: { authorization: token } }
      );
      const data = response.data;

      console.log("Response from  follow user", data);

      if (response.status === 201) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
