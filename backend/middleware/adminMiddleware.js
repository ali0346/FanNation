// adminMiddleware.js
module.exports = function adminOnly(req, res, next) {
    if (req.user?.email === 'admin@gmail.com') {
      return next();
    } else {
      return res.status(403).json({ message: 'Admin access only' });
    }
  };
  