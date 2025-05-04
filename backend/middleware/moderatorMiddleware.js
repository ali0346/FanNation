// backend/middleware/moderatorMiddleware.js
module.exports = (req, res, next) => {
    const user = req.user;
    if (user && (user.role === 'moderator' || user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: moderators only' });
    }
  };
  