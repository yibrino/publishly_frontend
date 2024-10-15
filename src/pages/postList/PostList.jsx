import React, { useState, useEffect } from "react";
import "./postlist.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "../../features/post/helpers";

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
      field: "comments_count", // Renamed the field to reflect it's a comment count
      headerName: "Comments",
      width: 150,
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

  // Map post data to fit the DataGrid's expected `id` format and count comments
  const rows = posts.map((post) => ({
    id: post.post_id, // Use post_id for the DataGrid
    user: post.user, // Display user ID or username
    post_content: post.post_content, // Display post content
    category: post.category.category_name, // Display category name
    post_like_count: post.post_like_count, // Display like count
    comments_count: post.comments ? post.comments.length : 0, // Display the number of comments
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
