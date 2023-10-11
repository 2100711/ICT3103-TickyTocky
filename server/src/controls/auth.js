const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res
      .status(200)
      .json({ success: false, message: "Invalid session." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Unauthorised." });
  }
};

export { isAuthenticated, isAdmin };
