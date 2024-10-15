import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const deleteCategory = createAsyncThunk(
  "post/deleteCategory",
  async ({ category_id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/category/${category_id}/`
      );
      console.log("Response Category", response);
      const data = response.data;

      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
