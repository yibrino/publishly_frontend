import { createSlice } from "@reduxjs/toolkit";
import {
  getUsers,
  deleteUser,
  updateUser,
  getProfiles,
  followUser,
  unFollowUser,
} from "./helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createProfile } from "./helpers/createProfile";
toast.configure();

const initialState = {
  users: [],
  profiles: [],
  upLoadingPhoto: false,
  isLoading: false,
  error: "",
  searchResults: [],
  searchQuery: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    startUpLoading: (state) => {
      state.upLoadingPhoto = true;
    },
    searchUser: (state, { payload }) => {
      state.searchQuery = payload;
      state.searchResults = state.users.filter(
        (user) =>
          user.user_username
            .toLowerCase()
            .includes(payload.trim().toLowerCase()) ||
          user.user_firstname
            .toLowerCase()
            .includes(payload.trim().toLowerCase()) ||
          user.user_lastname
            .toLowerCase()
            .includes(payload.trim().toLowerCase())
      );
    },
  },
  extraReducers: {
    //getUser

    [getUsers.pending]: (state) => {
      state.isLoading = true;
      state.error = "";
    },
    [getUsers.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.users = payload;
    },
    [getUsers.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    //get profiles

    [getProfiles.pending]: (state) => {
      state.isLoading = true;
      state.error = "";
    },
    [getProfiles.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.profiles = payload;
    },
    [getProfiles.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },

    // Create Profile

    [createProfile.pending]: (state) => {
      state.upLoadingPhoto = false;
      state.error = "";
    },
    [createProfile.fulfilled]: (state, { payload }) => {
      state.posts = [payload, ...state.profiles]; // Add the new post to the posts array
      toast("Profile Created", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    //Delete user
    [deleteUser.fulfilled]: (state, { payload }) => {
      // Remove the deleted user from the users array
      state.users = state.users.filter(
        (user) => user.user_id !== payload.user_id
      );
      toast("User Deleted", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [deleteUser.rejected]: (state, { payload }) => {
      state.error = payload;
    },
    // updateUser

    [updateUser.pending]: (state) => {
      state.upLoadingPhoto = true;
      state.error = "";
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      state.upLoadingPhoto = false;
      state.users = state.users.map((user) =>
        user.username === payload.username ? payload : user
      );

      toast("Updated Profile", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },

    [updateUser.rejected]: (state, { payload }) => {
      state.upLoadingPhoto = false;
      state.error = payload;
    },

    // follow user

    [followUser.pending]: (state) => {
      state.isLoading = true;
      state.error = "";
    },
    [followUser.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      // Show notification
      toast("User Followed", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },

    [followUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },

    //unfollow user

    [unFollowUser.pending]: (state) => {
      state.isLoading = true;
      state.error = "";
    },
    [unFollowUser.fulfilled]: (state, { payload }) => {
      state.isLoading = false;

      // Show notification
      toast("User Unfollowed", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },

    [unFollowUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
  },
});

export const { setLoading, startUpLoading, searchUser } = userSlice.actions;

export default userSlice.reducer;
