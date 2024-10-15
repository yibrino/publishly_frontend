import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signInHandler } from "../../features/auth/helpers";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export const Signin = () => {
  const loginInputs = {
    user_email: "",
    password: "",
  };

  const [formInputs, setFormInputs] = useState(loginInputs);
  const [showHide, setShowHide] = useState(false);

  const { user_email, password } = formInputs;

  const { isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const formSignInHandler = (e) => {
    e.preventDefault();
    if (!user_email || !password) {
      toast.error("All fields are required!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
    } else {
      console.log("Email", user_email);
      console.log("Password", password);
      dispatch(signInHandler({ user_email, password }));
    }
  };

  return (
    <div
      className="flex flex-col items-center mt-0 min-h-screen"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1391415202/it/vettoriale/illustrazioni-design-concept-videoconferenza-da-mobile-lavoro-di-riunione-online-da-casa.jpg?s=1024x1024&w=is&k=20&c=VILEZLePbNVEBYK42mUhoizAwHPoAvn5NaWLNZXnGkI=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <header className="text-3xl font-bold text-white mb-6">Publishly</header>

      <div
        className="w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-6 relative"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Light transparent background to match the image
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
            <ClipLoader color={"#3498db"} loading={isLoading} size={50} />
          </div>
        )}

        <form className="space-y-6" onSubmit={formSignInHandler}>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Sign In
          </h2>

          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Email</span>
              <input
                name="user_email"
                value={user_email}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="email"
                required
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    user_email: e.target.value,
                  })
                }
              />
            </label>

            <label className="relative block">
              <span className="text-gray-700">Password</span>
              <input
                name="password"
                value={password}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                type={showHide ? "text" : "password"}
                required
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    password: e.target.value,
                  })
                }
              />
              <i
                className={`absolute right-3 top-9 text-gray-500 cursor-pointer fa-solid ${
                  showHide ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={() => setShowHide((prev) => !prev)}
              ></i>
            </label>
          </div>

          <button
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition"
            type="submit"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            New to Publishly?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
