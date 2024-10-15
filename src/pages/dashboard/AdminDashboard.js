import React from "react";
import Chart from "../../component/chart/Chart";
import FeaturedInfo from "../../component/featuredInfo/FeaturedInfo";
import styles from "./AdminDashboard.module.css"; // Correct import for CSS module
import { useEffect } from "react";
import { getAllPosts } from "../../features/post/helpers";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getUsers } from "../../features/user/helpers";
import WidgetSm from "../../component/widgetSm/WidgetSm";
import WidgetLg from "../../component/widgetLg/WidgetLg";

export default function Home() {
  const {
    posts: { posts },
    user: { users },
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11 (January is 0)
  const currentYear = currentDate.getFullYear();

  const [usersJoined, setUsersJoined] = useState([]);
  const filteredUsers = users.filter((user) => {
    const userDate = new Date(user.created_at);
    return (
      !user.is_superuser &&
      userDate.getMonth() === currentMonth &&
      userDate.getFullYear() === currentYear
    );
  });

  useEffect(() => {
    // Fetch users and posts when the component mounts

    dispatch(getAllPosts()); // Ensure users are fetched

    dispatch(getUsers()); // Ensure users are fetched
  }, [dispatch]);
  return (
    <div className={styles.home}>
      {" "}
      {/* Use styles from the module */}
      <FeaturedInfo />
      {/* <Chart
        data={userData}
        title="User Analytics"
        grid
        datakey={"Active User"}
      /> */}
      <div className={styles.homeWidgets}>
        <div className="widgetSm">
          <h2 className="widgetLgTitle">New Members</h2>

          <div className="widgetSmList">
            {filteredUsers.map((user) => (
              <div key={user.user_id} className="widgetListItem">
                {/* Pass the user as a prop to WidgetSm */}
                <WidgetSm user={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="widgetSm">
          {posts.map((post) => (
            <div key={post.user_id}>
              {/* Pass the user as a prop to WidgetSm */}
              <WidgetLg post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
