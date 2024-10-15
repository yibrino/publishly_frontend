import MailOutline from "@mui/icons-material/MailOutline";
import PermIdentity from "@mui/icons-material/PermIdentity";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { getUsers } from "../../features/user/helpers";
import { Link } from "react-router-dom";
import "./user.css";

export default function User() {
  const { userId } = useParams(); // Extract userId from the URL
  const {
    user: { users, profiles },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch users and posts when the component mounts
    dispatch(getUsers()); // Ensure users are fetched
  }, [dispatch]);
  console.log("User Id", userId);
  console.log("All Users ", users);

  const currentUser = users.find((user) => user.user_id == userId);

  console.log("currentUser :", currentUser); // Console log the userId
  const userFilteredProfiles = profiles.filter(
    (profile) => profile.user == userId
  );
  const userprofile = userFilteredProfiles[0];
  console.log("userprofile", userprofile);
  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to={"/admin/newUser"}>
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={userprofile?.user_profile_picture}
              alt="profile"
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">
                {currentUser.user_firstname + " " + currentUser.user_lastname}
              </span>
              <span className="userShowUserTitle">{userprofile?.user_bio}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Website</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">
                {userprofile?.user_website}
              </span>
            </div>

            <span className="userShowTitle">Contact Details</span>

            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">
                {currentUser.user_email}
              </span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>First name</label>
                <input
                  type="text"
                  placeholder="first name"
                  className="userUpdateInput"
                  defaultValue={currentUser.user_firstname}
                />
              </div>
              <div className="userUpdateItem">
                <label>Last name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="userUpdateInput"
                  defaultValue={currentUser.user_lastname}
                />
              </div>
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="username"
                  className="userUpdateInput"
                  defaultValue={currentUser.user_username}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="email"
                  className="userUpdateInput"
                  defaultValue={currentUser.user_email}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={userprofile?.user_profile_picture}
                />
              </div>
              {/* <button className="userUpdateButton">Update</button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
