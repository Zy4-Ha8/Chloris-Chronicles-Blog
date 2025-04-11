import { Link } from "react-router-dom";
import landingImage from "../assets/land1.avif";
import { useAuth } from "../Context/AuthContext";
const Landing = () => {

  const { user } = useAuth();
  
  return (
    <div className=" bg-black h-[90vh] relative max-w-[1640px] m-auto ">
      <div className="w-[100%] h-[100%]">
        <img className="w-[100%] h-[100%]" src={landingImage} alt="" />
      </div>
      <div className="absolute top-0 left-0 h-[100%] flex justify-center items-center flex-col w-[100%] p-4 gap-5  backdrop-blur-sm">
        <h1 className="text-lg sm:text-2xl md:text-4xl text-center [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] font-bold ">
          Discover Stories That Inspire, Educate,
          <hr className="border-none" />
          and Ignite Your Curiosity
        </h1>
        <h1 className="text-md sm:lg md:text-2xl mt-8 text-center [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] font-bold">
          Dive into a World of Your Niche,
          <span className=" ">
            Tech Insights, Travel Adventures, or Mindful Living Where Every
            <hr className="border-none" />
            Article Sparks New Ideas and Fuels Your Passion.
          </span>
        </h1>
        <hr className="border-none" />
        <Link
          to={user ? "mypost" : "/signup"}
          className="bg-gradient-to-r from-green-500 to-green-800 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-900"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Landing;
