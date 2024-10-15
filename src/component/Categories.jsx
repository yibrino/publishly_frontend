import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../features/post/helpers";
import { useDispatch, useSelector } from "react-redux";

const Categories = () => {
  const [activeCategorySlug, setActiveCategorySlug] = useState(null); // Local state to track active category

  const dispatch = useDispatch();

  const {
    posts: { categories },
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleCategoryClick = (category_slug) => {
    setActiveCategorySlug(category_slug); // Set the clicked category slug as active
  };

  return (
    <div className="bg-gray-100 shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
      {categories.map((category, index) => (
        <Link
          key={index}
          to={`/category/${category.category_slug}`}
          onClick={() => handleCategoryClick(category.category_slug)} // Handle category click
        >
          <span
            className={`cursor-pointer block ${
              category.category_slug === activeCategorySlug
                ? "text-blue-500 font-bold" // Mark active category using local state
                : ""
            } ${
              index === categories.length - 1 ? "border-b-0" : "border-b"
            } pb-3 mb-3`}
          >
            {category.category_name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Categories;
