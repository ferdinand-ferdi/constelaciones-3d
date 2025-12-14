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

## Características
- Escena neutra: plano amplio, grid visible, fondo claro sin texturas decorativas.
- Cámara en perspectiva con vista elevada y controles orbit.
- Iluminación suave (hemisférica + direccionales) para uniformidad.
- Código modular: escena, cámara, luces, renderer y controles separados.

## Fuera de alcance en esta base
- Sin muñecos ni figuras representativas.
- Sin UI compleja ni paneles de control.
- Sin texturas decorativas ni elementos artísticos.
