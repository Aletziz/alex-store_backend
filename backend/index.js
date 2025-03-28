const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");
const path = require("path");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://alex-store-theta.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

// Ruta para verificar el estado del servidor
app.get("/routes/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Alex Store API funcionando correctamente",
    environment: process.env.NODE_ENV,
  });
});

// Middleware de autenticación global
app.use((req, res, next) => {
  const publicRoutes = [
    "/routes/auth/login",
    "/routes/auth/register",
    "/routes/products",
  ];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensaje: "No autorizado" });
  }
  // ... resto de la lógica de autenticación
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: true,
    mensaje: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida");

    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados con la base de datos");

    app.listen(PORT, () => {
      console.log(`Servidor de Alex Store corriendo en el puerto ${PORT}`);
      console.log(`Modo: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
