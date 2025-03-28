const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");

// Definir relaciones entre modelos si es necesario
User.hasMany(Order);
Order.belongsTo(User);

module.exports = {
  User,
  Product,
  Order,
};
