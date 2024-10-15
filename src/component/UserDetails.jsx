import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { followUser, unFollowUser } from "../features/user/helpers";
import { useEffect } from "react"; // Import useEffect to handle user refresh if necessary
import { getUsers } from "../features/user/helpers";
export const UserDetails = ({ currentUser }) => {
  const {
    user: { users, profiles },
    auth: { userData, token },
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Find the current user and their profile data
  const currentUserDetails = users.find(
    (user) => user.user_id === currentUser.user_id
  );

  const userFilteredProfiles = profiles.filter(
    (profile) => profile.user === currentUser.user_id
  );

  const userProfile = userFilteredProfiles[0];

  // Find the authenticated user (the one logged in)
  const authUser = users.find(
    (user) => user.user_username === userData.username
  );

  // Ensure the UI re-renders when the follow/unfollow action happens
  useEffect(() => {
    dispatch(getUsers()); // Ensure users are fetched only once
  }, []);

  // Handle the follow and unfollow button click events
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
    <div className="ml-5 mt-8 mb-4 flex w-10/12 justify-around">
      <div className="flex">
        <img
          src={userProfile?.user_profile_picture}
          className="w-12 h-12 rounded-full cursor-pointer"
          alt={`${currentUser?.user_username}`}
          onClick={() => navigate(`/profile/${currentUser?.user_username}`)}
        />

        <div className="w-40 flex flex-col px-2">
          <Link to={`/profile/${currentUser?.user_username}`}>
            <h2 className="font-semibold">{`${currentUserDetails?.user_firstname} ${currentUserDetails?.user_lastname}`}</h2>
            <h2>@{currentUser?.user_username}</h2>
          </Link>
        </div>
      </div>

      {authUser?.user_username ===
      currentUser?.user_username ? null : authUser?.following.find(
          (eachUser) => eachUser?.user_username === currentUser?.user_username
        ) ? (
        <button
          className="mt-1.5 px-3 w-18 h-8 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out"
          onClick={handleUnfollow}
        >
          Unfollow
        </button>
      ) : (
        <button
          className="mt-1.5 px-3 w-18 h-8 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out"
          onClick={handleFollow}
        >
          Follow
        </button>
      )}
    </div>
  );
};
