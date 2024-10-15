import Topbar from "../../component/topbar/Topbar";
import Sidebar from "../../component/sidebar/Sidebar";
import "./Home.css";
import AdminDashboard from "../../pages/dashboard/AdminDashboard";
import UserList from "../../pages/userList/UserList";
import User from "../../pages/user/User";
import NewUser from "../../pages/newUser/NewUser";
import PostsList from "../postList/PostList";
import CategoryList from "../categoryList/CategoryList";
import Category from "../category/Category";
import NewCategory from "../newCategory/NewCategory";
import { Routes, Route } from "react-router-dom";

function AdminHome() {
  return (
    <>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="user/:userId" element={<User />} />
          <Route path="newUser/" element={<NewUser />} />

          <Route path="posts" element={<PostsList />} />
          {/* Category */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="newCategory/" element={<NewCategory />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminHome;
