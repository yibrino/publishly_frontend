import { useState, useEffect } from "react";
import {
  AsideLeft,
  AsideRight,
  EditProfileModal,
  FollowInfoModal,
  MobileNavBar,
  Post,
} from "../../component";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unFollowUser } from "../../features/user/helpers";
import { getAllPosts } from "../../features/post/helpers";
import { getUsers } from "../../features/user/helpers"; // Ensure this is imported
import { FiLogOut } from "react-icons/fi";
import { signOutHandler } from "../../features/auth/authSlice";

import { AiOutlineArrowUp } from "react-icons/ai";
import "react-responsive-modal/styles.css";
import Loader from "react-spinner-loader";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [followersInfoModal, setFollowersInfoModal] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [profileMode, setProfileMode] = useState(""); // State to track mode (create or edit)

  const { username } = useParams();

  const {
    auth: { userData, isLoading, token },
    user: { users, profiles, upLoadingPhoto },
    posts: { posts },
  } = useSelector((state) => state);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch users and posts when the component mounts
    dispatch(getUsers()); // Ensure users are fetched
    dispatch(getAllPosts());
  }, [dispatch]);

  // Find the current user based on the URL parameter (username)
  const currentUser = users.find((user) => user.user_username === username);
  const authUser = users.find((user) => user.user_id === userData?.id);

  // Handle loading state
  if (!currentUser) {
    return (
      <div className="relative">
        <Loader show={isLoading} type="body" />
      </div>
    );
  }

  const userFilteredProfiles = profiles.filter(
    (profile) => profile.user === currentUser.user_id
  );
  const userprofile = userFilteredProfiles[0];

  const currentUserPosts = posts.filter(
    (post) => post.user === currentUser.user_id
  );

  const sortedPosts = currentUserPosts.slice();
  sortedPosts.sort((a, b) => new Date(b?.updated_at) - new Date(a?.updated_at)); // Sort latest posts first

  const handleFollow = () => {
    dispatch(
      followUser({
        user_id: currentUser.user_id, // The user being followed
        follower_user_id: userData.id, // The logged-in user (follower)
        token,
      })
    ).then(() => {
      // Fetch updated user data after following is complete
      dispatch(getUsers());
    });
  };
  const handleUnfollow = () => {
    dispatch(
      unFollowUser({
        user_id: currentUser.user_id, // The user being unfollowed
        follower_user_id: userData.id, // The logged-in user (follower)
        token,
      })
    ).then(() => {
      // Fetch updated user data after following is complete
      dispatch(getUsers());
    });
  };

  return (
    <div>
      <MobileNavBar />

      <div className="flex justify-center    px-5 sm:px-32 md:mt-4">
        <div className="flex h-screen w-screen">
          <AsideLeft />

          <main className="md:mx-4     w-full sm:basis-2/3">
            <header className="hidden sm:flex m-4 w-full justify-between">
              <h1 className="text-xl">Profile</h1>
            </header>

            <header className="text-xl font-bold flex py-4 text-blue-600 sm:hidden justify-between">
              <Link to="/home" id="hero-logo">
                {" "}
                Publishly{" "}
              </Link>
            </header>

            {upLoadingPhoto ? (
              <div className="z-20">
                <Loader show={upLoadingPhoto} />
              </div>
            ) : (
              <div className="sm:ml-5 my-6 flex flex-col space-between">
                <div className="flex mx-auto gap-8">
                  <img
                    src={userprofile?.user_profile_picture}
                    className="w-32 h-32 rounded-full object-cover sm:w-24 sm:h-24 md:w-32 md:h-32"
                    alt="avatar"
                  />

                  <div className="flex flex-col mt-2">
                    <h2 className="font-semibold">{`${currentUser?.user_firstname} ${currentUser?.user_lastname}`}</h2>

                    <h2> @{currentUser?.user_username} </h2>

                    {userData?.username === currentUser?.user_username &&
                      authUser &&
                      (!userprofile ? (
                        <button
                          className="border my-3 p-1 rounded-lg text-x cursor-pointer text-center font-semibold text-slate-600 bg-slate-200 hover:bg-slate-100"
                          onClick={() => {
                            setShowUpdateProfile(true);
                            setProfileMode("create"); // Set mode to "create"
                          }}
                        >
                          Create Profile
                        </button>
                      ) : (
                        <button
                          className="border my-3 p-1 rounded-lg text-x cursor-pointer text-center font-semibold text-slate-600 bg-slate-200 hover:bg-slate-100"
                          onClick={() => {
                            setShowUpdateProfile(true);
                            setProfileMode("edit"); // Set mode to "edit"
                          }}
                        >
                          Edit Profile
                        </button>
                      ))}

                    {/* Follow / Unfollow buttons */}
                    {authUser?.user_username !== currentUser?.user_username &&
                      (authUser?.following.find(
                        (eachUser) =>
                          eachUser?.user_username === currentUser?.user_username
                      ) ? (
                        <button
                          className="mr-8 mt-4 px-3 w-18 h-8 bg-blue-800  text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out"
                          onClick={handleUnfollow}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className="mr-8 mt-4 px-3 w-18 h-8  bg-blue-800  text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out"
                          onClick={handleFollow}
                        >
                          Follow
                        </button>
                      ))}

                    {/* Modal for Edit Profile */}
                    {authUser && (
                      <EditProfileModal
                        currentUser={authUser}
                        showUpdateProfile={showUpdateProfile}
                        setShowUpdateProfile={setShowUpdateProfile}
                        profileMode={profileMode}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-center">
                  <h2 className="font-semibold">{userprofile?.user_bio}</h2>
                  <h2 className="font-semibold text-blue-600">
                    {userprofile?.user_website}
                  </h2>
                </div>

                <div className="flex gap-6 pl-4 mt-4 mb-16 justify-items-center mx-auto">
                  <FollowInfoModal
                    currentUser={currentUser}
                    followersInfoModal={followersInfoModal}
                    showFollowing={showFollowing}
                    setFollowersInfoModal={setFollowersInfoModal}
                  />

                  <h3 className="text-base sm:text-xl cursor-pointer">
                    {currentUserPosts.length}
                    <span className="text-slate-600 text-base sm:text-xl">
                      {" "}
                      posts
                    </span>
                  </h3>

                  <h3
                    className="text-base sm:text-xl cursor-pointer"
                    onClick={() => {
                      setFollowersInfoModal(true);
                      setShowFollowing(true);
                    }}
                  >
                    {currentUser?.following.length}
                    <span className="text-slate-600 pl-1">following</span>
                  </h3>

                  <h3
                    className="text-base sm:text-xl cursor-pointer"
                    onClick={() => {
                      setFollowersInfoModal(true);
                      setShowFollowing(false);
                    }}
                  >
                    {currentUser?.followers.length}
                    <span className="text-slate-600 pl-1">followers</span>
                  </h3>
                </div>

                <h1 className="text-2xl text-center mb-6">Your Posts</h1>

                {sortedPosts.map((post) => (
                  <Post key={post.post_id} post={post} />
                ))}
              </div>
            )}
          </main>

          <AsideRight />
          <a href="#">
            <AiOutlineArrowUp className="hidden sm:block fixed bottom-0 right-20 bg-blue-300 text-slate-50 text-5xl p-3 rounded-full mb-2 mr-20 hover:bg-blue-500" />
          </a>
        </div>
      </div>
    </div>
  );
};
