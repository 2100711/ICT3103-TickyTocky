import { About } from "../pages/About";
import { Account } from "../pages/Account";
import { AdminTest } from "../pages/AdminTest";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";

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
    path: "/about",
    name: "About",
    element: <About />,
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
