import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  getAllPosts,
  editComment,
  deleteComment,
} from "../features/post/helpers";

export const Comment = ({ postId, comment, postOwnerUsername }) => {
  const [openCommentModal, setCommentModal] = useState(false); // for toggling comment modal
  const [isEditing, setIsEditing] = useState(false); // for toggling edit modal
  const [editCommentData, setEditCommentData] = useState(comment);

  const {
    user: { users, profiles },
    auth: { token, userData },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch, token]);
  const getCurrentCommentedUser = (comment) => {
    const currentCommentedUser = users?.filter(
      (user) => user?.user_id === comment?.user
    )[0];
    return currentCommentedUser;
  };

  const getUserFilteredProfiles = (comment) => {
    // Get the current commented user
    const currentCommentedUser = getCurrentCommentedUser(comment);

    // If the current commented user is found, filter the profiles
    if (currentCommentedUser) {
      const userFilteredProfiles = profiles.filter(
        (profile) => profile.user === currentCommentedUser.user_id
      );

      return userFilteredProfiles[0];
    }

    // If no commented user is found, return an empty array or handle accordingly
    return [];
  };

  const editBtnHandler = () => {
    setIsEditing((prev) => !prev);
    setCommentModal(false);
  };

  const updateCommentHandler = () => {
    dispatch(
      editComment({
        comment_id: editCommentData.comment_id,
        commented_by: editCommentData.user,
        comment_content: editCommentData.comment_content,
        token,
      })
    );
    dispatch(getAllPosts());

    console.log("postId", postId);
    console.log("commentData", editCommentData);
    setIsEditing(false);
  };

  const deleteCommentHandler = () => {
    dispatch(deleteComment({ token, comment_id: editCommentData.comment_id }));
    dispatch(getAllPosts());
  };

  return (
    <div className="flex ml-0 sm:mr-0 sm:mx-1 pl-0 pr-1 sm:pr-0 sm:px-1 py-3 border-b">
      <div className="mt-3 w-12 h-12 text-lg flex-none">
        <img
          src={getUserFilteredProfiles(comment)?.user_profile_picture}
          className="flex-none w-12 h-12 rounded-full"
          alt="avatar"
        />
      </div>

      <div className="w-full px-4 py-3 relative">
        <div className="w-full flex gap-2 justify-between">
          <h2 className="font-semibold">
            {`${getCurrentCommentedUser(comment)?.user_firstname} ${
              getCurrentCommentedUser(comment)?.user_lastname
            }`}
            <span className="text-slate-600 pl-2">
              @{getCurrentCommentedUser(comment)?.user_username}
            </span>
          </h2>

          {comment?.user === userData?.id && (
            <HiDotsHorizontal
              className="cursor-pointer pr2"
              onClick={() => setCommentModal((prev) => !prev)}
            />
          )}
        </div>

        <div className="flex gap-2">
          <span className="text-slate-500">replying to</span>
          <span className="text-blue-600 font-semibold">
            @{postOwnerUsername}
          </span>
        </div>

        {isEditing ? (
          <div className="flex justify-between items-center mt-3 p-3 px-2 border-y-2 w-full focus:outline-none gap-4">
            <span className="flex-1">
              <input
                value={editCommentData?.comment_content}
                className="w-full p-2 rounded-[30rem] focus:outline-none bg-slate-100"
                type="text"
                placeholder="Add a comment..."
                onChange={(e) =>
                  setEditCommentData((prev) => ({
                    ...prev,
                    comment_content: e.target.value,
                  }))
                }
              />
            </span>

            <button
              className="p-2 rounded-[20rem] bg-blue-600 hover:bg-blue-800 text-white shadow-md 
                            hover:shadow-lg w-20"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {" "}
              Cancel
            </button>

            <button
              className="p-2 rounded-[20rem] bg-blue-600 hover:bg-blue-800 text-white shadow-md 
                            hover:shadow-lg w-20"
              onClick={updateCommentHandler}
            >
              {" "}
              Update
            </button>
          </div>
        ) : (
          <div className="mt-3">{comment?.comment_content}</div>
        )}

        {/* Edit and Delete Comment Modal */}

        {comment?.user === userData?.id && openCommentModal && (
          <div
            className="w-30 h-22 px-1 shadow-xl bg-white border border-slate-300 text-slate-600 font-semibold 
                    absolute right-10 top-2 rounded-xl"
          >
            <ul className="p-1 cursor-pointer text-center">
              <li
                className="my-1 p-1 hover:bg-slate-200 rounded"
                onClick={editBtnHandler}
              >
                Edit
              </li>
              <li
                className="my-1 p-1 hover:bg-slate-200 rounded"
                onClick={deleteCommentHandler}
              >
                Delete
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
