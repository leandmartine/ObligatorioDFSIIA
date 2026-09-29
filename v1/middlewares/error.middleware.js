export const errorMiddleware = (err, req, res, next) => {
  const response = {
    message: err.message || "Error interno del servidor",
  };

  if (err.code) {
    response.code = err.code;
  }

  if (err.providerCode) {
    response.details = `El proveedor de IA informó: ${err.providerCode}`;
  }

  res.status(err.status || 500).json(response);
};
