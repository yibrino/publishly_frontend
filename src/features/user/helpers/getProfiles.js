import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utilities/baseUrl";
export const getProfiles = createAsyncThunk(
  "user/getProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/profiles/`);
      console.log("Response profiles", response);
      const data = response.data;

      if (response.status === 200) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);
