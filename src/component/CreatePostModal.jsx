import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-responsive-modal";
import { BsFillImageFill } from "react-icons/bs";
import {
  createPost,
  editPost,
  getAllCategories,
} from "../features/post/helpers"; // Import getAllCategories
import { closePostModal, setEditPostObj } from "../features/post/postSlice";
import { toast } from "react-toastify";
import { getAllPosts } from "../features/post/helpers";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export const CreatePostModal = () => {
  const [postData, setPostData] = useState({
    post_content: "",
    post_image_url: "",
    category_id: "", // Add category_id to the post data
  });
  const [isFetching, setIsFetching] = useState(false);

  const {
    auth: { userData, token },
    posts: { showPostModal, editPostObj, categories }, // Add categories from the state
    user: { users, profiles },
  } = useSelector((state) => state);

  const user_id = userData.id;
  const currentUser = users.find((user) => user.user_id === userData.id);
  const userFilteredProfiles = currentUser
    ? profiles.filter((profile) => profile.user === currentUser.user_id)
    : [];

  const userprofile = userFilteredProfiles[0];
  const dispatch = useDispatch();

  // Fetch categories when the modal opens
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Set postData when editPostObj changes
  useEffect(() => {
    setPostData(
      editPostObj || { post_content: "", post_image_url: "", category_id: "" }
    );
    return () => {
      setPostData(null);
    };
  }, [editPostObj]);

  useEffect(() => {
    if (isFetching) {
      const toastMessage = editPostObj ? "Editing Post" : "Adding Post";
      toast(toastMessage, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  }, [isFetching, editPostObj]);

  const cloudinaryUrl =
    "https://api.cloudinary.com/v1_1/dos65ciy5/image/upload";

  const postHandler = async (e) => {
    e.preventDefault();

    if (!postData) {
      toast.error("Post data is not available.");
      return;
    }

    setIsFetching(true);

    if (postData) {
      if (
        postData?.post_image_url !== editPostObj?.post_image_url ||
        postData?.post_content !== editPostObj?.post_content
      ) {
        if (typeof postData?.post_image_url === "object") {
          const file = postData?.post_image_url;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "publishly");
          formData.append("folder", "publish");

          try {
            const res = await fetch(cloudinaryUrl, {
              method: "POST",
              body: formData,
            });

            const { url } = await res.json();

            if (editPostObj) {
              dispatch(
                editPost({
                  content: postData?.post_content,
                  url,
                  token,
                  post_id: postData.post_id,
                  category_id: postData?.category_id, // Pass the selected category_id
                })
              );
              dispatch(getAllPosts());
              setIsFetching(false);
            } else {
              dispatch(
                createPost({
                  content: postData?.post_content,
                  url,
                  token,
                  user_id,
                  category_id: postData?.category_id, // Pass the selected category_id
                })
              );
              dispatch(getAllPosts());
              setIsFetching(false);
            }

            dispatch(getAllPosts());
            setIsFetching(false);
          } catch (err) {
            console.error("error occurred", err);
            setIsFetching(false);
          }
        } else {
          if (editPostObj) {
            dispatch(
              editPost({
                content: postData?.post_content,
                url: editPostObj?.post_image_url,
                token,
                post_id: postData.post_id,
                category_id: postData?.category_id, // Pass the selected category_id
              })
            );
            dispatch(getAllPosts());
            setIsFetching(false);
          } else {
            dispatch(
              createPost({
                content: postData?.post_content,
                token,
                user_id,
                category_id: postData?.category_id, // Pass the selected category_id
              })
            );
          }

          dispatch(getAllPosts());
          setIsFetching(false);
        }
      }
    }

    setPostData({ post_content: "", post_image_url: "", category_id: "" });
    dispatch(closePostModal());
    dispatch(setEditPostObj(null));
    dispatch(getAllPosts());
  };

  return (
    <Modal
      styles={{
        modal: {
          width: "20rem",
          height: "fit-content",
          paddingTop: "0.2rem",
          borderRadius: "1rem",
          margin: "0 auto",
        },
        overlay: { backgroundColor: "rgba(0,0,0,0.1)" },
      }}
      open={showPostModal}
      onClose={() => dispatch(closePostModal())}
      showCloseIcon={false}
      center={true}
    >
      <div className="flex justify-end">
        <button
          className="text-lg font-semibold"
          onClick={() => dispatch(closePostModal())}
        >
          x
        </button>
      </div>

      <div className="flex py-3">
        <div className="mt-3 w-12 h-12 text-lg flex-none">
          <img
            src={userprofile?.user_profile_picture}
            className="flex-none w-12 h-12 rounded-full"
            alt="avatar"
          />
        </div>

        <div className="w-full px-2">
          <textarea
            value={postData?.post_content || ""}
            placeholder="What's happening?"
            className="resize-none mt-3 pb-3 w-full h-28 bg-slate-100 focus:outline-none rounded-xl p-2"
            onChange={(e) =>
              setPostData({ ...postData, post_content: e.target.value })
            }
          ></textarea>

          {/* Category Selection */}
          <select
            className="w-full mt-2 mb-2 p-2 border rounded-md bg-white"
            value={postData?.category_id}
            onChange={(e) =>
              setPostData({ ...postData, category_id: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>

          <div className="max-w-xl max-h-80 mx-auto rounded-md">
            <img
              src={
                typeof postData?.post_image_url === "object"
                  ? URL.createObjectURL(postData?.post_image_url)
                  : postData?.post_image_url
              }
              className={
                postData?.post_image_url
                  ? "block max-w-full max-h-20 rounded-md my-2 cursor-pointer"
                  : "hidden"
              }
              alt="postImage"
            />
          </div>

          <div className="flex justify-between">
            <label className="flex m-2">
              <input
                className="hidden"
                type="file"
                onChange={(e) =>
                  setPostData({
                    ...postData,
                    post_image_url: e.target.files[0],
                  })
                }
                accept="image/*"
              />
              <BsFillImageFill className="text-2xl mt-1 text-blue-700 cursor-pointer" />
            </label>
            <button
              disabled={
                !postData ||
                (!postData?.post_content.length &&
                  !postData?.post_image_url &&
                  !postData?.category_id)
              }
              className="disabled:cursor-not-allowed p-2.5 pt-3 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md 
                            hover:shadow-lg transition duration-150 ease-in-out"
              onClick={postHandler}
            >
              {editPostObj ? "Update" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
