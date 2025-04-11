import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { supabase } from "../../supabase";
const Navbar = () => {
  const [moblieMenu, setMoblieMenu] = useState(false);
  const { user } = useAuth();

  return (
    <div className=" sticky top-0 left-0 z-10 h-[64.79px] max-w-[1640px] m-auto">
      <div className=" px-10 flex justify-between border-b border-gray-600 py-4 backdrop-blur-lg  [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]  ">
        <div>
          <h1 className="  text-2xl">
            <Link to={"/"}>Chloris Chronicles Blog</Link>
          </h1>
        </div>
        <ul className={"hidden md:flex justify-center gap-5 flex-row m-1"}>
          {" "}
          <li>
            <Link
              className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
              to={"/"}
            >
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
                  to={"/mypost"}
                >
                  My Posts
                </Link>
              </li>
              <li>
                <Link
                  className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
                  to={"addpost"}
                >
                  Add Post
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
                  to={"login"}
                >
                  LogIn
                </Link>
              </li>
              <li>
                <Link
                  className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
                  to={"signup"}
                >
                  SignUp
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="md:hidden m-1">
          {moblieMenu ? (
            <>
              <div
                className="text-center mb-5 cursor-pointer "
                onClick={() => {
                  setMoblieMenu(false);
                }}
              >
                <FontAwesomeIcon icon={faX} />
              </div>
              <div>
                <ul
                  className={"flex justify-center items-center gap-5 flex-col"}
                >
                  {" "}
                  <li>
                    <Link
                      className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
                      to={"/"}
                    >
                      Home
                    </Link>
                  </li>
                  {user ? (
                    <>
                      <li>
                        <Link
                          className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
                          to={"/mypost"}
                        >
                          My Posts
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
                          to={"addpost"}
                        >
                          Add Post
                        </Link>
                      </li>
                      <li></li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          className="border p-2 rounded-lg border-gray-600 hover:bg-green-700 transform duration-300"
                          to={"login"}
                        >
                          LogIn
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="border p-2 rounded-lg border-gray-600 hover:bg-red-700 transform duration-300"
                          to={"signup"}
                        >
                          SignUp
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div
              className="text-center  cursor-pointer"
              onClick={() => {
                setMoblieMenu(true);
              }}
            >
              <FontAwesomeIcon icon={faBars} />
            </div>
          )}
        </div>
        {/* moblie menu  */}
      </div>
    </div>
  );
};

export default Navbar;
