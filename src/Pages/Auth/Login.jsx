import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../../supabase";
const Login = () => {
  // state form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // navigate to confirm email page
  const navigate = useNavigate();
  const { user } = useAuth();

  // handle data change
  const handleDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        throw error;
      }
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return !user ? (
    <div className="h-[90vh] flex justify-center items-center flex-col  ">
      <div className="w-fit shadow-2xl bg-black p-10 rounded-2xl ">
        <h1 className="text-2xl sm:text-4xl mb-4 text-center ">
          Welcome Back honey{" "}
        </h1>
        <h1 className="text-lg sm:text-2xl text-center mb-10">
          You have missed a lot{" "}
        </h1>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-lg sm:text-xl" htmlFor="email">
              Email:
            </label>
            <input
              className="text-lg sm:text-xl px-4 py-3 outline-none bg-gray-700 rounded-lg"
              id="email"
              value={formData.email}
              name="email"
              onChange={handleDataChange}
              type="email"
              placeholder="Enter Your Email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg sm:text-xl" htmlFor="password">
              Password:
            </label>
            <input
              className="text-lg sm:text-xl px-4 py-3 outline-none bg-gray-700 rounded-lg"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleDataChange}
              type="password"
              placeholder="Enter Your Password"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-700 border border-gray-700 rounded-lg p-2 cursor-pointer  hover:bg-gray-800 duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-5">
          Don't Have Account ?{" "}
          <Link className="font-bold text-shadow-2xs" to="/signup">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  ) : (
    <Navigate to={"/"} />
  );
};

export default Login;
