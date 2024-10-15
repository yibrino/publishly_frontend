import React from "react";
import "./widgetSm.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getUsers } from "../../features/user/helpers";
import { getProfiles } from "../../features/user/helpers";
import { useDispatch } from "react-redux";

export default function WidgetSm({ user }) {
  const {
    user: { profiles },
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  console.log("profiles", profiles);

  useEffect(() => {
    // Fetch users and posts when the component mounts
    dispatch(getUsers()); // Ensure users are fetched
    dispatch(getProfiles()); // Ensure users are fetched
  }, [dispatch]);

  const userFilteredProfiles = profiles.filter(
    (profile) => profile.user === user.user_id
  );
  const userprofile = userFilteredProfiles[0];
  console.log("User Profile", userprofile);

  return (
    <div className="widgetSm">
      <div className="widgetListItem">
        <img
          src={userprofile?.user_profile_picture} // Default image if none is provided
          alt={user.user_firstname}
          className="widgetSmImg"
        />
        <div className="widgetSmUser">
          <span className="widgetSmUsername">
            {user.user_firstname} {user.user_lastname}
          </span>
          <span className="widgetSmUserTitle">{userprofile?.user_bio}</span>{" "}
          {/* Use a field for job title */}
        </div>
      </div>
    </div>
  );
}
