const fs = require('fs');

// Cuadrícula estándar de GitHub: 52 semanas (columnas) x 7 días (filas)
const COLS = 52;
const ROWS = 7;

// Matriz del corazón (7 filas x 7 columnas) para centrar en la tabla
const heartPattern = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0]
];

function generateSVG() {
  const pixelSize = 11;
  const gap = 3;
  const padding = 16;

  const gridWidth = COLS * (pixelSize + gap) - gap;
  const gridHeight = ROWS * (pixelSize + gap) - gap;
  const width = gridWidth + padding * 2;
  const height = gridHeight + padding * 2;

  // Coordenada inicial para centrar el corazón de 7x7 dentro de las 52 columnas
  const startCol = Math.floor((COLS - 7) / 2);

  let backgroundCells = '';
  let heartCells = '';

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const x = padding + col * (pixelSize + gap);
      const y = padding + row * (pixelSize + gap);

      // Celda de fondo de la tabla de commits (estilo GitHub Dark)
      backgroundCells += `<rect class="cell" x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="#161b22" stroke="#1b1f23" stroke-width="0.5" />\n`;

      // Verificar si esta posición pertenece al corazón
      const heartCol = col - startCol;
      if (heartCol >= 0 && heartCol < 7 && heartPattern[row][heartCol] === 1) {
        heartCells += `<rect class="cell" x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="#39d353" />\n`;
      }
    }
  }

  return `<svg width="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cell {
      rx: 2px;
      ry: 2px;
    }
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      15% { transform: scale(1.12); }
      30% { transform: scale(1); }
      45% { transform: scale(1.08); }
      60% { transform: scale(1); }
    }
    .heart-layer {
      transform-box: fill-box;
      transform-origin: center;
      animation: heartbeat 1.3s infinite ease-in-out;
    }
  </style>

  <!-- Fondo de la cuadrícula de contribuciones -->
  <g>
    ${backgroundCells}
  </g>

  <!-- Capa animada del corazón centrada -->
  <g class="heart-layer">
    ${heartCells}
  </g>
</svg>`;
}

fs.writeFileSync('heart-contribution.svg', generateSVG());
console.log('SVG del corazón sobre tabla de commits generado con éxito.');