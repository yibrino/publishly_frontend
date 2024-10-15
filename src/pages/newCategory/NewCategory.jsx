import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createCategory } from "../../features/post/helpers/createCategory";
import styles from "./newCategory.module.css"; // Import the CSS module

export default function NewCategory() {
  const categoryInputs = {
    category_name: "",
    category_slug: "",
  };

  const [formInputs, setFormInputs] = useState(categoryInputs);
  const { category_name, category_slug } = formInputs;

  const dispatch = useDispatch();

  const formCreateCategoryHandler = (e) => {
    e.preventDefault();

    if (category_name && category_slug) {
      // Dispatch the action with category inputs
      dispatch(
        createCategory({
          category_name,
          category_slug,
        })
      );
      toast.success("Category created successfully!");
    } else {
      toast.error("All fields are required");
    }
  };

  return (
    <div className={styles.newUser}>
      <h1 className={styles.newUserTitle}>New Category</h1>

      <form className={styles.newUserForm} onSubmit={formCreateCategoryHandler}>
        <div className={styles.newUserItem}>
          <label>Category Name</label>
          <input
            type="text"
            placeholder="Education"
            value={category_name}
            onChange={(e) =>
              setFormInputs({ ...formInputs, category_name: e.target.value })
            }
          />
        </div>

        <div className={styles.newUserItem}>
          <label>Category Slug</label>
          <input
            type="text"
            placeholder="education"
            value={category_slug}
            onChange={(e) =>
              setFormInputs({ ...formInputs, category_slug: e.target.value })
            }
          />
        </div>

        <button className={styles.newUserButton} type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
