import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPosts,
  createPost,
  editPost,
  deletePost,
  likePost,
  dislikePost,
  addComment,
  editComment,
  deleteComment,
  getAllCategories,
} from "./helpers";
import { editCategory } from "./helpers/editCategory";
import { deleteCategory } from "./helpers/deleteCategory";
import { createCategory } from "./helpers/createCategory";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const initialState = {
  isLoading: false,
  error: "",
  showPostModal: false,
  posts: [],
  categories: [],
  activeCategory: null, // Add activeCategory to track the selected category

  editPostObj: null,
  searchResults: [],
  searchQuery: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    openPostModal: (state) => {
      state.showPostModal = true;
    },
    closePostModal: (state) => {
      state.showPostModal = false;
    },
    setEditPostObj: (state, { payload }) => {
      state.editPostObj = payload;
    },
    searchPost: (state, { payload }) => {
      state.searchQuery = payload;
      state.searchResults = state.posts.filter(
        (post) =>
          post.post_content
            .toLowerCase()
            .includes(payload.trim().toLowerCase()) ||
          post.category.category_name
            .toLowerCase()
            .includes(payload.trim().toLowerCase())
      );
    },
    setActiveCategory: (state, { payload }) => {
      state.activeCategory = payload;
    },
  },

  extraReducers: {
    [getAllPosts.pending]: (state) => {
      state.isLoading = true;
      state.error = "";
    },
    [getAllPosts.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.posts = payload;
    },
    [getAllPosts.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },

    // Categories
    [getAllCategories.pending]: (state) => {
      state.isLoading = true;
      state.error = "";
    },
    [getAllCategories.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.categories = payload;
    },
    [getAllCategories.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    [createCategory.fulfilled]: (state, { payload }) => {
      state.categories = [payload, ...state.categories]; // Add the new post to the posts array
      toast("Category Created", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [createCategory.rejected]: (state, { payload }) => {
      state.error = payload;
    },
    [deleteCategory.fulfilled]: (state, { payload }) => {
      // Remove the deleted post from the posts array
      state.categories = state.categories.filter(
        (category) => category.category_id !== payload.category_id
      );
      toast("Category Deleted", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [deleteCategory.rejected]: (state, { payload }) => {
      state.error = payload;
    },
    [editCategory.fulfilled]: (state, { payload }) => {
      // Update the category in the categories array
      state.categories = state.categories.map((category) =>
        category.category_id === payload.category_id ? payload : category
      );
      toast("Category Edited", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [editCategory.rejected]: (state, { payload }) => {
      state.error = payload;
    },
    // create Post
    [createPost.fulfilled]: (state, { payload }) => {
      state.posts = [payload, ...state.posts]; // Add the new post to the posts array
      toast("Post Created", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [createPost.rejected]: (state, { payload }) => {
      state.error = payload;
    },

    // edit Post
    [editPost.fulfilled]: (state, { payload }) => {
      // Update the post in the posts array
      state.posts = state.posts.map((post) =>
        post.post_id === payload.post_id ? payload : post
      );
      toast("Post Edited", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [editPost.rejected]: (state, { payload }) => {
      state.error = payload;
    },

    // delete Post
    [deletePost.fulfilled]: (state, { payload }) => {
      // Remove the deleted post from the posts array
      state.posts = state.posts.filter(
        (post) => post.post_id !== payload.post_id
      );
      toast("Post Deleted", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [deletePost.rejected]: (state, { payload }) => {
      state.error = payload;
    },

    // like Post
    [likePost.fulfilled]: (state, { payload }) => {
      state.posts = state.posts.map((post) =>
        post.post_id === payload.post_id ? payload : post
      );
      toast("Like added", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [likePost.rejected]: (state, { payload }) => {
      state.error = payload;
    },

    // dislike Post
    [dislikePost.fulfilled]: (state, { payload }) => {
      state.posts = state.posts.map((post) =>
        post.post_id === payload.post_id ? payload : post
      );
      toast("Like removed", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [dislikePost.rejected]: (state, { payload }) => {
      state.error = payload;
    },

    // add comment
    [addComment.fulfilled]: (state, { payload }) => {
      state.posts = state.posts.map((post) =>
        post.post_id === payload.post_id ? payload : post
      );
      toast("Comment Added", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [addComment.rejected]: (state, { payload }) => {
      state.error = payload;
    },

    // edit comment
    [editComment.fulfilled]: (state, { payload }) => {
      state.posts = state.posts.map((post) =>
        post.post_id === payload.post_id ? payload : post
      );
      toast("Comment Edited", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [editComment.rejected]: (state, { payload }) => {
      state.error = payload;
    },

    // delete comment
    [deleteComment.fulfilled]: (state, { payload }) => {
      state.posts = state.posts.map((post) =>
        post.post_id === payload.post_id ? payload : post
      );
      toast("Comment Deleted", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    },
    [deleteComment.rejected]: (state, { payload }) => {
      state.error = payload;
    },
  },
});

export const {
  openPostModal,
  setActiveCategory,
  searchPost,
  closePostModal,
  setEditPostObj,
} = postSlice.actions;

export default postSlice.reducer;
