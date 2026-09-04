const { ErrorInventario } = require('./errores.js');

function consultarProducto(nombre, cantidad) {
    return new Promise((resolve, reject) => {

        // Cada producto tiene su propio tiempo de consulta.
        // Al ser independiente, no debemos esperar a otro producto.
        const retardo = Math.floor(Math.random() * 1001) + 500;

        setTimeout(() => {

            // 15% de probabilidad de que el producto esté agotado.
            const agotado = Math.random() < 0.15;

            if (agotado) {
                reject(
                    new ErrorInventario(
                        { nombre, cantidad },
                        'Producto agotado'
                    )
                );
                return;
            }

            resolve({
                nombre,
                cantidad,
                disponible: true
            });

        }, retardo);
    });
}


function validarInventario(productos) {

    // Todas las consultas se inician en paralelo.
    // Promise.all() hace que el pedido falle si un solo producto
    // no está disponible.
    return Promise.all(
        productos.map(producto =>
            consultarProducto(producto.nombre, producto.cantidad)
        )
    );
}


module.exports = {
    consultarProducto,
    validarInventario
};