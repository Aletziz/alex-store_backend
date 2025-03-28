const User = require("../models/User");

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({
      where: { email: "admin@admin.com" },
    });

    if (!adminExists) {
      await User.create({
        nombre: "Administrador",
        email: "admin@admin.com",
        password: "admin123",
        telefono: "12345678",
        direccion: "Dirección Admin",
        role: "admin",
      });
      console.log("Usuario administrador creado exitosamente");
    }
  } catch (error) {
    console.error("Error al crear usuario administrador:", error);
  }
};

module.exports = createAdminUser;
