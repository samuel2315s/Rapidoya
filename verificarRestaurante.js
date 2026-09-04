const { ErrorRestaurante } = require('./Errores.js');

function verificarRestaurante(nombreRestaurante, alTerminar) {
  const retardo = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

  setTimeout(() => {
    const esError = Math.random() < 0.20; 

    if (esError) {
      alTerminar(new Error(`El restaurante ${nombreRestaurante} está cerrado o fuera de cobertura`));
    } else {
      const infoRestaurante = {
        nombre: nombreRestaurante,
        tiempoPreparacion: Math.floor(Math.random() * 20) + 15, 
        abierto: true
      };
      alTerminar(null, infoRestaurante);
    }
  }, retardo);
}


function verificarRestauranteAsync(nombreRestaurante) {
  return new Promise((resolve, reject) => {
    verificarRestaurante(nombreRestaurante, (error, info) => {
      if (error) {
        reject(new ErrorRestaurante({ nombreRestaurante }, error.message));
      } else {
        resolve(info); 
      }
    });
  });
}

module.exports = {
  verificarRestaurante,
  verificarRestauranteAsync
};