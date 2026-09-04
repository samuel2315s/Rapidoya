const { ErrorRepartidor } = require('./errores.js');

function asignarRepartidorAsync(zonaEntrega) {
    return new Promise((resolve, reject) => {

        // Tiempo aleatorio entre 1000 y 2500 ms
        const tiempo = Math.floor(Math.random() * 1501) + 1000;

        console.log(`Buscando repartidor para la zona: ${zonaEntrega}...`);

        setTimeout(() => {

            // 10% de probabilidad de fallo
            const fallo = Math.random() < 0.10;

            if (fallo) {
                reject(
                    new ErrorRepartidor(
                        { zona: zonaEntrega },
                        'No hay repartidores disponibles'
                    )
                );
                return;
            }

            // Repartidores disponibles
            const repartidores = [
                'Carlos',
                'Andrés',
                'Juan',
                'Miguel',
                'David'
            ];

            // Seleccionar un repartidor aleatoriamente
            const nombre =
                repartidores[
                    Math.floor(Math.random() * repartidores.length)
                ];

            console.log(`Repartidor asignado: ${nombre}`);

            resolve({
                nombre,
                zona: zonaEntrega
            });

        }, tiempo);
    });
}

module.exports = {
    asignarRepartidorAsync
};