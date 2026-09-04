// index.js (Persona 5)
// Orquesta las 5 etapas del pedido y corre las pruebas de ejemplo.

const { verificarRestauranteAsync } = require('./restaurante.js');
const { validarInventario } = require('./inventario.js');
const { procesarPagoAsync, reversarPago } = require('./pago.js');
const { asignarRepartidorAsync } = require('./repartidor.js');
const { notificarCliente } = require('./Notificaciones.js');
const { registrarError, mensajeParaCliente } = require('./Errores.js');

/**
 * Procesa un pedido de punta a punta, encadenando las 5 etapas.
 * Nunca rechaza: siempre captura y devuelve un resumen.
 * @param {object} pedido { id, restaurante, productos, monto, cliente, zonaEntrega }
 * @returns {Promise<object>} resumen del pedido
 */
async function procesarPedido(pedido) {
  const inicio = Date.now();
  const resumen = {
    id: pedido.id,
    exitoso: false,
    etapas: {},
    duracionMs: null,
    mensajeCliente: null,
  };

  let pagoConfirmado = null;

  try {
    // 1. Restaurante
    const t1 = Date.now();
    const infoRestaurante = await verificarRestauranteAsync(pedido.restaurante);
    resumen.etapas.restaurante = { ok: true, duracionMs: Date.now() - t1, datos: infoRestaurante };

    // 2. Inventario
    const t2 = Date.now();
    const productosConfirmados = await validarInventario(pedido.productos);
    resumen.etapas.inventario = { ok: true, duracionMs: Date.now() - t2, datos: productosConfirmados };

    // 3. Pago
    const t3 = Date.now();
    pagoConfirmado = await procesarPagoAsync(pedido.monto, pedido.cliente);
    resumen.etapas.pago = { ok: true, duracionMs: Date.now() - t3, datos: pagoConfirmado };

    // 4. Repartidor (si falla y el pago ya se confirmó, se reversa el pago)
    const t4 = Date.now();
    try {
      const repartidor = await asignarRepartidorAsync(pedido.zonaEntrega);
      resumen.etapas.repartidor = { ok: true, duracionMs: Date.now() - t4, datos: repartidor };
    } catch (errorRepartidor) {
      registrarError(errorRepartidor);
      await reversarPago(pagoConfirmado.idTransaccion);
      resumen.etapas.repartidor = {
        ok: false,
        duracionMs: Date.now() - t4,
        error: errorRepartidor.causa || errorRepartidor.message,
      };
      resumen.pagoReversado = true;
      throw errorRepartidor;
    }

    // 5. Notificación (no cancela el pedido si falla un canal)
    const t5 = Date.now();
    const resultadoNotificacion = await notificarCliente(pedido);
    resumen.etapas.notificacion = { ok: resultadoNotificacion.exitoso, duracionMs: Date.now() - t5, informe: resultadoNotificacion.informe };

    resumen.exitoso = true;
    resumen.mensajeCliente = 'Tu pedido fue confirmado con éxito.';
  } catch (error) {
    registrarError(error);
    resumen.exitoso = false;
    resumen.mensajeCliente = mensajeParaCliente(error);
    resumen.errorTipo = error.name || 'ErrorDesconocido';
    resumen.errorCausa = error.causa || error.message;
  }

  resumen.duracionMs = Date.now() - inicio;
  return resumen;
}

// ---------- Pruebas ----------

const pedidosDePrueba = [
  {
    id: 'PED-001',
    restaurante: 'Arepas El Buen Sabor',
    productos: [{ nombre: 'Arepa de queso', cantidad: 2 }, { nombre: 'Jugo de mora', cantidad: 1 }],
    monto: 25000,
    cliente: { nombre: 'Juan Pérez' },
    zonaEntrega: 'Bello Centro',
  },
  {
    id: 'PED-002',
    restaurante: 'Pizzería Napoli',
    productos: [{ nombre: 'Pizza mediana', cantidad: 1 }],
    monto: 42000,
    cliente: { nombre: 'María Gómez' },
    zonaEntrega: 'Niquía',
  },
  {
    id: 'PED-003',
    restaurante: 'Sushi Express',
    productos: [{ nombre: 'Roll California', cantidad: 3 }, { nombre: 'Sopa miso', cantidad: 2 }],
    monto: 68000,
    cliente: { nombre: 'Andrés Ríos' },
    zonaEntrega: 'Copacabana',
  },
  {
    id: 'PED-004',
    restaurante: 'Hamburguesas El Corral',
    productos: [{ nombre: 'Hamburguesa clásica', cantidad: 2 }, { nombre: 'Papas', cantidad: 2 }],
    monto: 38000,
    cliente: { nombre: 'Laura Torres' },
    zonaEntrega: 'Bello Centro',
  },
  {
    id: 'PED-005',
    restaurante: 'Comida China Wok',
    productos: [{ nombre: 'Arroz frito', cantidad: 1 }, { nombre: 'Pollo agridulce', cantidad: 1 }],
    monto: 30000,
    cliente: { nombre: 'Carlos Ospina' },
    zonaEntrega: 'Girardota',
  },
];

async function correrPruebas() {
  console.log('=== RápidoYa: procesando pedidos de prueba ===\n');

  const resultados = await Promise.all(pedidosDePrueba.map((p) => procesarPedido(p)));

  resultados.forEach((r) => {
    console.log('----------------------------------------');
    console.log(`Pedido ${r.id} | éxito: ${r.exitoso} | duración: ${r.duracionMs}ms`);
    console.log(`Mensaje al cliente: ${r.mensajeCliente}`);
    if (!r.exitoso) {
      console.log(`Tipo de error: ${r.errorTipo} | causa: ${r.errorCausa}`);
      if (r.pagoReversado) console.log('Pago reversado: sí');
    }
  });

  const exitosos = resultados.filter((r) => r.exitoso).length;
  console.log('\n=== Resumen final ===');
  console.log(`${exitosos}/${resultados.length} pedidos completados con éxito.`);
}

if (require.main === module) {
  correrPruebas();
}

module.exports = { procesarPedido };