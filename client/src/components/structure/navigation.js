import { About } from "../pages/About";
import { Account } from "../pages/Account";
import { AdminTest } from "../pages/AdminTest";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";

export const nav = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
    isMenu: true,
    isPrivate: false,
  },
  {
    path: "/about",
    name: "About",
    element: <About />,
    isMenu: true,
    isPrivate: false,
  },
  {
    path: "/login",
    name: "Login",
    element: <Login />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/account",
    name: "Account",
    element: <Account />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/admintest",
    name: "admintest",
    element: <AdminTest />,
    isMenu: true,
    isPrivate: true,
    isPrivate2: true,
  },
];
