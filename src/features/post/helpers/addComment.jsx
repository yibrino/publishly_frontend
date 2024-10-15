import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const addComment = createAsyncThunk(
  "/post/addComment",
  async (
    { post_id, token, comment_content, commented_by },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/comment/create/${post_id}/`,
        {
          comment_content: comment_content,
          commented_by: commented_by,
        },
        { headers: { authorization: token } }
      );
      console.log("Response from  create comment", response);
      const data = response.data;

      if (response.status === 201) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
