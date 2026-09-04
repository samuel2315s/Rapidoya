const { ErrorPago } = require("./errores.js");

function procesarPagoAsync(monto, datosCliente) {
  return new Promise((resolve, reject) => {
    const tiempo = Math.floor(Math.random() * 1501) + 1500;

    setTimeout(() => {
      const resultado = Math.random();

      // 25% de probabilidad de fallo
      if (resultado < 0.25) {
        let causa;

        if (resultado < 0.1) {
          causa = "Fondos insuficientes";
        } else if (resultado < 0.18) {
          causa = "Timeout del banco";
        } else {
          causa = "Tarjeta bloqueada";
        }

        reject(
          new ErrorPago(
            {
              monto,
              cliente: datosCliente.nombre,
            },
            causa,
          ),
        );

        return;
      }

      // Pago exitoso
      const idTransaccion = "TX-" + Math.floor(Math.random() * 1000000);

      resolve({
        idTransaccion,
        monto,
      });
    }, tiempo);
  });
}

function reversarPago(idTransaccion) {
  return new Promise((resolve) => {
    const tiempo = Math.floor(Math.random() * 1001) + 500;

    setTimeout(() => {
      console.log(`Pago reversado: ${idTransaccion}`);
      resolve(true);
    }, tiempo);
  });
}

module.exports = {
  procesarPagoAsync,
  reversarPago,
};
