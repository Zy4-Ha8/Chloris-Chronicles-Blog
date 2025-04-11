import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import RadiusLoading from "../../components/loading/RadiusLoading";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const AddPost = () => {
  // state for storing blog info
  const [formData, setFormData] = useState({
    category: "History",
    title: "",
    description: "",
    content: "",
    privacy: "public",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  //   getting user info
  useEffect(() => {
    try {
      async function getUserInfo() {
        if (user) {
          let { data: profile, error } = await supabase
            .from("profile")
            .select("*")
            .eq("id", user.id);
          if (error) {
            throw error;
          }

          setFormData((prev) => {
            return { ...prev, autherId: profile.id };
          });
        }
        setLoading(false);
      }

      getUserInfo();

      function getCategory() {
        supabase
          .from("blog-category")
          .select("*")
          .then(({ data: categories, error }) => {
            if (error) {
              throw error;
            }
            setCategories(categories);
          });
      }
      getCategory();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // handle change form data
  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  //   handle Upload image
  const handleImageUpload = async (e) => {
    try {
      setLoadingImage(true);
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      let { data, error } = await supabase.storage
        .from("blog-image")
        .upload(filePath, file);
      if (error) {
        throw error;
      }
      getURL(filePath);
    } catch (error) {
      console.log(error);
    }
  };
  //   get image URL from supabase storage
  const getURL = (filePath) => {
    try {
      let { data, error } = supabase.storage
        .from("blog-image")
        .getPublicUrl(filePath);

      setFormData((prev) => {
        return { ...prev, image: data.publicUrl };
      });

      if (error) {
        throw error;
      }
      setLoadingImage(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingImage(false);
    }
  };
  //   handle image delete from supabase storage
  const deleteImage = async (e) => {
    e.preventDefault();
    try {
      const filePath = formData.image.split("/").slice(-1).join();
      const { data, error } = await supabase.storage
        .from("blog-image")
        .remove([filePath]);

      if (error) throw error;

      setFormData((prev) => {
        return { ...prev, image: null };
      });

      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  };

  //   handle submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const date = new Date();
      if (user) {
        const { data, error } = await supabase
          .from("blog")
          .insert([
            {
              created_at: date,
              category: formData.category,
              title: formData.title,
              description: formData.description,
              content: formData.content,
              privacy: formData.privacy,
              imageUrl: formData.image,
              autherId: user.id,
            },
          ])
          .select();
        if (error) {
          throw error;
        }
        if (data) {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return !loading ? (
    <div className="flex flex-col gap-10  items-center my-10">
      <div className="p-5 bg-black rounded-xl w-full max-w-[600px] flex flex-col gap-5 justify-center items-center">
        <h1 className="text-2xl sm:text-4xl">Add Post</h1>
        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col gap-5 w-full  "
        >
          <select
            className="p-2 text-xl outline-none bg-gray-600 rounded-lg cursor-pointer "
            type="text"
            placeholder="Category"
            name="category"
            required
            onChange={handleChange}
          >
            {categories.map((category) => (
              <option value={category.category}>{category.category}</option>
            ))}
          </select>
          <input
            className="p-2 text-lg outline-none bg-gray-600 rounded-lg"
            type="text"
            placeholder="title"
            name="title"
            required
            onChange={handleChange}
          />
          <input
            className="p-2 text-lg outline-none bg-gray-600 rounded-lg"
            type="text"
            placeholder="description"
            name="description"
            required
            onChange={handleChange}
          />
          <textarea
            className="p-2 text-lg outline-none h-[200px] bg-gray-600 rounded-lg"
            type="text"
            placeholder="content"
            name="content"
            required
            onChange={handleChange}
          />
          <select
            name="privacy"
            required
            onChange={handleChange}
            className="p-2 text-lg outline-none  bg-gray-600 rounded-lg cursor-pointer   "
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Blog Photo
            </label>
            <div className="flex items-center justify-center w-full group">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition-colors group-hover:border-green-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400 group-hover:text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-400 group-hover:text-green-500">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG (MAX 2MB)
                  </p>
                </div>
                <input
                  id="image"
                  type="file"
                  onChange={(e) => {
                    handleImageUpload(e);
                  }}
                  name="image"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg"
                />
              </label>
            </div>
          </div>
          {/* image that should submit */}
          {!loadingImage ? (
            <div
              className={
                !formData.image
                  ? "hidden"
                  : "w-40 h-40  mt-4 rounded-2xl shadow-lg relative"
              }
            >
              <img
                className="h-full w-full object-cover rounded-2xl"
                src={formData.image}
                alt=""
              />
              <button
                onClick={deleteImage}
                className="absolute top-2 right-2 bg-gray-800 rounded-full p-2 text-sm shadow-lg hover:bg-red-700 transition-colors duration-300 cursor-pointer"
              >
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
          ) : (
            <div className={"w-40 h-40  mt-4 rounded-2xl shadow-lg relative"}>
              <Skeleton
                height={"100%"}
                width={"100%"}
                className="object-cover rounded-2xl"
              />
            </div>
          )}
          <button
            className={`w-full py-3 px-4 ${
              !loadingImage
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-800 hover:bg-green-900"
            } text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg`}
            type="submit"
            disabled={loadingImage}
          >
            {loadingImage ? "Uploading The image " : "Add Post"}
          </button>
        </form>
      </div>
    </div>
  ) : (
    <RadiusLoading />
  );
};

export default AddPost;
