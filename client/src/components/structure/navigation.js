import { AboutUs } from "../pages/AboutUs";
import { Account } from "../pages/Account";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { OTPVerification } from "../pages/OTPVerification";
import { ForgotPassword } from "../pages/ForgotPassword";
import { PasswordReset } from "../pages/PasswordReset";
import { NotFound } from "../errors/NotFound";
import { ServerError } from "../errors/ServerError";
import { Unauthorized } from "../errors/Unauthorized";

export const nav = [
        {
        path: "/unauthorized",
        name: "Unauthorized",
        element: <Unauthorized />,
        isMenu: false,
        isPrivate: false,
    },
        {
        path: "/servererror",
        name: "Server Error",
        element: <ServerError />,
        isMenu: false,
        isPrivate: false,
    },
        {
        path: "*",
        name: "Not Found",
        element: <NotFound />,
        isMenu: false,
        isPrivate: false,
    },
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
        path: "/forgotpassword",
        name: "Forgot Password",
        element: <ForgotPassword />,
        isMenu: false,
        isPrivate: false,
    },
    {
        path: "/resetpassword",
        name: "Reset Password",
        element: <PasswordReset />,
        isMenu: false,
        isPrivate: false,
    },
    {
        path: "/otp",
        name: "OTP Verification",
        element: <OTPVerification />,
        isMenu: false,
        isPrivate: false,
    },
    {
        path: "/account",
        name: "Account",
        element: <Account />,
        isMenu: true,
        isPrivate: true,
        iconName: "UserOutlined", // Replace with the actual icon name
    },
];