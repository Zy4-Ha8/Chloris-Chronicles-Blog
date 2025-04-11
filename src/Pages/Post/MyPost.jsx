import { Link, Navigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../../supabase";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import blankImage from "../../assets/blog-blank.png";
import profileBlankImage from "../../assets/profile.webp";
const MyPost = () => {
  const [userInfo, setUserInfo] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [originalBlogs, setOriginalBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState("");
  const { user } = useAuth();
  const [dataFetcher, setDataFetcher] = useState(0);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  // get the user info and the blogs of the user
  useEffect(() => {
    try {
      if (user) {
        async function getUserInfo() {
          setLoadingUserInfo(true);
          let { data: profile, error } = await supabase
            .from("profile")
            .select("*")
            .eq("id", user.id);
          if (error) {
            throw error;
          }
          setUserInfo(profile[0]);
          setLoadingUserInfo(false);
        }
        getUserInfo();
        async function getUserBlogs() {
          setLoadingBlogs(true);
          let { data: blog, error } = await supabase
            .from("blog")
            .select("*")
            .eq("autherId", user.id);
          if (error) throw error;
          setBlogs(blog);
          setOriginalBlogs(blog);
          setLoadingBlogs(false);
        }
        getUserBlogs();
        async function getBlogsCategories() {
          setLoadingCategory(true);
          let { data: categories, error } = await supabase
            .from("blog")
            .select("category")
            .eq("autherId", user.id);
          if (error) throw error;
          setCategories(categories);
          setLoadingCategory(false);
        }
        getBlogsCategories();
      }
    } catch (error) {
      console.log(error);
    }
  }, [dataFetcher]);
  // handle delete of the post
  async function handleDeletePost(id) {
    try {
      const { error } = await supabase.from("blog").delete().eq("id", id);
      if (error) throw error;
      setDataFetcher((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  }

  // filtering by category
  function categoryFilter(e) {
    const selectedCategory = e.target.dataset.category;
    if (selectedCategory === "All") {
      setBlogs(originalBlogs);
    } else {
      const filteredBlogs = originalBlogs.filter(
        (blog) => blog.category === selectedCategory
      );
      setBlogs(filteredBlogs);
    }
  }

  // showing category filtering buttons
  const categoryShow = categories.map((category, index) => {
    return (
      <button
        onClick={categoryFilter}
        key={index}
        data-category={category.category}
        className="px-4 cursor-pointer py-2 border border-gray-600 line-clamp-1 hover:bg-gray-700 rounded-full "
      >
        {category.category}
      </button>
    );
  });

  const blogsShow = blogs.map((blog) => (
    <article className="rounded-xl shadow-md hover:shadow-lg transition-shadow bg-black/20 hover:scale-105 duration-300 cursor-pointer">
      <Link to={`/singlePost/${blog.id}`} className="block">
        {/* Image and main content */}
        <img
          className="w-full h-48 object-cover rounded-t-xl"
          src={blog.imageUrl || blankImage}
        />
        <div className="py-6 px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-sm border border-gray-300 w-fit px-3 py-1 rounded-full">
              {blog.category}
            </h1>
            <h1 className="text-sm border border-gray-300 w-fit px-3 py-1 rounded-full">
              {blog.privacy.toUpperCase()}
            </h1>
          </div>
          <h1 className="text-xl font-bold mb-2 line-clamp-1">{blog.title}</h1>
          <p className="text-neutral-100 mb-4 line-clamp-1">
            {blog.description}
          </p>
          <p className="text-sm">{blog.created_at}</p>
        </div>
      </Link>

      {/* Edit Post link */}
      <div className="mt-4 px-4 pb-4 flex justify-between items-center">
        <Link
          to={`/updatepost/${blog.id}`}
          className="py-2 px-3 border border-gray-500 rounded-lg hover:bg-gray-700"
          onClick={(e) => e.stopPropagation()} // Prevent main link navigation
        >
          Edit Post
        </Link>
        <button
          className="py-2 px-3 border cursor-pointer border-red-700 rounded-lg bg-red-700 hover:bg-red-800"
          onClick={() => handleDeletePost(blog.id)}
        >
          Delete Post
        </button>
      </div>
    </article>
  ));

  // handle LogOut
  async function logOut() {
    let { error } = await supabase.auth.signOut();
  }
  return (
    <>
      {user ? (
        userInfo ? (
          <div className="max-w-[1640px] m-auto p-4 flex flex-col gap-20 mt-10">
            {/* user profile */}
            {!loadingUserInfo ? (
              <div className="flex-col sm:flex-row flex justify-center items-center gap-10">
                {/* user image */}

                <div className="h-50 w-50 rounded-2xl">
                  <img
                    className="w-full h-full object-cover rounded-2xl"
                    src={userInfo.imageUrl || profileBlankImage}
                  />
                </div>
                {/* user info */}
                <div className="flex flex-col justify-between items-center gap-1 ">
                  {/* user name */}
                  <h1>{userInfo.name}</h1>
                  {/* user bio */}
                  <h1>{userInfo.bio}</h1>
                  {/* user email */}
                  <h1>{userInfo.email}</h1>
                  {/* time joining */}
                  <h1>{userInfo.created_at}</h1>
                  <div className="flex gap-4 mt-2">
                    <Link
                      to={`/edit-profile/${userInfo.id}`}
                      className=" block rounded border border-gray-500 py-2 px-4 w-fit hover:bg-gray-600 "
                    >
                      Edit Your details
                    </Link>

                    <button
                      onClick={logOut}
                      className="border p-2 rounded-lg border-gray-600 cursor-pointer hover:bg-red-800 bg-red-700 transform duration-300"
                    >
                      LogOut
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-col sm:flex-row flex justify-center items-center gap-10">
                  {/* user image */}

                  <div className="h-50 w-50 rounded-2xl">
                    <Skeleton
                      height={200}
                      width={200}
                      borderRadius={20}
                      className="rounded-2xl"
                    />
                  </div>
                  {/* user info */}
                  <div className="flex flex-col justify-between items-center gap-1 ">
                    {/* user name */}
                    <Skeleton width={300} height={20} borderRadius={20} />
                    {/* user bio */}
                    <Skeleton width={300} height={20} borderRadius={20} />

                    {/* user email */}
                    <Skeleton width={300} height={20} borderRadius={20} />

                    {/* time joining */}
                    <Skeleton width={300} height={20} borderRadius={20} />

                    <Skeleton width={100} height={40} borderRadius={20} />
                  </div>
                </div>
              </>
            )}

            {/* user posts */}
            <div>
              {/* ********************************************************** Header ***************************************************************************************** */}
              <div>
                <h1 className="text-center text-2xl sm:text-4xl lg:text-5xl">
                  My Posts
                </h1>
                <div className=" text-xl flex flex-wrap justify-between items-center my-12 px-4 gap-4">
                  <div className="flex items-center justify-center gap-4  ">
                    {!loadingCategory ? (
                      <>
                        <button
                          onClick={categoryFilter}
                          data-category={"All"}
                          className=" cursor-pointer px-4 py-2 border border-gray-600 hover:bg-gray-700 rounded-full "
                        >
                          All
                        </button>
                        {categoryShow}
                      </>
                    ) : (
                      <>
                        {" "}
                        {[1, 2, 3].map((index) => (
                          <Skeleton
                            key={index}
                            height={50}
                            width={100}
                            borderRadius={100}
                            className="px-4  py-2 rounded-full "
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ********************************************************** Crad ***************************************************************************************** */}
            <div className="text-center ">
              <h1 className="text-4xl">There Is No Post Yet</h1>
              <div className="mt-4">
                <Link
                  className="p-2 border border-neutral-600 rounded-lg hover:bg-neutral-700 text-xl"
                  to={"/addpost"}
                >
                  Add Things
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 ">
              {!loadingBlogs
                ? blogsShow
                : [1, 2, 3, 4, 5].map((index) => {
                    return (
                      <article
                        key={index}
                        className=" rounded-xl shadow-md hover:shadow-lg h-[300px] transition-shadow bg-black/20 hover:scale-105 duration-300 cursor-pointer p-4"
                      >
                        {/* image of the post */}
                        <Skeleton height={"50%"} />
                        <div className="p-3">
                          <div className="flex gap-2 mb-3">
                            {/* category */}
                            <Skeleton
                              width={"100px"}
                              height={"20px"}
                              borderRadius={"20px"}
                            />
                          </div>
                          {/* title */}
                          <Skeleton />
                          {/* description  */}
                          <Skeleton />
                          {/* image of the author and the of him */}
                          <div className="flex items-center gap-3">
                            {/* <img src={userImage} className="w-8 h-8 rounded-full" /> */}
                            <Skeleton circle={true} height={30} width={30} />
                            <Skeleton width={"200px"} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
            </div>
          </div>
        ) : (
          <Navigate to={"/complete-registion"} />
        )
      ) : (
        <Navigate to={"/signup"} />
      )}
    </>
  );
};

export default MyPost;
