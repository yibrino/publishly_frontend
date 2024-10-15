import { AiOutlineCamera } from "react-icons/ai";
import { Modal } from "react-responsive-modal";
import { useDispatch, useSelector } from "react-redux";
import { startUpLoading } from "../features/user/userSlice";
import { updateUser, createProfile } from "../features/user/helpers"; // Import both actions
import { useState, useEffect } from "react";
import { getProfiles } from "../features/user/helpers";
import { getUsers } from "../features/user/helpers";
export const EditProfileModal = ({
  currentUser,
  showUpdateProfile,
  setShowUpdateProfile,
  profileMode, // Add profileMode prop
}) => {
  const {
    user: { profiles },
    auth: { token },
  } = useSelector((state) => state);

  const userFilteredProfiles = profiles.filter(
    (profile) => profile.user === currentUser.user_id
  );
  const userprofile = userFilteredProfiles[0];
  const dispatch = useDispatch();

  // Initialize profile state with current user data or empty if creating
  const [profile, setProfile] = useState({
    user_bio: "",
    user_website: "",
    profilePicture: "",
  });
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (userprofile && profileMode === "edit") {
      setProfile({
        user_bio: userprofile.user_bio || "",
        user_website: userprofile.user_website || "",
        profilePicture: userprofile.user_profile_picture || "",
      });
    }
  }, [userprofile, profileMode]); // Initialize profile data if mode is "edit"

  const cloudinaryUrl =
    "https://api.cloudinary.com/v1_1/dos65ciy5/image/upload";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowUpdateProfile(false); // Close the modal

    let profilePictureUrl = profile.profilePicture;

    if (fileUrl) {
      dispatch(startUpLoading());
      const file = fileUrl;
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
        profilePictureUrl = url; // Set uploaded image URL
      } catch (err) {
        console.error("Error occurred while uploading image", err);
      }
    }

    const updatedUserData = {
      ...profile,
      profilePicture: profilePictureUrl,
    };

    // Dispatch the appropriate action based on profileMode
    if (profileMode === "create") {
      try {
        // Dispatch createProfile
        await dispatch(
          createProfile({
            token,
            user_id: currentUser.user_id,
            profilePicture: updatedUserData.profilePicture,
            user_bio: updatedUserData.user_bio,
            user_website: updatedUserData.user_website,
          })
        ).then(() => {
          // After creating the profile, fetch the updated profiles
          dispatch(getProfiles());
          console.log("Profile created successfully");
        });
      } catch (error) {
        console.error("Error dispatching createProfile:", error);
      }
    } else if (profileMode === "edit") {
      try {
        // Dispatch updateUser
        await dispatch(
          updateUser({
            token,
            profile_id: userprofile.profile_id,
            profilePicture: updatedUserData.profilePicture,
            user_bio: updatedUserData.user_bio,
            user_website: updatedUserData.user_website,
          })
        ).then(() => {
          // After creating the profile, fetch the updated profiles
          dispatch(getProfiles());
          dispatch(getUsers());
          console.log("Profile updated successfully");
        });
      } catch (error) {
        console.error("Error dispatching updateUser:", error);
      }
    }
  };

  return (
    <Modal
      open={showUpdateProfile}
      onClose={() => setShowUpdateProfile(false)} // This ensures modal closes when clicking outside
      styles={{
        modal: { width: "20rem", borderRadius: "1rem", height: "fit-content" },
      }}
      showCloseIcon={false} // You can keep or remove this depending on if you want the close icon
      center // Center the modal in the screen
    >
      <div className="flex flex-col">
        <div className="flex flex-col mx-auto">
          <h1 className="text-xl mb-4 mx-auto font-semibold">
            {profileMode === "create" ? "Create Profile" : "Edit Profile"}
          </h1>

          <div className="relative">
            <img
              src={
                fileUrl ? URL.createObjectURL(fileUrl) : profile.profilePicture
              }
              className="mx-auto w-32 h-32 rounded-full"
              alt="avatar"
            />
            <label className="w-8 h-8 absolute right-9 bottom-1 bg-slate-200 p-1 rounded-full border-2 cursor-pointer border-white fill-blue-600 stroke-0 hover:stroke-2 text-2xl">
              <input
                className="hidden"
                type="file"
                onChange={(e) => setFileUrl(e.target.files[0])}
              />
              <AiOutlineCamera />
            </label>
          </div>

          <div className="mx-auto my-2 flex flex-col">
            <h2 className="mx-auto font-semibold">Username</h2>
            <h2 className="mx-auto text-slate-700">
              @{currentUser?.user_username}
            </h2>
          </div>

          <div className="mx-auto mb-2 flex flex-col">
            <h2 className="mx-auto font-semibold">Name</h2>
            <h2 className="text-slate-700">{`${currentUser?.user_firstname} ${currentUser?.user_lastname}`}</h2>
          </div>

          <div className="mx-auto mb-2 flex flex-col">
            <h2 className="mx-auto font-semibold">Bio</h2>
            <input
              className="my-1.5 bg-transparent border px-1 border-slate-400"
              type="text"
              placeholder="Enter your bio"
              value={profile.user_bio}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, user_bio: e.target.value }))
              }
            />
          </div>

          <div className="mx-auto mb-2 flex flex-col">
            <h2 className="mx-auto font-semibold">Website</h2>
            <input
              className="my-1.5 bg-transparent border px-1 border-slate-400"
              type="text"
              placeholder="Enter your website"
              value={profile.user_website}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  user_website: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-between m-1">
          <button
            className="px-3 w-18 h-8 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out"
            onClick={() => setShowUpdateProfile(false)}
          >
            Cancel
          </button>

          <button
            className="px-3 w-18 h-8 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out"
            onClick={handleSubmit}
          >
            {profileMode === "create" ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
