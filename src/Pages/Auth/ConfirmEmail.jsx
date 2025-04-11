import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import RadiusLoading from "../../components/loading/RadiusLoading";
import { useEffect, useState } from "react";

const ConfirmEmail = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user === null) {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      {loading && <RadiusLoading />}
      {!user ? (
        <div className="min-h-screen  flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">📬</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Thanks for joining My Blog!
              </h1>
              <p className="text-gray-600 mb-4">
                We've sent a confirmation link to your email address
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="font-medium text-blue-800">
                  Didn't receive the email?
                </h2>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside text-left">
                  <li>Check your spam/junk folder</li>
                  <li>Wait 2-3 minutes for delivery</li>
                  <li>Ensure you entered the correct email</li>
                </ul>
              </div>

              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Welcome to our community !
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to={"/complete-registion"} />
      )}
    </>
  );
};

export default ConfirmEmail;
