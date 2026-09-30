export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permiso para acceder a este recurso" });
    }
    next();
  };
};

export const authorizeAdmin = (req, res, next) => {
  const esAdministrador = req.user.esAdmin === true

  if (!esAdministrador) {
    return res.status(403).json({ message: "Solo un administrador puede realizar esta acción" });
  }

  next();
};

export const authorizeModerator = (req, res, next) => {
  if (req.user?.puedeModerar !== true) {
    return res.status(403).json({ message: "Solo un moderador puede realizar esta acción" });
  }

  next();
};
