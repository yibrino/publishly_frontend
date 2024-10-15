import Language from "@mui/icons-material/Language";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import Settings from "@mui/icons-material/Settings";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./topbar.css"; // Assuming you have a CSS file for custom styles
import { signOutHandler } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOutHandler());
    navigate("/", { replace: true });
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen); // Toggle the dropdown menu visibility
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Publishly Admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>

          {/* Settings icon with dropdown menu */}
          <div className="topbarIconContainer" onClick={toggleSettingsMenu}>
            <Settings />
          </div>

          {/* Dropdown menu for settings */}
          {isSettingsOpen && (
            <div className="settingsDropdown">
              <button className="settingsLogoutButton" onClick={handleSignOut}>
                <span className="logoutIcon">🔒</span> Logout
              </button>
            </div>
          )}

          <img src="/publishly_logo.jpg" alt="avatar" className="topAvatar" />
        </div>
      </div>
    </div>
  );
}
