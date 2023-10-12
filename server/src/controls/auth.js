import { UserModel } from "../models/Users.js";

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res
      .status(200)
      .json({ success: false, message: "Invalid session." });
  }
};

// isAdmin function should be used only after isAuthenticated
const isAdmin = async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).select("-_id role");
  if (user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Unauthorized." });
  }
};

export { isAuthenticated, isAdmin };
