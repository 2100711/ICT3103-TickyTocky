import { Link, Route, Routes } from "react-router-dom";
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

    const MenuItem = ({ r }) => {
        return (
            <div className="menuItem">
        <Link to={r.path}>{r.name}</Link>
      </div>
        );
    };
    return (
        <div className="menu">
      {nav.map((r, i) => {
        if (!r.isPrivate && r.isMenu) {
          return <MenuItem key={i} r={r} />;
        } else if (
          r.isPrivate &&
          r.isPrivate2 &&
          user.isAuthenticated &&
          user?.role === "admin" &&
          r.isMenu
        ) {
          return <MenuItem key={i} r={r} />;
        } else if (
          (typeof r.isPrivate2 === "undefined" || r.isPrivate2 === false) &&
          user.isAuthenticated &&
          r.isMenu
        ) {
          return <MenuItem key={i} r={r} />;
        } else return false;
      })}

      {user.isAuthenticated ? (
        <div className="menuItem">
          <Link to={"#"} onClick={handleLogout}>
            Log out
          </Link>
        </div>
      ) : (
        <div className="menuItem">
          <Link to={"login"}>Log in</Link>
        </div>
      )}
    </div>
    );
};