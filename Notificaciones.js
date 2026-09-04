// persona5-notificaciones.js (Persona 5)

function simularEnvio(canal, pedido, probabilidadFallo = 0.1, minMs = 200, maxMs = 600) {
  return new Promise((resolve, reject) => {
    const delay = minMs + Math.random() * (maxMs - minMs);
    setTimeout(() => {
      if (Math.random() < probabilidadFallo) {
        reject(new Error(`Fallo enviando ${canal} para el pedido ${pedido?.id ?? '(sin id)'}`));
      } else {
        resolve(`${canal} enviado correctamente`);
      }
    }, delay);
  });
}

function enviarCorreo(pedido) {
  return simularEnvio('correo', pedido, 0.1);
}

function enviarSMS(pedido) {
  return simularEnvio('SMS', pedido, 0.15);
}

function enviarPush(pedido) {
  return simularEnvio('push', pedido, 0.1);
}

/**
 * Notifica al cliente por los 3 canales en paralelo.
 * Un canal fallido NO cancela el pedido: se reporta en el informe.
 * @param {object} pedido
 * @returns {Promise<{exitoso: boolean, informe: object[]}>}
 */
function notificarCliente(pedido) {
  const canales = [
    { nombre: 'correo', promesa: enviarCorreo(pedido) },
    { nombre: 'sms', promesa: enviarSMS(pedido) },
    { nombre: 'push', promesa: enviarPush(pedido) },
  ];

  return Promise.allSettled(canales.map((c) => c.promesa)).then((resultados) => {
    const informe = resultados.map((r, i) => ({
      canal: canales[i].nombre,
      estado: r.status,
      detalle: r.status === 'fulfilled' ? r.value : r.reason?.message,
    }));
    const exitoso = informe.some((i) => i.estado === 'fulfilled');
    return { exitoso, informe };
  });
}

module.exports = { enviarCorreo, enviarSMS, enviarPush, notificarCliente };