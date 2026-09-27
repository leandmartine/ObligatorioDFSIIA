export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permiso para acceder a este recurso" });
    }
    next();
  };
};

export const authorizeAdmin = (req, res, next) => {
  const esAdministrador =
    req.user?.esAdmin === true ||
    req.user?.role === "administrador" ||
    req.user?.role === "admin";

  if (!esAdministrador) {
    return res.status(403).json({ message: "Solo un administrador puede dar de baja categorías" });
  }

  next();
};
