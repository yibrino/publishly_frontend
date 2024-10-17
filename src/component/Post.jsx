import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { GoComment } from "react-icons/go";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { MdOutlineBookmarkBorder, MdOutlineBookmark } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getFormattedDate } from "../utilities/getFormattedDate";
import { openPostModal, setEditPostObj } from "../features/post/postSlice";
import { followUser, getUsers, unFollowUser } from "../features/user/helpers";
import {
  likePost,
  dislikePost,
  deletePost,
  getAllPosts,
} from "../features/post/helpers";
import Swal from "sweetalert2"; // Import SweetAlert

import { useLocation, useNavigate } from "react-router-dom";

export const Post = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    posts: { editPostObj },
    user: { users, profiles },
    auth: { token, userData },
  } = useSelector((state) => state);

  const [postOptions, setPostOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post?.post_liked_by?.includes(userData.id)
  );
  const [likeCount, setLikeCount] = useState(post?.post_like_count);

  const currentUser = users.find((user) => user.user_id === post?.user);
  const userProfile = profiles.find(
    (profile) => profile.user === currentUser?.user_id
  );
  console.log("User Id", userData);
  console.log("Current User", currentUser);
  // Edit Post Handler
  const editHandler = async (e) => {
    e.stopPropagation();

    try {
      // Dispatch openPostModal (synchronous action)
      dispatch(openPostModal());

      // Set the post object to edit (synchronous action)
      dispatch(setEditPostObj(post));

      // Immediately fetch all posts after setting the post object to edit
      await dispatch(getAllPosts());

      // Optionally, close the post options UI
      setPostOptions(false);
    } catch (error) {
      console.error("Error fetching posts after editing:", error);
    }
  };

  // Delete Post Handler

  // Delete Post Handler
  const deletePostHandler = (e) => {
    e.stopPropagation();

    // Show confirmation dialog before deleting the post
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deleting the post if confirmed
        dispatch(deletePost({ postId: post?.post_id, token }))
          .then(() => {
            dispatch(getAllPosts());
            setPostOptions(false);

            // Show success message
            Swal.fire({
              title: "Deleted!",
              text: "The post has been deleted.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
          })
          .catch((error) => {
            console.error("Error deleting post:", error);

            // Show error message if deletion fails
            Swal.fire({
              title: "Error!",
              text: "There was an error deleting the post.",
              icon: "error",
              confirmButtonColor: "#3085d6",
            });
          });
      }
    });
  };

  // Follow/Unfollow Handlers
  const toggleFollow = (e) => {
    e.stopPropagation();

    const action = currentUser.followers.some(
      (followedUser) => followedUser.user_id === userData.id
    )
      ? unFollowUser
      : followUser;

    dispatch(
      action({
        user_id: currentUser.user_id, // The user being followed
        follower_user_id: userData.id, // The logged-in user (follower)
        token,
      })
    ).then(() => {
      // Fetch updated user data after following is complete
      dispatch(getUsers());
    });
  };

  // Like Post Handler
  const handleLikePost = (e) => {
    e.stopPropagation();
    setIsLiked(true);
    setLikeCount((prevCount) => prevCount + 1);
    console.log("Post Id", post?.post_id);
    console.log("User Id", userData.id);

    dispatch(likePost({ postId: post?.post_id, user_id: userData.id, token }))
      .then(() => {
        // Dispatch to fetch all posts again after liking the post
        dispatch(getAllPosts());
      })
      .catch((error) => {
        // Rollback in case of error
        setIsLiked(false);
        setLikeCount((prevCount) => prevCount - 1);
        console.error("Error liking post:", error);
      });
  };

  // Dislike Post Handler
  const handleDislikePost = (e) => {
    e.stopPropagation();
    setIsLiked(false);
    setLikeCount((prevCount) => prevCount - 1);

    dispatch(
      dislikePost({ postId: post?.post_id, user_id: userData.id, token })
    )
      .then(() => {
        // Dispatch to fetch all posts again after disliking the post
        dispatch(getAllPosts());
      })
      .catch((error) => {
        // Rollback in case of error
        setIsLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
        console.error("Error disliking post:", error);
      });
  };

  return (
    <div className="flex  border ml-0 sm:mr-0 sm:mx-3 pl-2 pr-1 sm:pr-0 sm:px-5 py-3 hover:bg-slate-100">
      <div className="mt-3 w-12 h-12 text-lg flex-none">
        <img
          onClick={() => navigate(`/profile/${currentUser?.user_username}`)}
          src={userProfile?.user_profile_picture}
          className="flex-none w-12 h-12 rounded-full cursor-pointer"
          alt={currentUser?.user_username}
        />
      </div>

      <div className="w-full px-4 py-3">
        <div className="w-full flex justify-between relative">
          <h2
            onClick={() => navigate(`/profile/${currentUser?.user_username}`)}
            className="font-semibold cursor-pointer"
          >
            {`${currentUser?.user_firstname} ${currentUser?.user_lastname}`}
            <span className="text-slate-500 font-normal pl-1.5">
              @{currentUser?.user_username}
            </span>
          </h2>

          <HiDotsHorizontal
            className="cursor-pointer mr-3"
            onClick={() => setPostOptions((prev) => !prev)}
          />

          {postOptions && (
            <div className="w-30 h-22 px-1 shadow-xl bg-white border border-slate-300 text-slate-600 font-semibold absolute right-7 top-0 z-20 rounded-xl">
              <ul className="p-0.5 cursor-pointer text-start">
                {post?.user === userData?.id ? (
                  <>
                    <li
                      className="my-1 p-1 hover:bg-slate-200 rounded"
                      onClick={editHandler}
                    >
                      Edit Post
                    </li>
                    <li
                      className="my-1 p-1 hover:bg-slate-200 rounded"
                      onClick={deletePostHandler}
                    >
                      Delete Post
                    </li>
                  </>
                ) : (
                  <li
                    className="my-1 p-1 hover:bg-slate-200 rounded"
                    onClick={toggleFollow}
                  >
                    {currentUser.followers.some(
                      (followedUser) => followedUser.user_id === userData.id
                    )
                      ? "Unfollow"
                      : "Follow"}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Category Display */}
        {post?.category && (
          <div className="mb-2">
            <span
              className="text-blue-600 text-sm font-semibold cursor-pointer hover:underline"
              onClick={() =>
                navigate(`/category/${post.category.category_slug}`)
              }
            >
              #{post.category.category_name}
            </span>
          </div>
        )}

        <p
          className="py-3 cursor-pointer max-w-lg break-words"
          onClick={() => navigate(`/post/${post.post_id}`)}
        >
          {post?.post_content}
        </p>

        {post?.post_image_url && (
          <div
            className="max-w-3xl max-h-80 mx-auto bg-blue-100 rounded-md cursor-pointer"
            onClick={() => navigate(`/post/${post.post_id}`)}
          >
            <img
              src={post?.post_image_url}
              className="max-w-full max-h-80 rounded-md my-2 mx-auto"
              alt="avatar"
            />
          </div>
        )}

        <p className="text-sm text-gray-600">
          {getFormattedDate(post?.updated_at)}
        </p>

        <div className="flex justify-between pt-8">
          <div className="flex">
            {isLiked ? (
              <BsSuitHeartFill
                className="text-xl cursor-pointer text-red-600"
                onClick={handleDislikePost}
              />
            ) : (
              <BsSuitHeart
                className="text-xl cursor-pointer"
                onClick={handleLikePost}
              />
            )}
            <span className="text-sm pl-4 font-semibold">{likeCount}</span>
          </div>

          <div className="flex">
            <GoComment
              onClick={() => navigate(`/post/${post.post_id}`)}
              className="text-xl cursor-pointer"
            />
            <span className="text-sm pl-4 font-semibold">
              {post?.comments?.length > 0 ? post?.comments?.length : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
