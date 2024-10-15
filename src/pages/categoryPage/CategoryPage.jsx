import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AsideLeft, AsideRight, MobileNavBar, Post } from "../../component";
import { getAllPosts } from "../../features/post/helpers";
import Loader from "react-spinner-loader";

export const CategoryPage = () => {
  const {
    auth: { token },
    posts: { posts, isLoading },
  } = useSelector((state) => state);
  const { category_slug } = useParams();
  console.log("Category_Slug", category_slug);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch, token]);
  const postsSelectedCategory = posts.filter(
    (post) => post.category.category_slug.trim() === category_slug.trim()
  );
  console.log("postsSelectedCategory", postsSelectedCategory);

  return (
    <div>
      <MobileNavBar />

      <div className="flex justify-center px-5 sm:px-32 md:mt-4">
        <div className="flex h-screen w-screen">
          <AsideLeft />

          <main className="md:mx-4 w-full sm:basis-2/3">
            <header className="m-4 hidden sm:flex">
              <h1 className="text-xl">Explore</h1>
            </header>

            <header className="text-xl font-bold flex py-4 text-blue-600 sm:hidden">
              <Link to="/home" id="hero-logo">
                {" "}
                Publishly{" "}
              </Link>
            </header>

            {isLoading ? (
              <div className="z-20">
                <Loader show={isLoading} />
              </div>
            ) : (
              postsSelectedCategory.map((post) => (
                <Post key={post.post_id} post={post} />
              ))
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
