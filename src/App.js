import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "./features/user/helpers";
import "./App.css";

import { getProfiles } from "./features/user/helpers/getProfiles";
import { NavRoutes } from "./routes/NavRoutes";
export default function App() {
  const {
    auth: { token },
    user: { users, profiles },
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  console.log("All Users", users);
  console.log("All Profiles", profiles);

  useEffect(() => {
    dispatch(getProfiles());
  }, [token, dispatch]);

  return (
    <div className="home scroll-smooth">
      <NavRoutes />
    </div>
  );
}
