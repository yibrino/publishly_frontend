import React from "react";
import { useSelector } from "react-redux";
import "./featuredInfo.css";
import { getAllCategories } from "../../features/post/helpers";
import { getAllPosts } from "../../features/post/helpers";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUsers } from "../../features/user/helpers";
export default function FeaturedInfo() {
  // Get users, posts, and categories from the state
  const {
    user: { users },
    posts: { posts, categories },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch users and posts when the component mounts
    dispatch(getUsers()); // Ensure users are fetched
    dispatch(getAllCategories()); // Ensure users are fetched
    dispatch(getAllPosts());
  }, [dispatch]);
  // Calculate total counts
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const totalCategories = categories.length;

  return (
    <div className="featured">
      {/* Total Users */}
      <div className="featuredItem">
        <span className="featuredTitle">Total Users</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{totalUsers}</span>
        </div>
      </div>

      {/* Total Posts */}
      <div className="featuredItem">
        <span className="featuredTitle">Total Posts</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{totalPosts}</span>
        </div>
      </div>

      {/* Total Categories */}
      <div className="featuredItem">
        <span className="featuredTitle">Total Categories</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{totalCategories}</span>
        </div>
      </div>
    </div>
  );
}
