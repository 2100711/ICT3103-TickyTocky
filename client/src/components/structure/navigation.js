import { AboutUs } from "../pages/AboutUs";
import { Account } from "../pages/Account";
import { AdminTest } from "../pages/AdminTest";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";
import { Register } from "../pages/Register";

export const nav = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
    isMenu: true,
    isPrivate: false,
    iconName: "HomeOutlined", // Replace with the actual icon name
  },
  {
    path: "/aboutus",
    name: "About Us",
    element: <AboutUs />,
    isMenu: true,
    isPrivate: false,
    iconName: "InfoCircleOutlined", // Replace with the actual icon name
  },
  {
    path: "/login",
    name: "Login",
    element: <Login />,
    isMenu: false,
    isPrivate: false,
    iconName: "LoginOutlined", // Replace with the actual icon name
  },
  {
    path: "/register",
    name: "Register",
    element: <Register />,
    isMenu: false,
    isPrivate: false,
    iconName: "RegisterOutlined", // Replace with the actual icon name
  },
  {
    path: "/account",
    name: "Account",
    element: <Account />,
    isMenu: true,
    isPrivate: true,
    iconName: "UserOutlined", // Replace with the actual icon name
  },
  {
    path: "/admin",
    name: "Admin",
    element: <Admin />,
    isMenu: true,
    isPrivate: true,
    isPrivate2: true,
    iconName: "LockOutlined", // Replace with the actual icon name
  },
  {
    path: "/admintest",
    name: "AdminTest",
    element: <AdminTest />,
    isMenu: true,
    isPrivate: true,
    isPrivate2: true,
    iconName: "LockOutlined", // Replace with the actual icon name
  },
];
