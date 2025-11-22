export const hasRole =
  (roles = []) =>
  (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    next();
  };

export const hasPermission =
  (required = []) =>
  (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    const userPerms = req.user.permissions || [];
    const ok = required.every((p) => userPerms.includes(p));
    if (!ok)
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    next();
  };
