const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ mensaje: "No hay token de autorización" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
};
