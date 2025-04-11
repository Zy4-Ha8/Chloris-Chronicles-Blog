import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import RadiusLoading from "../../components/loading/RadiusLoading";
const CompleteRegistion = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    image: null,
    imageFilePath: null,
  });
  const [userId, setUserId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  //   getting user info
  useEffect(() => {
    try {
      setLoading(true);
      async function getUserInfo() {
        if (user) {
          let { data: profile, error } = await supabase
            .from("profile")
            .select("*")
            .eq("id", user.id);
          if (error) {
            throw error;
          }
          setUserId(profile.id);
          setLoading(false);
        }
      }
      getUserInfo();
    } catch (error) {
      console.log(error);
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
        .from("profile-image")
        .upload(filePath, file);
      if (error) {
        throw error;
      }
      getURL(filePath);
      setFormData((prev) => {
        return { ...prev, imageFilePath: filePath };
      });
    } catch (error) {
      console.log(error);
    }
  };
  //   get image URL from supabase storage
  const getURL = (filePath) => {
    try {
      let { data, error } = supabase.storage
        .from("profile-image")
        .getPublicUrl(filePath);
      setFormData((prev) => {
        return { ...prev, image: data.publicUrl };
      });

      setLoadingImage(false);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
      setLoadingImage(false);
    } finally {
      setLoadingImage(false);
    }
  };
  //   handle image delete from supabase storage
  const deleteImage = async (e) => {
    e.preventDefault();
    try {
      setLoadingImage(true);
      const filePath = formData.image.split("/").slice(-1).join();
      const { data, error } = await supabase.storage
        .from("profile-image")
        .remove([filePath]);

      if (error) throw error;
      setLoadingImage(false);
      setFormData((prev) => {
        return { ...prev, image: null };
      });
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    } finally {
      setLoadingImage(false);
    }
  };

  //   handle submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const date = new Date();
      if (user) {
        const { data, error } = await supabase
          .from("profile")
          .insert([
            {
              id: user.id,
              created_at: date,
              name: formData.name,
              bio: formData.bio,
              email: user.email,
              imageUrl: formData.image,
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
  return (
    <>
      {loading ? (
        <RadiusLoading />
      ) : (
        <>
          {user && !userId ? (
            <div className="flex flex-col items-center min-h-screen p-4 bg-gray-900">
              <div className="w-full max-w-2xl p-8 bg-gray-800 rounded-xl shadow-lg space-y-8">
                <h1 className="text-3xl font-bold text-center text-white mb-8">
                  Complete Your Profile
                  <span className="block mt-2 text-lg font-normal text-gray-400">
                    Let's create your unique identity
                  </span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <input
                      className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Haider Ali"
                      required
                    />
                  </div>

                  {/* Bio Textarea */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Bio
                    </label>
                    <textarea
                      className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 h-32 resize-none"
                      placeholder="Tell us about yourself..."
                      maxLength="150"
                      name="bio"
                      value={formData.bio}
                      limit={150}
                      onChange={handleChange}
                      required
                    />
                    <span className="text-xs text-gray-400 float-right">
                      {formData.bio.length}/150
                    </span>
                  </div>

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
                            <span className="font-semibold">
                              Click to upload
                            </span>
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
                  <>
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
                      <div
                        className={
                          "w-40 h-40  mt-4 rounded-2xl shadow-lg relative"
                        }
                      >
                        <Skeleton
                          height={"100%"}
                          width={"100%"}
                          className="object-cover rounded-2xl"
                        />
                      </div>
                    )}
                  </>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loadingImage}
                    className={`w-full py-3 px-4 ${
                      !loadingImage
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-800 hover:bg-green-900"
                    } text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                  >
                    {loadingImage ? "Uploading The image... " : "Save Profile"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Navigate to={"/mypost"} />
          )}{" "}
        </>
      )}{" "}
    </>
  );
};

export default CompleteRegistion;
