const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clienteNombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clienteTelefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clienteEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numeroTarjeta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  banco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "PENDIENTE",
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  numeroTransferencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  items: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue("items");
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue("items", JSON.stringify(value));
    },
  },
});

module.exports = Order;
