import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const editPost = createAsyncThunk(
  "post/editPost",
  async ({ content, url, post_id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/post/update/${post_id}/`,
        {
          post_content: content,
          post_image_url: url,
          //   post_like_count: 3,
          //   post_liked_by: [6],
        },
        { headers: { authorization: token } }
      );
      const data = response.data;
      console.log("Response from  update post", data);
      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
