import React, { useState } from "react";
import "./postlist.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllPosts } from "../../features/post/helpers";
import { getUsers } from "../../features/user/helpers";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function UserList() {
  const {
    posts: { posts },
  } = useSelector((state) => state); // Access posts from the state

  const [data, setData] = useState(posts);
  console.log("All posts", posts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.user_id !== id));
  };

  const columns = [
    { field: "id", headerName: "Post ID", width: 90 }, // Using post_id as id
    {
      field: "user",
      headerName: "User",
      width: 230,
      renderCell: (params) => {
        return <div className="postListUser">{params.row.user}</div>;
      },
    },
    { field: "post_content", headerName: "Post Content", width: 300 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "post_like_count", headerName: "Likes", width: 120 },
    {
      field: "comments",
      headerName: "Comments",
      width: 150,
      valueGetter: (params) => params.row.comments.length, // Show count of comments
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.post_id)}
            />
          </>
        );
      },
    },
  ];

  // Map user data to fit the DataGrid's expected `id` format
  const rows = posts.map((post) => ({
    id: post.post_id, // Use post_id for the DataGrid
    user: post.user, // Display user ID or username
    post_content: post.post_content, // Display post content
    category: post.category.category_name, // Display category name
    post_like_count: post.post_like_count, // Display like count
    comments: post.comments, // Pass the comments array to count them later
  }));

  return (
    <div className="userList">
      <DataGrid
        rows={rows}
        disableSelectionOnClick
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        checkboxSelection
      />
    </div>
  );
}
