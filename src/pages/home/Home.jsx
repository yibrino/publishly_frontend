import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiSettingsKnobs } from "react-icons/gi";
import { BsFillImageFill } from "react-icons/bs";
import { AiOutlineArrowUp } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AsideLeft, AsideRight, MobileNavBar, Post } from "../../component";
import {
  createPost,
  getAllPosts,
  getAllCategories,
} from "../../features/post/helpers";
import { getUsers } from "../../features/user/helpers";
import Loader from "react-spinner-loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export const Home = () => {
  const [showFilterPostModal, setShowFilterModal] = useState(false);
  const [sortPostBy, setSortPostBy] = useState("Latest");
  const [content, setContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // For category selection
  const [isFetching, setIsFetching] = useState(false);

  const {
    posts: {
      posts,
      categories,
      searchResults: postSearchResults, // Searched post results from the store
      searchQuery,
      isLoading,
    },
    auth: { userData, token },
    user: { users, profiles },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getAllPosts());
    dispatch(getAllCategories()); // Fetch categories
  }, [dispatch]);

  const currentUser = users.find((user) => user.user_id === userData.id);
  const user_id = userData.id;

  const userFilteredProfiles = currentUser
    ? profiles.filter((profile) => profile.user === currentUser.user_id)
    : [];

  const userprofile = userFilteredProfiles[0];
  const getUserName = (user_id) =>
    users.filter((user) => user.user_id === user_id)[0];

  const userFeedPosts = posts.filter((post) => {
    return (
      post.user === userData.id ||
      getUserName(post?.user)?.followers?.find(
        (user) => user.user_id === userData.user_id
      )
    );
  });

  const getSortedPosts = () => {
    const temp = userFeedPosts.slice();
    if (sortPostBy === "Latest") {
      temp.sort((a, b) => new Date(b?.updated_at) - new Date(a?.updated_at));
    }
    if (sortPostBy === "Oldest") {
      temp.sort((a, b) => new Date(a?.updated_at) - new Date(b?.updated_at));
    }
    if (sortPostBy === "Trending") {
      temp.sort((a, b) => b?.likes?.likeCount - a?.likes?.likeCount);
    }
    return temp;
  };

  const sortedPosts = getSortedPosts();

  const cloudinaryUrl =
    "https://api.cloudinary.com/v1_1/daklnsxdc/image/upload";

  useEffect(() => {
    if (postImageUrl) {
      isFetching &&
        toast("Adding Post", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
    } else {
      isFetching &&
        toast("Adding Post", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
    }
  }, [isFetching]);

  const postHandler = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    let newPost = {
      content,
      user: user_id,
      category_id: selectedCategory, // Add selected category to post data
      createdAt: new Date().toISOString(),
      likes: { likeCount: 0 },
    };

    if (postImageUrl) {
      const file = postImageUrl;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "publish");
      formData.append("folder", "publishly");

      try {
        const res = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        const { url } = await res.json();
        newPost = { ...newPost, post_image_url: url };

        // Optimistically update the UI
        dispatch(
          createPost({
            content,
            url,
            token,
            user_id,
            category_id: selectedCategory,
          })
        );
        setContent("");
        setPostImageUrl("");
        setSelectedCategory(""); // Reset category selection

        // Refetch posts from the server to ensure it's updated
        dispatch(getAllPosts());

        setIsFetching(false);
      } catch (err) {
        console.error("error occurred", err);
        setIsFetching(false);
      }
    } else {
      // Optimistically update the UI
      dispatch(
        createPost({ content, token, user_id, category_id: selectedCategory })
      );

      setContent("");
      setPostImageUrl("");
      setSelectedCategory(""); // Reset category selection

      // Refetch posts from the server to ensure it's updated
      dispatch(getAllPosts());
    }
  };

  if (!currentUser) {
    return (
      <div className="relative">
        <Loader show={isLoading} type="body" />
      </div>
    );
  }

  return (
    <div>
      <MobileNavBar />

      <div className="flex justify-center px-5 sm:px-32 md:mt-4">
        <div className="flex w-screen">
          <AsideLeft />

          <main className="md:mx-4 w-full sm:basis-2/3">
            <header className="m-4 hidden sm:flex">
              <h1 className="text-xl font-semi-bold">Home</h1>
            </header>

            <header className="text-xl font-bold flex py-4 text-blue-600 sm:hidden">
              <Link to="/home" id="hero-logo">
                Publishly
              </Link>
            </header>

            {/* create post */}
            <div className="border sm:ml-3 sm:mr-0 flex px-2 py-3 bg-white rounded-lg shadow-md">
              <div className="mt-3 w-12 h-12 text-lg flex-none">
                <img
                  src={userprofile?.user_profile_picture}
                  className="flex-none w-12 h-12 rounded-full"
                  alt="avatar"
                />
              </div>

              <div className="w-full px-4">
                <textarea
                  value={content}
                  placeholder="What's happening?"
                  className="resize-none mt-3 pb-3 w-full h-28 bg-slate-100 focus:outline-none rounded-xl p-2"
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>

                {/* Select Category */}
                <select
                  className="w-full mt-2 mb-2 p-2  border rounded-md bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>

                {/* Image Preview */}
                <div className="max-w-xl max-h-80 mx-auto rounded-md">
                  <img
                    src={postImageUrl ? URL.createObjectURL(postImageUrl) : ""}
                    className={
                      postImageUrl
                        ? "block max-w-full max-h-20 rounded-md my-2 cursor-pointer"
                        : "hidden"
                    }
                    alt="avatar"
                  />
                </div>

                <div className="flex justify-between">
                  <label className="flex m-2">
                    <input
                      className="hidden"
                      type="file"
                      onChange={(e) => setPostImageUrl(e.target.files[0])}
                    />
                    <BsFillImageFill className="text-2xl mt-1 text-blue-700 cursor-pointer" />
                  </label>
                  <button
                    disabled={
                      !content.trim().length &&
                      !postImageUrl &&
                      !selectedCategory
                    }
                    className="p-2.5 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out disabled:cursor-not-allowed"
                    onClick={postHandler}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* filter posts by date and trending */}
            <div className="flex pl-0.5 pr-0.5 sm:pr-6 sm:px-5 py-3 justify-between relative">
              <h1 className="text-xl">{sortPostBy} Posts</h1>

              <GiSettingsKnobs
                className="fill-blue-600 stroke-0 hover:stroke-2 text-2xl cursor-pointer"
                onClick={() => setShowFilterModal((prev) => !prev)}
              ></GiSettingsKnobs>

              {showFilterPostModal && (
                <div className="w-30 h-22 px-1 shadow-xl bg-slate-100 border border-slate-300 text-slate-600 font-semibold absolute right-11 top-4 z-20 rounded-xl">
                  <ul className="p-2 cursor-pointer text-start">
                    <li
                      className="p-1 hover:bg-slate-200 rounded"
                      onClick={() => {
                        setSortPostBy("Latest");
                        setShowFilterModal(false);
                      }}
                    >
                      Latest
                    </li>
                    <li
                      className="p-1 hover:bg-slate-200 rounded"
                      onClick={() => {
                        setSortPostBy("Oldest");
                        setShowFilterModal(false);
                      }}
                    >
                      Oldest
                    </li>
                    <li
                      className="p-1 hover:bg-slate-200 rounded"
                      onClick={() => {
                        setSortPostBy("Trending");
                        setShowFilterModal(false);
                      }}
                    >
                      Trending
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Show Posts */}
            {isLoading ? (
              <div className="z-20">
                <Loader show={isLoading} />
              </div>
            ) : searchQuery.trim() ? (
              // Display searched posts if a search query is present
              postSearchResults.length === 0 ? (
                <h1 className="text-2xl font-bold text-center mt-8">
                  No Posts Found
                </h1>
              ) : (
                postSearchResults.map((post) => (
                  <Post key={post.post_id} post={post} />
                ))
              )
            ) : !sortedPosts.length ? (
              <h1 className="text-2xl font-bold text-center mt-8">
                No Posts, Add one!
              </h1>
            ) : (
              sortedPosts.map((post) => <Post key={post.post_id} post={post} />)
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
