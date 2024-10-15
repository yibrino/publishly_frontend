import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const editComment = createAsyncThunk(
  "/post/editComment",
  async (
    { comment_id, token, comment_content, commented_by },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/comment/update/${comment_id}/`,
        {
          comment_content: comment_content,
          commented_by: commented_by,
        },
        { headers: { authorization: token } }
      );
      const data = response.data;
      console.log("Response from  update comment", data);
      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
