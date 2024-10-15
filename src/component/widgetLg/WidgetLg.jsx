import React from "react";
import "./widgetLg.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getUsers } from "../../features/user/helpers";
import { getProfiles } from "../../features/user/helpers";
import { useDispatch } from "react-redux";

export default function WidgetLg({ post }) {
  const {
    user: { users, profiles },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch users and posts when the component mounts
    dispatch(getUsers()); // Ensure users are fetched
    dispatch(getProfiles()); // Ensure profiles are fetched
  }, [dispatch]);

  const currentUser = users.find((user) => user.user_id === post.user);
  const userFilteredProfiles = profiles.filter(
    (profile) => profile.user === post.user
  );
  const userprofile = userFilteredProfiles[0];

  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  // Format the date to a short format (e.g., "6/22/2022")
  const formattedDate = new Date(post.created_at).toLocaleDateString();

  // Trim the post content to 10 characters and add "..."
  const shortContent =
    post.post_content.length > 10
      ? post.post_content.substring(0, 10) + "..."
      : post.post_content;

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Posts</h3>
      <table className="widgetLgTable">
        <thead>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">User</th>
            <th className="widgetLgTh">Date</th>
            <th className="widgetLgTh">Content</th>
          </tr>
        </thead>
        <tbody>
          <tr className="widgetLgTr" key={post.id}>
            <td className="widgetLgUser">
              <img
                src={userprofile?.user_profile_picture}
                alt="profile"
                className="widgetLgImg"
              />
              <span className="widgetLgName">{currentUser?.user_username}</span>
            </td>
            <td className="widgetLgDate">{formattedDate}</td>
            <td className="widgetLgAmount">{shortContent}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
