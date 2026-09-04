# 🛵 RápidoYa

### Orquestación asíncrona de pedidos con Promises puras en Node.js

RápidoYa es un backend de simulación que modela el flujo completo de un pedido
de domicilios: verificación de restaurante, validación de inventario,
procesamiento de pago, asignación de repartidor y notificación al cliente.
Todo el sistema está construido sobre `Promise`, sin callbacks propios (con
una única excepción intencional: un módulo heredado que se adapta a Promise
sin modificarlo), y con manejo explícito de errores y compensación
transaccional (reversa de pago si falla la entrega).

---

## 📋 Descripción

El proyecto está dividido en 5 módulos independientes, cada uno responsable de
una etapa del pedido. `index.js` actúa como orquestador: llama a cada etapa en
orden, mide tiempos, maneja fallos y arma un resumen final para el cliente.

Reglas de diseño del proyecto:

- Todas las funciones (salvo el módulo heredado) devuelven una `Promise`: se
  resuelven con los datos en caso de éxito y se rechazan con una instancia de
  una clase de error específica.
- El inventario se valida en paralelo con `Promise.all()` — un solo producto
  agotado cancela el pedido de inmediato.
- Las notificaciones usan `Promise.allSettled()` — un canal fallido no cancela
  el pedido.
- Si el pago se confirma pero no hay repartidor disponible, el pago se
  reversa automáticamente (compensación).

---

## 🚀 Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| **Node.js** | Entorno de ejecución del backend |
| **JavaScript (ES2017+)** | Lenguaje principal (async/await, clases, destructuring) |
| **Promises nativas de JS** | `Promise`, `Promise.all()`, `Promise.allSettled()` — sin librerías externas |
| **CommonJS (`require`/`module.exports`)** | Sistema de módulos entre los 5 archivos |
| **npm** | Gestión del proyecto (`package.json`, scripts) |
| **Git** | Control de versiones y colaboración entre el equipo |

No se usan dependencias externas: todo el manejo asíncrono es JavaScript puro.

---

## 📁 Estructura del proyecto

```
proyecto-rapidoya/
├── package.json
├── LICENSE
├── .gitignore
├── README.md
├── errores.js                  # Clases de error, registrarError, mensajeParaCliente
├── persona1-restaurante.js     # Verificación de restaurante
├── persona2-inventario.js      # Validación de inventario
├── persona3-pago.js            # Procesamiento y reversa de pago
├── persona4-repartidor.js      # Asignación de repartidor
├── persona5-notificaciones.js  # Notificaciones al cliente (correo, SMS, push)
└── index.js                    # procesarPedido(pedido) + pruebas
```

---

## ⚙️ Instalación

```bash
git clone <url-del-repositorio>
cd proyecto-rapidoya
npm install
```

## ▶️ Uso

```bash
npm start
```

Esto corre `index.js`, que procesa 5 pedidos de ejemplo y muestra en consola
el resultado de cada etapa, la duración total y el mensaje final para el
cliente.

---

## 🧩 Contrato de integración

Cada módulo expone únicamente las funciones definidas en la guía de
integración del proyecto, con el mismo nombre de archivo, nombre de función y
forma de datos de éxito/rechazo. Ningún colaborador edita el archivo de otro;
si algo falla, se reporta y lo corrige el dueño del módulo correspondiente.

| Función | Responsable |
|---|---|
| `verificarRestauranteAsync(nombre)` | Persona 1 |
| `validarInventario(productos)` | Persona 2 |
| `procesarPagoAsync(monto, cliente)` / `reversarPago(id)` | Persona 3 |
| `asignarRepartidorAsync(zona)` | Persona 4 |
| `notificarCliente(pedido)` / `procesarPedido(pedido)` | Persona 5 |

---

## 👥 Autores

- **Samuel Vanegas**
- **Cesar Candela**
- **Jonathan Valcalcer**
- **Yoiner**
- **Miguel Monsalve**

---

