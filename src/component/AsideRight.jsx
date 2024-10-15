import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../utilities/debounce";
import { UserDetails } from "./UserDetails";
import { searchUser } from "../features/user/userSlice"; // User search action
import { searchPost } from "../features/post/postSlice"; // Post search action
import { useEffect, useState } from "react";
import Categories from "./Categories";
import { getUsers } from "../features/user/helpers";

export const AsideRight = () => {
  const {
    user: { users, searchQuery, searchResults: userSearchResults },
    posts: {
      searchResults: postSearchResults, // Searched post results from the store
    },
    auth: { userData },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  // State to manage the checkbox selection for searching either users or posts
  const [searchMode, setSearchMode] = useState("user"); // Default is "user"

  // Filter suggested users (users who are not followed by the current user)
  const suggestionList = users.filter(
    (suggestedUser) =>
      suggestedUser.user_id !== userData.id && // Exclude the current user
      !suggestedUser.followers.find(
        (follower) => follower.user_id === userData.id // Exclude if the current user is already a follower
      ) &&
      !suggestedUser.is_superuser // Exclude superusers
  );

  // Handle search input based on searchMode (either for users or posts)
  const handleSearch = debounce((value) => {
    if (searchMode === "user") {
      dispatch(searchUser(value)); // Dispatch user search
    } else if (searchMode === "post") {
      dispatch(searchPost(value)); // Dispatch post search
    }
  }, 1000);

  useEffect(() => {
    dispatch(getUsers()); // Reset users on load
    dispatch(searchUser("")); // Reset user search on load
    dispatch(searchPost("")); // Reset post search on load
  }, [dispatch]);

  return (
    <aside className="w-full basis-2/6 flex-col ml-7 hidden lg:flex md:mt-2">
      <div className="sticky mt-3 flex flex-col items-center pl-4 pr-10 mb-8 w-full rounded-md">
        {/* Checkbox to toggle between User or Post search */}
        <div className="flex justify-center space-x-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="searchType"
              value="user"
              checked={searchMode === "user"}
              onChange={() => setSearchMode("user")}
            />
            <span> Users</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="searchType"
              value="post"
              checked={searchMode === "post"}
              onChange={() => setSearchMode("post")}
            />
            <span> Posts</span>
          </label>
        </div>

        <div className="flex-1 w-full">
          <input
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-200 text-center p-2 rounded-3xl placeholder:text-black cursor-pointer text-md"
            type="search"
            placeholder={`Search ${searchMode === "user" ? "users" : "posts"}`}
          />
        </div>
      </div>

      <Categories />

      <div className="mt-2">
        {searchQuery.trim() !== "" ? (
          <div>
            {/* Conditionally show search results based on searchMode */}
            {searchMode === "user" && (
              <>
                {userSearchResults?.length === 0 ? (
                  <h2 className="text-lg w-full text-center font-semi-bold">
                    No user found
                  </h2>
                ) : (
                  userSearchResults.map((user) => (
                    <UserDetails key={user.user_id} currentUser={user} />
                  ))
                )}
              </>
            )}

            {searchMode === "post" && (
              <>
                {postSearchResults?.length === 0 ? (
                  <h2 className="text-lg w-full text-center font-semi-bold">
                    No post found
                  </h2>
                ) : (
                  postSearchResults.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-gray-100 rounded-lg mb-4"
                    >
                      <h3 className="font-bold text-lg">{post.title}</h3>
                      <p>{post.content}</p>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        ) : (
          !searchQuery.length && (
            <div>
              <h1 className="text-xl mt-6 text-center font-bold">
                Suggestions for you
              </h1>
              <ul className="">
                {suggestionList.map((user) => (
                  <UserDetails key={user.user_id} currentUser={user} />
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </aside>
  );
};
