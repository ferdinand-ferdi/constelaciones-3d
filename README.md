# ConstelArte 3D – Tablero neutro

Base técnica mínima para un tablero 3D neutral orientado a constelaciones familiares sistémicas.

## Requisitos
- Navegador moderno con soporte para ES Modules.
- Conexión a internet para cargar Three.js desde CDN.

## Ejecutar en local
1. Clona este repositorio.
2. Inicia un servidor estático (por ejemplo):
   ```bash
   npx http-server .
   ```
3. Abre `http://localhost:8080` en el navegador.

Para entorno de desarrollo basta con mantener el servidor estático corriendo; cualquier cambio en los archivos de `src/` se refleja al recargar la página.

## Características
- Escena neutra: plano amplio, grid visible, fondo claro sin texturas decorativas.
- Cámara en perspectiva con vista elevada y controles orbit.
- Iluminación suave (hemisférica + direccionales) para uniformidad.
- Código modular: escena, cámara, luces, renderer y controles separados.

## Crear muñecos desde código
Puedes crear muñecos simples (cuerpo cilíndrico + cabeza esférica) directamente en el código usando el módulo `actors.js`.

```js
import { addDoll } from './src/actors.js';
import { createScene } from './src/scene.js';

const scene = createScene();

// Agrega un muñeco azul en el origen
const alice = addDoll(scene, { name: 'Alice', color: 0x4a90e2, position: { x: 0, y: 0, z: 0 } });

// Agrega otro muñeco personalizado en otra posición
const bob = addDoll(scene, { name: 'Bob', color: 0xff8a00, position: { x: 2, y: 0, z: -1 } });

// Si ya tienes una escena creada en `main.js`, puedes importar `addDoll` y añadirlos tras construirla.
```

Cada muñeco guarda en `userData` su `name` y `color` para facilitar la serialización o depuración.

## Controles de interacción
El tablero usa `OrbitControls` para navegar la cámara:

- **Rotar/orbitar**: mantener clic izquierdo y arrastrar.
- **Zoom**: scroll del mouse o gesto de pinch.
- **Pan**: clic derecho o clic central y arrastrar.

Los límites de altura y distancia están configurados para mantener siempre una vista ligeramente elevada del plano.

## Obtener el JSON de estado
El módulo `actors.js` incluye un helper para serializar la posición y metadatos de los muñecos.

```js
import { exportDollsState } from './src/actors.js';

// Suponiendo que tienes referencias a los muñecos creados
const jsonState = JSON.stringify(exportDollsState([alice, bob]), null, 2);
console.log(jsonState);
```

Ejemplo de salida:

```json
[
  {
    "name": "Alice",
    "color": 4867170,
    "position": { "x": 0, "y": 0, "z": 0 }
  },
  {
    "name": "Bob",
    "color": 16750848,
    "position": { "x": 2, "y": 0, "z": -1 }
  }
]
```

## Fuera de alcance en esta base
- La escena inicial no incluye muñecos precolocados (debes crearlos por código).
- Sin UI compleja ni paneles de control.
- Sin texturas decorativas ni elementos artísticos.
