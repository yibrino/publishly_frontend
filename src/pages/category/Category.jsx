import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../features/post/helpers";
import { editCategory } from "../../features/post/helpers/editCategory";
import "./category.css";

export default function Category() {
  const { categoryId } = useParams(); // Extract categoryId from the URL
  const {
    posts: { categories },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  useEffect(() => {
    dispatch(getAllCategories()); // Fetch categories
  }, [dispatch]);

  const currentCategory = categories.find(
    (category) => category.category_id == categoryId
  );

  useEffect(() => {
    if (currentCategory) {
      setCategoryName(currentCategory.category_name);
      setCategorySlug(currentCategory.category_slug);
    }
  }, [currentCategory]);

  const handleUpdate = (e) => {
    e.preventDefault();
    // Dispatch the editCategory action with category_name and category_slug separately
    dispatch(
      editCategory({
        category_id: categoryId,
        category_name: categoryName,
        category_slug: categorySlug,
      })
    ).then(() => {
      // Update the UI immediately after successful update
      const updatedCategories = categories.map((category) =>
        category.category_id == categoryId
          ? {
              ...category,
              category_name: categoryName,
              category_slug: categorySlug,
            }
          : category
      );
      // You may also store this in Redux or update the component's state directly
      // For instance, you can update local state here or trigger a re-fetch of categories
      console.log("Updated categories:", updatedCategories);
    });
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit Category</h1>
        <Link to={"/admin/newCategory"}>
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleUpdate}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="category_name"
                  className="userUpdateInput"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Category Slug</label>
                <input
                  type="text"
                  placeholder="category_slug"
                  className="userUpdateInput"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <button type="submit" className="userUpdateButton">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
