import { Link, Navigate, useNavigate } from "react-router-dom";
import {  useState } from "react";
import { supabase } from "../../../supabase";
import { useAuth } from "../../Context/AuthContext";

const SignUp = () => {
  // state form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // navigate to confirm email page
  const navigate = useNavigate();
  const { user } = useAuth();
  // handle loading

  // handle data change
  const handleDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        throw error;
      }
      navigate("/confirm-email");
    } catch (error) {
      console.log(Error(error));
    }
  };

  return (
    <>
      {!user ? (
        <>
          <div className="h-[90vh] flex justify-center items-center flex-col  ">
            <div className="w-fit shadow-2xl bg-black p-10 rounded-2xl ">
              <h1 className="text-2xl sm:text-4xl mb-4 text-center ">
                Welcome to Chloris Chronicles{" "}
              </h1>
              <h1 className="text-lg sm:text-2xl text-center mb-10">
                Create Your Account{" "}
              </h1>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-lg sm:text-xl" htmlFor="email">
                    Email:
                  </label>
                  <input
                    className="text-lg sm:text-xl px-4 py-3 outline-none bg-gray-700 rounded-lg"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleDataChange}
                    type="email"
                    placeholder="Enter Your Email"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-lg sm:text-xl" htmlFor="password">
                    Password:
                  </label>
                  <input
                    className="text-lg sm:text-xl px-4 py-3 outline-none bg-gray-700 rounded-lg"
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleDataChange}
                    placeholder="Enter Your Password"
                  />
                </div>
                <button className="bg-gray-700 border border-gray-700 rounded-lg p-2 cursor-pointer  hover:bg-gray-800 duration-300">
                  SignUp
                </button>
              </form>
              <p className="text-center mt-5">
                Already have Accout ?{" "}
                <Link className="font-bold text-shadow-2xs" to="/login">
                  LogIN
                </Link>
              </p>
            </div>
          </div>
        </>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default SignUp;
