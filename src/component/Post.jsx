import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { GoComment } from "react-icons/go";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { MdOutlineBookmarkBorder, MdOutlineBookmark } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getFormattedDate } from "../utilities/getFormattedDate";
import { openPostModal, setEditPostObj } from "../features/post/postSlice";
import { followUser, unFollowUser } from "../features/user/helpers";
import {
  likePost,
  dislikePost,
  deletePost,
  getAllPosts,
} from "../features/post/helpers";

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

  // Edit Post Handler
  const editHandler = (e) => {
    e.stopPropagation();
    dispatch(openPostModal());
    dispatch(setEditPostObj(post));
    setPostOptions(false);
  };

  // Delete Post Handler
  const deletePostHandler = (e) => {
    e.stopPropagation();
    dispatch(deletePost({ postId: post?.post_id, token }));
    dispatch(getAllPosts());
    setPostOptions(false);
  };

  // Follow/Unfollow Handlers
  const toggleFollow = (e) => {
    e.stopPropagation();
    const action = currentUser?.user_following?.includes(userData.id)
      ? unFollowUser
      : followUser;
    dispatch(
      action({
        user_id: currentUser?.user_id,
        follower_user_id: userData.id,
        token,
      })
    );
    setPostOptions(false);
  };

  // Like Post Handler
  const handleLikePost = (e) => {
    e.stopPropagation();
    setIsLiked(true);
    setLikeCount((prevCount) => prevCount + 1);

    dispatch(
      likePost({ postId: post?.post_id, user_id: userData.id, token })
    ).catch((error) => {
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
    ).catch((error) => {
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
                    {currentUser?.user_following?.includes(userData.id)
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
