import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabase";
import { useAuth } from "../../Context/AuthContext";
import Skeleton from "react-loading-skeleton";

const UpdatePost = () => {
  // id of the user profile
  const { id } = useParams();

  //   state for updated user info
  const { user } = useAuth();
  const navigate = useNavigate();
  const [updatedForm, setUpdatedForm] = useState({
    category: "",
    title: "",
    description: "",
    content: "",
    privacy: "public",
    image: null,
  });
  // state for store the previous image path
  const [prevImagePath, setPrevImagePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  //   fetching the previous user info
   useEffect(() => {
    async function getBlogInfo() {
      try {
        setLoading(true);
        let { data: blog, error } = await supabase
          .from("blog")
          .select("*")
          .eq("id", id);
        if (error) {
          throw error;
        }
         setUpdatedForm({
          category: blog[0].category,
          title: blog[0].title,
          description: blog[0].description,
          content: blog[0].content,
          privacy: blog[0].privacy,
          image: blog[0].imageUrl,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getBlogInfo();
  }, []);
  //  handle form input changing
  const handleChange = (e) => {
    setUpdatedForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  // handle image uploading
  const handleImageUpload = async (e) => {
    try {
      setLoadingImage(true);
      // 1. to delete the previous image we add the file path to this state
      setPrevImagePath(updatedForm.image.split("/").slice(-1).join());

      // 2. Upload new image AFTER deletion succeeds
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-image")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Update state with new image path
      getURL(filePath);

      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };
  //   get image URL from supabase storage
  const getURL = async (filePath) => {
    try {
      let { data, error } = supabase.storage
        .from("blog-image")
        .getPublicUrl(filePath);
      setUpdatedForm((prev) => {
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
  //   handle image remove
  const deleteImage = async (e) => {
    e.preventDefault();
    if (updatedForm.image) {
      try {
        const filePath = updatedForm.image.split("/").slice(-1).join();
        const { data, error } = await supabase.storage
          .from("blog-image")
          .remove([filePath]);

        if (error) throw error;
 
        setUpdatedForm((prev) => {
          return { ...prev, image: null };
        });
        return true;
      } catch (error) {
        console.error("Delete error:", error);
        return false;
      }
    }
  };
  // handle submition of the updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    // delete the previous image
    try {
      if (prevImagePath !== null) {
        const filePath = prevImagePath;

        const { data: deleteDone, error: deleteError } = await supabase.storage
          .from("blog-image")
          .remove([filePath]);
         setPrevImagePath(null);

        if (deleteError) throw deleteError;
      }
      // upload user info data
      if (user) {
        const { data, error } = await supabase
          .from("blog")
          .update({
            category: updatedForm.category,
            title: updatedForm.title,
            description: updatedForm.description,
            content: updatedForm.content,
            privacy: updatedForm.privacy,
            imageUrl: updatedForm.image,
          })
          .eq("id", id)
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
  return (
    <div>
      <div className="flex flex-col items-center min-h-screen p-4 bg-gray-900">
        <div className="w-full max-w-2xl p-8 bg-gray-800 rounded-xl shadow-lg space-y-8">
          <h1 className="text-3xl font-bold text-center text-white mb-8">
            Update Your Post
          </h1>
          {!loading ? (
            <form
              onSubmit={handleSubmit}
              className=" flex flex-col gap-5 w-full"
            >
              {/* Name Input */}
              <input
                className="p-2 text-xl outline-none bg-gray-700 rounded-lg text-gray-400"
                type="text"
                placeholder="Category"
                value={updatedForm.category}
                disabled
                name="category"
                onChange={handleChange}
              />
              <input
                className="p-2 text-lg outline-none bg-gray-600 rounded-lg"
                type="text"
                placeholder="title"
                name="title"
                value={updatedForm.title}
                onChange={handleChange}
              />
              <input
                className="p-2 text-lg outline-none bg-gray-600 rounded-lg"
                type="text"
                placeholder="description"
                name="description"
                value={updatedForm.description}
                onChange={handleChange}
              />
              <textarea
                className="p-2 text-lg outline-none h-[200px] bg-gray-600 rounded-lg"
                type="text"
                placeholder="content"
                value={updatedForm.content}
                name="content"
                onChange={handleChange}
              />
              <select
                name="privacy"
                onChange={handleChange}
                value={updatedForm.privacy}
                className="p-2 text-lg outline-none  bg-gray-600 rounded-lg cursor-pointer appearance-none"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Profile Photo
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
                      disabled={loadingImage}
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
                  className={"w-40 h-40  mt-4 rounded-2xl shadow-lg relative"}
                >
                  <img
                    className="h-full w-full object-cover rounded-2xl"
                    src={updatedForm.image}
                  />
                  <button
                    onClick={deleteImage}
                    className="absolute top-2 right-2 bg-gray-800 rounded-full p-2 text-sm shadow-lg hover:bg-red-700 transition-colors duration-300 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
              ) : (
                <div
                  className={"w-40 h-40  mt-4 rounded-2xl shadow-lg relative"}
                >
                  <Skeleton height={"150px"} />
                </div>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-4 ${
                  !loadingImage
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-800 hover:bg-green-900"
                } text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg`}
              >
                {loadingImage ? "Uploading The image " : "Save Post"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit}
              className=" flex flex-col gap-5 w-full mt-4"
            >
              {/* Name Input */}

              <Skeleton height={"40px"} />
              <Skeleton height={"40px"} />
              <Skeleton height={"40px"} />
              <Skeleton height={"200px"} />
              <Skeleton height={"40px"} />

              {/* File Upload */}
              <div className="space-y-2">
                <Skeleton height={"150px"} />
              </div>
              {/* image that should submit */}
              <div className={"w-40 h-40  mt-4 rounded-2xl shadow-lg relative"}>
                <Skeleton borderRadius={15} height={"150px"} />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
