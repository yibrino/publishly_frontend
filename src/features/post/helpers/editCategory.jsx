import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const editCategory = createAsyncThunk(
  "post/editCategory",
  async (
    { category_id, category_name, category_slug },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/category/update/${category_id}/`,
        {
          category_name: category_name,
          category_slug: category_slug,
        }
      );
      const data = response.data;
      console.log("Response from  update category", data);
      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
