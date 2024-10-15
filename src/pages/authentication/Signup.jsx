import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signUpHandler } from "../../features/auth/helpers";
import Loader from "react-spinner-loader";
import { toast } from "react-toastify";

export const Signup = () => {
  const [showHideOne, setShowHideOne] = useState(false);
  const [showHideTwo, setShowHideTwo] = useState(false);

  const signUpInputs = {
    user_username: "",
    user_email: "",
    user_firstname: "",
    user_lastname: "",
    user_password: "",
    user_confirmPassword: "",
  };

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,25}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const {
    auth: { isLoading },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  const [formInputs, setFormInputs] = useState(signUpInputs);

  const {
    user_firstname,
    user_lastname,
    user_username,
    user_email,
    password,
    user_confirmPassword,
  } = formInputs;

  const formSignUpHandler = (e) => {
    e.preventDefault();

    if (user_username && user_email && password && user_confirmPassword) {
      if (!emailRegex.test(user_email)) {
        toast.error("Invalid email format!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        });
      } else if (password.length < 8) {
        toast.error("Password must be at least 8 characters", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        });
      } else if (!passwordRegex.test(password)) {
        toast.error(
          "Required 1 Uppercase, 1 Lowercase letter, 1 Special character, and 1 number",
          { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 2000 }
        );
      } else {
        if (formInputs.password === formInputs.user_confirmPassword) {
          dispatch(
            signUpHandler({
              user_firstname,
              user_lastname,
              user_username,
              user_email,
              password,
            })
          );
        } else {
          toast.error("Password does not match!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
          });
        }
      }
    } else {
      toast.error("All fields are required!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
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
        className="w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-6"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Light transparent background to match the image
        }}
      >
        <div className="relative">
          <Loader show={isLoading} type="body" />
        </div>

        <form className="space-y-6 " onSubmit={formSignUpHandler}>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Sign Up
          </h2>

          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Firstname</span>
              <input
                name="user_firstname"
                value={user_firstname}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="text"
                required
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    user_firstname: e.target.value,
                  })
                }
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Lastname</span>
              <input
                name="user_lastname"
                value={user_lastname}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="text"
                required
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    user_lastname: e.target.value,
                  })
                }
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Username</span>
              <input
                name="user_username"
                value={user_username}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="text"
                required
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    user_username: e.target.value,
                  })
                }
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Email</span>
              <input
                name="user_email"
                value={user_email}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="email"
                required
                onChange={(e) =>
                  setFormInputs({ ...formInputs, user_email: e.target.value })
                }
              />
            </label>

            <label className="relative block">
              <span className="text-gray-700">Password</span>
              <input
                name="password"
                value={password}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type={showHideOne ? "text" : "password"}
                required
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    password: e.target.value,
                  })
                }
              />
              <i
                className={`absolute right-4 top-10 text-gray-500 cursor-pointer fa-solid ${
                  showHideOne ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={() => setShowHideOne((prev) => !prev)}
              ></i>
            </label>

            <label className="relative block">
              <span className="text-gray-700">Confirm Password</span>
              <input
                name="user_confirmPassword"
                value={user_confirmPassword}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type={showHideTwo ? "text" : "password"}
                required
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    user_confirmPassword: e.target.value,
                  })
                }
              />
              <i
                className={`absolute right-4 top-10 text-gray-500 cursor-pointer fa-solid ${
                  showHideTwo ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={() => setShowHideTwo((prev) => !prev)}
              ></i>
            </label>
          </div>

          <button
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition"
            type="submit"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
