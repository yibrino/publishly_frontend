import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { signUpHandler } from "../../features/auth/helpers";
import styles from "./newUser.module.css"; // Import the CSS module

export default function NewUser() {
  const [showHideOne, setShowHideOne] = useState(false);
  const [showHideTwo, setShowHideTwo] = useState(false);

  const signUpInputs = {
    user_firstname: "",
    user_lastname: "",
    user_username: "",
    user_email: "",
    password: "",
    user_confirmPassword: "",
  };

  const [formInputs, setFormInputs] = useState(signUpInputs);
  const {
    user_firstname,
    user_lastname,
    user_username,
    user_email,
    password,
    user_confirmPassword,
  } = formInputs;

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,25}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const dispatch = useDispatch();

  const formCreateUserHandler = (e) => {
    e.preventDefault();

    if (
      user_firstname &&
      user_lastname &&
      user_username &&
      user_email &&
      password &&
      user_confirmPassword
    ) {
      if (!emailRegex.test(user_email)) {
        toast.error("Invalid email format!");
      } else if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
      } else if (!passwordRegex.test(password)) {
        toast.error(
          "Password must include 1 Uppercase, 1 Lowercase letter, 1 Special character, and 1 number"
        );
      } else if (password !== user_confirmPassword) {
        toast.error("Passwords do not match");
      } else {
        // Dispatch the action with form inputs
        dispatch(
          signUpHandler({
            user_firstname,
            user_lastname,
            user_username,
            user_email,
            password,
          })
        );
        toast.success("User created successfully!");
      }
    } else {
      toast.error("All fields are required");
    }
  };

  return (
    <div className={styles.newUser}>
      <h1 className={styles.newUserTitle}>New User</h1>

      <form className={styles.newUserForm} onSubmit={formCreateUserHandler}>
        <div className={styles.newUserItem}>
          <label>First Name</label>
          <input
            type="text"
            placeholder="John"
            value={user_firstname}
            onChange={(e) =>
              setFormInputs({ ...formInputs, user_firstname: e.target.value })
            }
          />
        </div>

        <div className={styles.newUserItem}>
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Smith"
            value={user_lastname}
            onChange={(e) =>
              setFormInputs({ ...formInputs, user_lastname: e.target.value })
            }
          />
        </div>

        <div className={styles.newUserItem}>
          <label>Username</label>
          <input
            type="text"
            placeholder="JohnSmith"
            value={user_username}
            onChange={(e) =>
              setFormInputs({ ...formInputs, user_username: e.target.value })
            }
          />
        </div>

        <div className={styles.newUserItem}>
          <label>Email</label>
          <input
            type="email"
            placeholder="johnsmith@example.com"
            value={user_email}
            onChange={(e) =>
              setFormInputs({ ...formInputs, user_email: e.target.value })
            }
          />
        </div>

        <div className={styles.newUserItem}>
          <label>Password</label>
          <input
            type={showHideOne ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setFormInputs({ ...formInputs, password: e.target.value })
            }
          />
          <i
            className={`fa ${showHideOne ? "fa-eye" : "fa-eye-slash"}`}
            onClick={() => setShowHideOne(!showHideOne)}
          ></i>
        </div>

        <div className={styles.newUserItem}>
          <label>Confirm Password</label>
          <input
            type={showHideTwo ? "text" : "password"}
            placeholder="Confirm Password"
            value={user_confirmPassword}
            onChange={(e) =>
              setFormInputs({
                ...formInputs,
                user_confirmPassword: e.target.value,
              })
            }
          />
          <i
            className={`fa ${showHideTwo ? "fa-eye" : "fa-eye-slash"}`}
            onClick={() => setShowHideTwo(!showHideTwo)}
          ></i>
        </div>

        <button className={styles.newUserButton} type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
