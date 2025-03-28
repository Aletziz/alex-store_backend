const Order = require("../models/Order");

exports.confirmarPago = async (req, res) => {
  try {
    const { ordenId, numeroTransferencia } = req.body;

    const orden = await Order.findByPk(ordenId);

    if (!orden) {
      return res.status(404).json({ mensaje: "Orden no encontrada" });
    }

    // Actualizar el estado de la orden
    await orden.update({
      estado: "PAGADO",
      fechaPago: new Date(),
      numeroTransferencia: numeroTransferencia,
    });

    res.json({
      mensaje: "Pago confirmado exitosamente",
      orden: {
        id: orden.id,
        estado: orden.estado,
        fechaPago: orden.fechaPago,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Función para verificar pagos
exports.verificarPagos = async (req, res) => {
  try {
    const ordenes = await Order.findAll({
      where: { estado: "PENDIENTE" },
    });

    // Aquí simularemos la verificación con el banco
    // En un caso real, esto se conectaría con la API del banco
    const ordenesActualizadas = await Promise.all(
      ordenes.map(async (orden) => {
        // Simulación de verificación de pago
        const pagado = Math.random() > 0.5; // Simulación

        if (pagado) {
          await orden.update({
            estado: "PAGADO",
            fechaPago: new Date(),
          });
        }
        return orden;
      })
    );

    res.json({
      mensaje: "Verificación completada",
      ordenes: ordenesActualizadas,
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const TARJETA_DESTINO = "1234567890123456"; // Reemplaza con tu número de tarjeta real

const validarTarjeta = (numeroTarjeta, banco) => {
  if (numeroTarjeta.length !== 16) {
    throw new Error("El número de tarjeta debe tener 16 dígitos");
  }
  if (!["BANDEC", "POPULAR"].includes(banco)) {
    throw new Error("Banco no válido. Solo se aceptan BANDEC y POPULAR");
  }
  return true;
};

exports.crearOrden = async (req, res) => {
  try {
    const { items, total, cliente, numeroTarjeta, banco } = req.body;

    // Validar que items sea un array
    if (!Array.isArray(items)) {
      throw new Error("Los items deben ser un array");
    }

    // Convertir items a formato JSON antes de guardar
    const itemsJSON = JSON.stringify(items);

    const orden = await Order.create({
      clienteNombre: cliente.nombre,
      clienteTelefono: cliente.telefono,
      clienteEmail: cliente.email,
      direccion: cliente.direccion,
      numeroTarjeta,
      banco,
      total,
      items: itemsJSON,
      estado: "PENDIENTE",
    });

    res.status(201).json({
      mensaje: "Orden creada exitosamente",
      orden: {
        id: orden.id,
        total: orden.total,
      },
    });
  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(400).json({ mensaje: error.message });
  }
};

exports.obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await Order.findAll({
      attributes: [
        "id",
        "clienteNombre",
        "clienteEmail",
        "clienteTelefono",
        "direccion",
        "total",
        "estado",
        "fechaPago",
        "numeroTransferencia",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    // Formatear las órdenes para la respuesta
    const ordenesFormateadas = ordenes.map((orden) => {
      const ordenObj = orden.toJSON();
      return {
        ...ordenObj,
        createdAt: new Date(ordenObj.createdAt).toLocaleString("es-ES"),
        fechaPago: ordenObj.fechaPago
          ? new Date(ordenObj.fechaPago).toLocaleString("es-ES")
          : null,
      };
    });

    res.json(ordenesFormateadas);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ mensaje: "Error al cargar las órdenes" });
  }
};

// Obtener una orden específica
exports.obtenerOrden = async (req, res) => {
  try {
    const orden = await Order.findByPk(req.params.id);
    if (!orden) {
      return res.status(404).json({ mensaje: "Orden no encontrada" });
    }
    res.json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
