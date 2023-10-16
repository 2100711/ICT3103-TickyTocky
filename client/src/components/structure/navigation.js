import { AboutUs } from "../pages/AboutUs";
import { Account } from "../pages/Account";
import { AdminTest } from "../pages/AdminTest";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";
import { Register } from "../pages/Register";
import { OTPVerification } from "../pages/OTPVerification";
import { ForgotPassword } from "../pages/ForgotPassword";
import { PasswordReset } from "../pages/PasswordReset";

export const nav = [{
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