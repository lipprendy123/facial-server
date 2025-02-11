const authorizeRoles = (...roles) => {
  return (req, res, next) => {
      if (!req.user) {
          return res.status(401).json({ message: "Silakan login terlebih dahulu" });
      }

      if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: "Akses tidak diizinkan" });
      }

      next();
  };
};

module.exports = authorizeRoles;
