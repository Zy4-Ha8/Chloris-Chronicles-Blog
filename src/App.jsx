import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import SignUp from "./Pages/Auth/SignUp";
import AddPost from "./Pages/Post/AddPost";
import SinglePost from "./Pages/Post/SinglePost";
import MyPost from "./Pages/Post/MyPost";
import Footer from "./components/Footer";
import AuthProvider from "./Context/AuthContext";
import ConfirmEmail from "./Pages/Auth/ConfirmEmail";
import CompleteRegistion from "./Pages/Auth/CompleteRegistion";
import UpdateProfile from "./Pages/Auth/UpdateProfile";
import UpdatePost from "./Pages/Post/UpdatePost";
import NotFound404 from "./components/404page/NotFound404";
import ScrollToTop from "./components/ScrollToTop ";
function App() {
  return (
    <div className="relative">
      <Router>
        <AuthProvider>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/complete-registion" element={<CompleteRegistion />} />
            <Route path="/edit-profile/:id" element={<UpdateProfile />} />
            <Route path="/addpost" element={<AddPost />} />
            <Route path="/singlepost/:id" element={<SinglePost />} />
            <Route path="/mypost" element={<MyPost />} />
            <Route path="/updatepost/:id" element={<UpdatePost />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
