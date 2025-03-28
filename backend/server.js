const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const createAdminUser = require("./config/initAdmin");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Database sync and initialization
const initializeDatabase = async () => {
  try {
    // Force sync to recreate tables
    await sequelize.sync({ force: true });
    console.log("Database synced");
    // Create admin user after database is synced
    await createAdminUser();
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

initializeDatabase();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
