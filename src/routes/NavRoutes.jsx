import { Routes, Route, Navigate } from "react-router-dom";
import { Home, Signup, Signin, Explore, Profile, SinglePost } from "../pages";
import { CategoryPage } from "../pages/categoryPage/CategoryPage";

import HomePage from "../pages/home";
import AdminHome from "../pages/admin/Home";

import { useSelector } from "react-redux";
import Mockman from "mockman-js";

export const NavRoutes = () => {
  const {
    auth: { token, userData },
  } = useSelector((state) => state);

  console.log("userData", userData);
  console.log("token", token);

  return (
    <Routes>
      {/* Mock API route */}
      <Route path={"/mock"} element={<Mockman />} />

      {/* If user is logged in */}
      {token ? (
        <>
          <Route
            path="/login"
            element={
              userData?.is_superuser ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/signup" element={<Navigate to="/home" replace />} />

          {/* Restrict access to admin routes */}
          {userData?.is_superuser && (
            <>
              {/* The `*` allows for nested routes in AdminHome */}
              <Route path="/admin/*" element={<AdminHome />} />
              <Route path="/home" element={<AdminHome />} />
            </>
          )}

          {/* Restrict access for superusers to non-admin routes */}
          {!userData?.is_superuser && (
            <>
              <Route path="/home" element={<Home />} />
              <Route
                path="/category/:category_slug"
                element={<CategoryPage />}
              />

              <Route path="/explore" element={<Explore />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/post/:postId" element={<SinglePost />} />
            </>
          )}
        </>
      ) : (
        <>
          {/* Public routes for non-logged-in users */}
          <Route path="/*" element={<HomePage />} />

          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </>
      )}

      {/* Handle unknown routes */}
      <Route path="*" element={<h2> OOPS! Page Not Found</h2>} />
    </Routes>
  );
};
