const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.email === req.body.email) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { isAuthenticated };
