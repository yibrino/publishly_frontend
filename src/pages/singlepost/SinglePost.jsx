import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { GoComment } from "react-icons/go";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { MdArrowBack } from "react-icons/md";
import {
  getAllPosts,
  likePost,
  dislikePost,
  addComment,
} from "../../features/post/helpers";

import { AsideLeft, AsideRight, MobileNavBar, Comment } from "../../component";
import { getFormattedDate } from "../../utilities/getFormattedDate";
import Loader from "react-spinner-loader";

export const SinglePost = () => {
  const [commentData, setCommentData] = useState({ content: "" });
  const [currentPost, setCurrentPost] = useState(null); // Manage local post state

  const commentRef = useRef(null);
  const { postId } = useParams();
  const { pathname } = useLocation();

  const {
    user: { users, profiles },
    auth: { token, userData },
    posts: { posts, isLoading },
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all posts
    dispatch(getAllPosts());
  }, [dispatch, token]);

  useEffect(() => {
    // Set currentPost based on postId and posts data
    if (posts.length > 0) {
      const post = posts.find((post) => post.post_id === Number(postId));
      setCurrentPost(post);
    }
  }, [posts, postId]);

  const currentUser = users?.find(
    (user) => user?.user_id === currentPost?.user
  );

  const userprofile = profiles?.find(
    (profile) => profile.user === currentUser?.user_id
  );
  const authuserprofile = profiles?.find(
    (profile) => profile.user === userData?.id
  );

  //  post disliking
  const handleDisLikePost = (e) => {
    e.stopPropagation();
    dispatch(
      dislikePost({
        postId: currentPost?.post_id,
        user_id: userData.id,
        token,
      })
    )
      .unwrap()
      .then(() => {
        // Optimistically update local state
        setCurrentPost((prevPost) => ({
          ...prevPost,
          post_liked_by: prevPost.post_liked_by.filter(
            (userId) => userId !== userData.id
          ),
          post_like_count: prevPost.post_like_count - 1,
        }));
        console.log("Current Post", currentPost);
      })
      .then(() => {
        // Dispatch to fetch all posts again after disliking the post
        dispatch(getAllPosts());
      })
      .catch((err) => {
        console.error("Error disliking post:", err);
      });
  };

  // Optimistic post liking
  const handleLikePost = (e) => {
    e.stopPropagation();
    dispatch(
      likePost({
        postId: currentPost?.post_id,
        user_id: userData.id,
        token,
      })
    )
      .unwrap()
      .then(() => {
        // Optimistically update local state
        setCurrentPost((prevPost) => ({
          ...prevPost,
          post_liked_by: [...prevPost.post_liked_by, userData.id],
          post_like_count: prevPost.post_like_count + 1,
        }));
      })
      .then(() => {
        // Dispatch to fetch all posts again after liking the post
        dispatch(getAllPosts());
      })
      .catch((err) => {
        console.error("Error liking post:", err);
      });
  };

  // Optimistic bookmark handling

  const handleAddComment = () => {
    dispatch(
      addComment({
        post_id: currentPost.post_id,
        token,
        comment_content: commentData.content,
        commented_by: userData.id,
      })
    )
      .unwrap()
      .then((newComment) => {
        // Optimistically update local state with the new comment
        setCurrentPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, newComment],
        }));

        // Clear the comment input field
        setCommentData({ content: "" });

        // Optionally, scroll to the new comment
        commentRef.current?.scrollIntoView({ behavior: "smooth" });
      })
      .catch((err) => {
        console.error("Error adding comment:", err);
      });
  };

  if (!currentPost) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MobileNavBar />

      <div className="flex justify-center px-5 sm:px-32">
        <div className="flex h-screen w-screen">
          <AsideLeft />

          <main className="w-full sm:basis-2/3">
            <header className="pl-2 pt-5 pb-3 hidden sm:flex">
              <MdArrowBack
                className="text-xl mt-1 ml-1 hover:bg-slate-100 rounded-full"
                onClick={() => navigate(-1)}
              />
              <h1 className="text-xl pl-2">Post</h1>
            </header>

            <header className="text-xl font-bold flex py-4 text-blue-600 sm:hidden">
              <Link to="/home"> Publishly </Link>
            </header>

            <div className="flex flex-col border ml-0 sm:mr-0 sm:mx-3 pl-2 pr-1 sm:pr-0 sm:px-5 py-3">
              <div className="flex ml-0 sm:mr-0 sm:mx-1 pl-0 pr-1 sm:pr-0 sm:px-1 py-3">
                <div className="mt-3 w-12 h-12 text-lg flex-none">
                  <img
                    src={userprofile?.user_profile_picture}
                    className="flex-none w-12 h-12 rounded-full"
                    alt="avatar"
                  />
                </div>

                <div className="w-full px-4 py-3">
                  <div className="w-full flex flex-col justify-between relative">
                    <h2 className="font-semibold">
                      {`${currentUser?.user_firstname} ${currentUser?.user_lastname}`}
                    </h2>
                    <span className="text-slate-600">
                      @{currentUser?.user_username}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span
                      className="text-blue-600 text-sm font-semibold cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(
                          `/category/${currentPost.category.category_slug}`
                        )
                      }
                    >
                      #{currentPost.category.category_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-3">
                {isLoading ? (
                  <Loader show={isLoading} />
                ) : (
                  <p className="py-3 max-w-xl break-words">
                    {currentPost?.post_content}
                  </p>
                )}

                {currentPost?.post_image_url && (
                  <div className="max-w-3xl max-h-80 mx-auto bg-blue-100 rounded-md">
                    <img
                      src={currentPost?.post_image_url}
                      className="max-w-full max-h-80 rounded-md my-2 mx-auto"
                      alt="post content"
                    />
                  </div>
                )}

                <p className="text-sm text-gray-600 border-y-3">
                  {getFormattedDate(currentPost?.updated_at)}
                </p>

                <div className="border-y mt-4 py-2 px-3">
                  <span className="text-sm font-semibold">
                    {currentPost?.post_like_count} Likes
                  </span>
                  <span className="text-sm pl-12 font-semibold">
                    {currentPost?.comments?.length} Comments
                  </span>
                </div>

                <div className="flex justify-between py-4 px-2 border-t">
                  <div className="flex">
                    {currentPost?.post_liked_by.includes(userData.id) ? (
                      <BsSuitHeartFill
                        className="text-xl cursor-pointer text-red-600"
                        onClick={handleDisLikePost}
                      />
                    ) : (
                      <BsSuitHeart
                        className="text-xl cursor-pointer"
                        onClick={handleLikePost}
                      />
                    )}
                  </div>

                  <div className="flex">
                    <GoComment className="text-xl cursor-pointer" />
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 px-2 border-y-2 w-full focus:outline-none gap-4">
                  <span className="w-12 h-12 text-lg flex-none basis-12">
                    <img
                      src={authuserprofile?.user_profile_picture}
                      className="flex-none w-12 h-12 rounded-full"
                      alt="user avatar"
                    />
                  </span>

                  <span className="flex-1">
                    <input
                      ref={commentRef}
                      value={commentData.content}
                      onChange={(e) =>
                        setCommentData((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      className="w-full p-2 rounded-[30rem] focus:outline-none bg-slate-100"
                      type="text"
                      placeholder="Add a comment..."
                    />
                  </span>

                  <button
                    disabled={!commentData.content.trim().length}
                    className="disabled:cursor-not-allowed p-2 rounded-[20rem] bg-blue-600 hover:bg-blue-800 text-white shadow-md hover:shadow-lg w-20"
                    onClick={() => {
                      handleAddComment();
                    }}
                  >
                    Reply
                  </button>
                </div>

                {/* Comment Section */}
                {currentPost?.comments?.map((comment) => (
                  <Comment
                    key={comment.comment_id}
                    postId={currentPost.post_id}
                    comment={comment}
                    postOwnerUsername={currentUser?.user_username}
                  />
                ))}
              </div>
            </div>
          </main>

          <AsideRight />
        </div>
      </div>
    </div>
  );
};
