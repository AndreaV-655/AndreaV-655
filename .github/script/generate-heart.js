const fs = require('fs');

// Definimos una cuadrícula de 7 filas por 7 columnas para representar un corazón pixelado.
// 1 = celda llena (con color de contribución), 0 = celda vacía.
const heartSmall = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0]
];

const heartLarge = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0]
];

// Función para generar un SVG estético adaptado al estilo de los commits de GitHub
function generateSVG() {
  const width = 800;
  const height = 150;
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cell {
      shape-rendering: crispEdges;
      rx: 2px;
      ry: 2px;
    }
    @keyframes heartbeat {
      0% { transform: scale(1); transform-origin: center; }
      15% { transform: scale(1.15); transform-origin: center; }
      30% { transform: scale(1); transform-origin: center; }
      45% { transform: scale(1.1); transform-origin: center; }
      60% { transform: scale(1); transform-origin: center; }
      100% { transform: scale(1); transform-origin: center; }
    }
    .heart-group {
      animation: heartbeat 1.2s infinite ease-in-out;
    }
  </style>

  <!-- Fondo transparente u oscuro según prefieras -->
  <rect width="100%" height="100%" fill="transparent" />

  <g class="heart-group" transform="translate(350, 40)">
    <!-- Aquí puedes renderizar los bloques simulando los cuadrados de GitHub -->
    ${renderPixels()}
  </g>
</svg>`;
}

function renderPixels() {
  let svgContent = '';
  const pixelSize = 12;
  const gap = 3;

  heartSmall.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) {
        const x = colIndex * (pixelSize + gap);
        const y = rowIndex * (pixelSize + gap);
        // Color verde clásico de contribución de GitHub (puedes cambiarlo a rosa/rojo si prefieres)
        const color = '#39d353'; 
        svgContent += `<rect class="cell" x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />\n`;
      }
    });
  });

  return svgContent;
}

// Guardar el archivo SVG generado en la raíz del proyecto
fs.writeFileSync('heart-contribution.svg', generateSVG());
console.log('SVG del corazón generado con éxito.');