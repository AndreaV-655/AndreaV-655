const fs = require('fs');

// Cuadrícula estándar de GitHub: 52 semanas (columnas) x 7 días (filas)
const COLS = 52;
const ROWS = 7;

// Matriz del corazón ampliada (+2 columnas de ancho: 7 filas x 9 columnas)
const heartPattern = [
  [0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0]
];

function generateSVG() {
  const pixelSize = 11;
  const gap = 3;
  const padding = 16;

  const gridWidth = COLS * (pixelSize + gap) - gap;
  const gridHeight = ROWS * (pixelSize + gap) - gap;
  const width = gridWidth + padding * 2;
  const height = gridHeight + padding * 2;

  const heartCols = heartPattern[0].length;
  const startCol = Math.floor((COLS - heartCols) / 2);

  // Centro exacto de la cuadrícula para calcular la onda expansiva
  const centerCol = (COLS - 1) / 2;
  const centerRow = (ROWS - 1) / 2;

  let backgroundCells = '';
  let rippleCells = '';
  let heartCells = '';

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const x = padding + col * (pixelSize + gap);
      const y = padding + row * (pixelSize + gap);

      // 1. Celda base oscura de la tabla de commits
      backgroundCells += `<rect class="cell" x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="#161b22" stroke="#1b1f23" stroke-width="0.5" />\n`;

      // Verificar si la celda pertenece al corazón
      const heartCol = col - startCol;
      const isHeart = heartCol >= 0 && heartCol < heartCols && heartPattern[row][heartCol] === 1;

      if (isHeart) {
        // 3. Celda del corazón
        heartCells += `<rect class="cell" x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="#39d353" />\n`;
      } else {
        // 2. Celda de la onda expansiva (para todo el resto de la cuadrícula)
        const dist = Math.hypot(col - centerCol, row - centerRow);
        // Retraso proporcional a la distancia para que viaje hacia los extremos
        const delay = (dist * 0.028).toFixed(3);
        rippleCells += `<rect class="cell ripple-cell" style="animation-delay: ${delay}s;" x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" />\n`;
      }
    }
  }

  return `<svg width="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cell {
      rx: 2px;
      ry: 2px;
    }

    /* Animación del latido del corazón (ciclo de 1.8s) */
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      12% { transform: scale(1.14); }
      24% { transform: scale(1); }
      36% { transform: scale(1.08); }
      48% { transform: scale(1); }
    }

    /* Onda de energía verde suave/translúcida sincronizada con el latido */
    @keyframes rippleWave {
      0%, 10% {
        fill: #39d353;
        fill-opacity: 0;
      }
      22% {
        fill: #39d353;
        fill-opacity: 0.35;
      }
      45%, 100% {
        fill: #39d353;
        fill-opacity: 0;
      }
    }

    .heart-layer {
      transform-box: fill-box;
      transform-origin: center;
      animation: heartbeat 1.8s infinite ease-in-out;
    }

    .ripple-cell {
      fill: #39d353;
      fill-opacity: 0;
      animation: rippleWave 1.8s infinite ease-out;
    }
  </style>

  <!-- Capa 1: Fondo de la cuadrícula de contribuciones -->
  <g>
    ${backgroundCells}
  </g>

  <!-- Capa 2: Onda expansiva hacia los extremos -->
  <g>
    ${rippleCells}
  </g>

  <!-- Capa 3: Corazón ampliado centrado -->
  <g class="heart-layer">
    ${heartCells}
  </g>
</svg>`;
}

fs.writeFileSync('heart-contribution.svg', generateSVG());
console.log('SVG del corazón ampliado con onda expansiva generado con éxito.');