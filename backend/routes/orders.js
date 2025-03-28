const express = require("express");
const router = express.Router();
const {
  crearOrden,
  obtenerOrdenes,
  confirmarPago,
} = require("../controllers/orderController");
const { isAdmin } = require("../middleware/authMiddleware");

router.post("/", crearOrden);
router.get("/", isAdmin, obtenerOrdenes);
router.post("/confirmar-pago", confirmarPago);

module.exports = router;
