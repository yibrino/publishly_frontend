import React, { useState, useEffect } from "react";
import "./categoryList.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { getAllCategories } from "../../features/post/helpers";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../../features/post/helpers/deleteCategory";

export default function CategoryList() {
  const {
    posts: { posts, categories },
  } = useSelector((state) => state);
  console.log("All Posts", posts);
  const [data, setData] = useState(categories);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Create a navigate instance

  useEffect(() => {
    dispatch(getAllCategories()); // Fetch categories
  }, [dispatch]);

  const handleDelete = (category_id) => {
    console.log("Category ID", category_id);
    // Optimistically update the UI by removing the category locally
    setData(data.filter((category) => category.category_id !== category_id));

    // Dispatch the delete action to remove the category from the backend
    dispatch(deleteCategory({ category_id: category_id }))
      .then(() => {
        console.log(`Category with id ${category_id} deleted successfully.`);
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "category_slug",
      headerName: "Slug",
      width: 200,
    },
    {
      field: "category_name",
      headerName: "Category Name",
      width: 250,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/category/${params.row.id}`}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  // Map category data to fit the DataGrid's expected `id` format
  const rows = categories.map((category) => ({
    id: category.category_id || Math.random(), // Fallback if category_id is missing
    category_slug: category.category_slug,
    category_name: category.category_name,
  }));

  return (
    <div className="userList">
      {/* Create Button */}
      <div className="userListHeader">
        <h2>Categories</h2>
        <button
          className="createUserButton"
          onClick={() => navigate("/admin/newCategory")}
        >
          Create Category
        </button>
      </div>

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
