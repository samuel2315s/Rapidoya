// errores.js (Persona 5)
// Clases de error del sistema. Todos los demás módulos importan de aquí.

class ErrorPedido extends Error {
  constructor(detalles = {}, causa = 'Error desconocido') {
    super(causa);
    this.name = this.constructor.name;
    this.detalles = detalles;
    this.causa = causa;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class ErrorRestaurante extends ErrorPedido {}
class ErrorInventario extends ErrorPedido {}
class ErrorPago extends ErrorPedido {}
class ErrorRepartidor extends ErrorPedido {}

/**
 * Registra un error de forma centralizada (consola por ahora).
 * @param {ErrorPedido} error
 */
function registrarError(error) {
  const tipo = error?.name || 'ErrorDesconocido';
  const causa = error?.causa || error?.message || 'sin causa registrada';
  const detalles = error?.detalles ? JSON.stringify(error.detalles) : '{}';
  console.error(`[${new Date().toISOString()}] ${tipo}: ${causa} | detalles=${detalles}`);
}

/**
 * Traduce un error interno a un mensaje amigable para el cliente final.
 * @param {ErrorPedido} error
 * @returns {string}
 */
function mensajeParaCliente(error) {
  switch (error?.name) {
    case 'ErrorRestaurante':
      return 'El restaurante no está disponible en este momento. Intenta con otro o más tarde.';
    case 'ErrorInventario':
      return 'Uno o más productos de tu pedido no están disponibles ahora mismo.';
    case 'ErrorPago':
      return 'No pudimos procesar tu pago. Verifica tu método de pago e intenta de nuevo.';
    case 'ErrorRepartidor':
      return 'No hay repartidores disponibles en tu zona en este momento. Tu pago fue reversado.';
    default:
      return 'Ocurrió un problema procesando tu pedido. Por favor intenta de nuevo.';
  }
}

module.exports = {
  ErrorPedido,
  ErrorRestaurante,
  ErrorInventario,
  ErrorPago,
  ErrorRepartidor,
  registrarError,
  mensajeParaCliente,
};