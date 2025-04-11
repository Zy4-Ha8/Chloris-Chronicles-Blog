import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../../supabase";
import RadiusLoading from "../../components/loading/RadiusLoading";
import blankImage from "../../assets/blog-blank.png";
import profileBlankImage from "../../assets/profile.webp";
const SinglePost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getUserBlogs() {
      let { data: blog, error } = await supabase
        .from("blog")
        .select("*")
        .eq("id", id);

      if (error) throw error;
      setBlog(blog[0]);
      setLoading(false);
    }
    getUserBlogs();
  }, []);
  useEffect(() => {
    if (blog) {
      async function getUserInfo() {
        let { data: profile, error } = await supabase
          .from("profile")
          .select("*")
          .eq("id", blog.autherId);

        setUserInfo(profile[0]);
      }
      getUserInfo();
    }
  }, [blog]);
  return !loading ? (
    <div className="max-w-[1640px] m-auto">
      <div className="w-full shadow-2xl ">
        <img className="w-full h-full" src={blog.imageUrl || blankImage} />
      </div>
      <div className="text-center sm:text-start px-5 flex flex-col gap-5 sm:px-10 py-5">
        {/* category */}
        <h1 className="text-xl  sm:text-2xl font-bold underline  pt-3">
          {blog.category}
        </h1>
        {/* title */}
        <h1 className="text-2xl sm:text-4xl font-bold ">{blog.title}</h1>
        {/* description */}
        <h1 className="text-lg sm:text-xl text-gray-400 font-bold">
          {blog.description}
        </h1>
        {/* content */}
        <p className="text-md sm:text-lg text-gray-500/90 font-semibold">
          {blog.content}
        </p>
      </div>
      {/* author info */}

      <div className="p-10 flex  items-center gap-2 justify-around flex-col text-center ">
        <div className="w-[200px] h-[200px] rounded-lg overflow-hidden  shadow-2xl  ">
          <img
            className="w-full h-full object-cover"
            src={userInfo.imageUrl || profileBlankImage}
          />
        </div>
        {/* author name */}
        <h1>{userInfo.name}</h1>
        {/* author about */}
        <p>{userInfo.bio}</p>
        {/* time that published  */}
        <p>{blog.created_at}</p>
      </div>
    </div>
  ) : (
    <RadiusLoading />
  );
};

export default SinglePost;
