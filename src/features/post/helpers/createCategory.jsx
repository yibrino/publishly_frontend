import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const createCategory = createAsyncThunk(
  "post/createCategory",
  async ({ category_name, category_slug }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/category/create/`, {
        category_name: category_name,
        category_slug: category_slug,
      });
      console.log("Response from  create category", response);
      const data = response.data;

      if (response.status === 201) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
