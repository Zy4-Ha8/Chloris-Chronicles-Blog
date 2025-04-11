import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import blankImage from "../../assets/blog-blank.png";
import profileBlankImage from "../../assets/profile.webp";
const AllPost = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [originalBlogs, setOriginalBlogs] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    async function getUsersInfo() {
      let { data: profile, error } = await supabase.from("profile").select("*");
      setUsersInfo(profile);
    }
    getUsersInfo();
    async function getUserBlogs() {
      setLoadingBlogs(true);
      let { data: blog, error } = await supabase
        .from("blog")
        .select("*")
        .eq("privacy", "public");
      // .eq("autherId", user.id);
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
        .eq("privacy", "public");
      // .eq("autherId", user.id);
      if (error) throw error;
      setCategories(categories);
      setLoadingCategory(false);
    }
    getBlogsCategories();
  }, []);

  // filtering by category
  function categoryFilter(e) {
    setLoadingBlogs(true);
    const selectedCategory = e.target.dataset.category;
    if (selectedCategory === "All") {
      setBlogs(originalBlogs);
      setLoadingBlogs(false);
    } else {
      const filteredBlogs = originalBlogs.filter(
        (blog) => blog.category === selectedCategory
      );
      setBlogs(filteredBlogs);
      setLoadingBlogs(false);
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
  // showing the blogs
  const blogsShow = blogs?.map((blog) => {
    const userImage = usersInfo.find(
      (user) => user.id === blog.autherId
    )?.imageUrl;
    return (
      <Link to={`/singlePost/${blog.id}`}>
        <article className=" rounded-xl shadow-md hover:shadow-lg transition-shadow bg-black/20 hover:scale-105 duration-300 cursor-pointer ">
          {/* image of the post */}
          <img
            src={blog.imageUrl || blankImage}
            className="w-full h-48 object-cover rounded-t-xl"
          />

          <div className="p-6">
            <div className="flex gap-2 mb-3">
              {/* category */}
              <span className="text-sm border border-gray-600 px-3 py-1 rounded-full">
                {blog.category}
              </span>
            </div>
            {/* title */}
            <h3 className="text-xl font-bold mb-2 line-clamp-1">
              {blog.title}
            </h3>
            {/* description  */}
            <p className="text-neutral-100 mb-4 line-clamp-1">
              {blog.description}
            </p>
            {/* image of the author and the of him */}
            <div className="flex items-center gap-3">
              <img
                src={userImage || profileBlankImage}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm">{blog.created_at}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  });

  return (
    <div className=" my-10 max-w-[1640px] m-auto p-4 ">
      {/* ********************************************************** Header ***************************************************************************************** */}
      <div>
        <h1 className="text-center text-2xl sm:text-4xl lg:text-5xl">
          Explore Fresh Perspectives
        </h1>
        <div className=" text-xl flex flex-wrap justify-between items-center my-12 px-4 gap-4">
          <div className="flex items-center justify-start gap-4 flex-wrap  ">
            {!loadingCategory ? (
              <>
                <button
                  onClick={categoryFilter}
                  data-category={"All"}
                  className="px-4 cursor-pointer py-2 border border-gray-600 hover:bg-gray-700 rounded-full "
                >
                  All
                </button>
                {categoryShow}
              </>
            ) : (
              <>
                {" "}
                {[1, 2, 3, 4, 5].map((index) => (
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
      {/* ********************************************************** Crad ***************************************************************************************** */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
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
  );
};

export default AllPost;
