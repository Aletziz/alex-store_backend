const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al cargar los productos" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, stock } = req.body;
    const product = await Product.create({
      nombre,
      descripcion,
      precio,
      imagen,
      stock,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};
