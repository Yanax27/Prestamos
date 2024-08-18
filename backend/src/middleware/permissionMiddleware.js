const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.role !== requiredRole) {
        return resError(res, 403, 'No tienes permiso para realizar esta acción');
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  