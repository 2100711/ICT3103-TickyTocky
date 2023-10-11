import React from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Menu } from "antd"; // Import Ant Design Menu component
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons"; // Import Ant Design icons
import { AuthData } from "../../auth/AuthWrapper";
import { nav } from "./navigation";
import { useNavigate } from "react-router-dom";

export const RenderRoutes = () => {
  const { user } = AuthData();

  return (
    <Routes>
      {nav.map((r, i) => {
        if (
          r.isPrivate &&
          r.isPrivate2 &&
          user.isAuthenticated &&
          user?.role === "admin"
        ) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else if (
          r.isPrivate &&
          (typeof r.isPrivate2 === "undefined" || r.isPrivate2 === false) &&
          user.isAuthenticated
        ) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else if (!r.isPrivate) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else return false;
      })}
    </Routes>
  );
};

export const RenderMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = AuthData();

  const handleLogout = async () => {
    const { success, message } = await logout();
    if (success) {
      navigate("/");
    }
    console.log(message); // TODO: Remove
  };

  const location = useLocation();

  // Check if the current route is "login" and conditionally render the navbar
  if (location.pathname === "/login") {
    return null; // Render nothing for the "login" route
  }

  return (
    <Menu mode="horizontal" theme="dark" selectedKeys={[]}>
      {nav.map((r, i) => {
        const shouldRenderItem =
          (!r.isPrivate && r.isMenu) ||
          (r.isPrivate &&
            r.isPrivate2 &&
            user.isAuthenticated &&
            user?.role === "admin" &&
            r.isMenu) ||
          ((typeof r.isPrivate2 === "undefined" || r.isPrivate2 === false) &&
            user.isAuthenticated &&
            r.isMenu);

        return shouldRenderItem ? (
          <Menu.Item
            key={i}
            icon={
              r.iconName &&
              React.createElement(require("@ant-design/icons")[r.iconName])
            }
          >
            <Link to={r.path}>{r.name}</Link>
          </Menu.Item>
        ) : null;
      })}

      {user.isAuthenticated ? (
        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Log Out
        </Menu.Item>
      ) : (
        <Menu.Item key="login" icon={<LoginOutlined />}>
          <Link to="/login">Log In</Link>
        </Menu.Item>
      )}
    </Menu>
  );
};
