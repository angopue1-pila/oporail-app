var wordGameDefinitions = [
  { word: "DESVÍO", hint: "Aparato de vía que permite el paso de los trenes de una vía a otra." },
  { word: "BALASTO", hint: "Capa de piedra partida que se extiende sobre la plataforma de la vía." },
  { word: "PANTÓGRAFO", hint: "Dispositivo situado en el techo del tren para captar energía de la catenaria." },
  { word: "SURCO", hint: "Capacidad de infraestructura asignada a un tren para un trayecto y tiempo determinados." },
  { word: "CATENARIA", hint: "Línea aérea de contacto que suministra energía eléctrica a los trenes." },
  { word: "BOGIE", hint: "Conjunto de dos o tres ejes que se articula bajo el bastidor de un vehículo ferroviario." },
  { word: "ENCLAVAMIENTO", hint: "Sistema que controla de forma segura el movimiento de trenes en estaciones." },
  { word: "TRACCIÓN", hint: "Fuerza que permite el movimiento del tren mediante motores eléctricos o diésel." },
  { word: "GÁLIBO", hint: "Dimensiones máximas que puede tener un vehículo ferroviario para circular por una vía." },
  { word: "BALIZA", hint: "Dispositivo de vía que transmite información al sistema de frenado automático del tren." },
  { word: "CANTÓN", hint: "Tramo de vía en el que no puede haber simultáneamente más de un tren." },
  { word: "ASFA", hint: "Sistema de Anuncio de Señales y Frenado Automático." },
  { word: "CONSIGNACIÓN", hint: "Documento oficial que contiene normas de seguridad para un tramo o trabajo." },
  { word: "ESTACIÓN", hint: "Instalación ferroviaria apta para realizar la salida, llegada o paso de trenes." },
  { word: "TRAVIESA", hint: "Apoyo transversal sobre el que descansan los carriles." },
  { word: "CARRIL", hint: "Barra de acero laminado que forma el camino de rodadura del tren." },
  { word: "MAQUINISTA", hint: "Persona encargada de la conducción y manejo del tren." },
  { word: "ERTMS", hint: "Sistema Europeo de Gestión del Tráfico Ferroviario." },
  { word: "GSM-R", hint: "Sistema de radio digital específico para comunicación ferroviaria." },
  { word: "BLOQUEO", hint: "Sistema que impide la entrada de un tren en un tramo ocupado por otro." },
  { word: "TÚNEL", hint: "Obra de ingeniería para permitir el paso de la vía bajo tierra." },
  { word: "ANDÉN", hint: "Plataforma elevada en estaciones para facilitar el acceso de viajeros al tren." },
  { word: "AGUJA", hint: "Parte móvil del desvío que determina la dirección del tren." },
  { word: "SUBESTACIÓN", hint: "Instalación que transforma la energía para suministrarla a la catenaria." },
  { word: "BEM", hint: "Bloqueo Eléctrico Manual." },
  { word: "BAU", hint: "Bloqueo Automático en Vía Única." },
  { word: "BAB", hint: "Bloqueo Automático en Vía Doble (Banalizado)." },
  { word: "LZB", hint: "Sistema de control y mando de trenes en líneas de Alta Velocidad." },
  { word: "ANCHO", hint: "Distancia entre las caras internas de los dos carriles de una vía." },
  { word: "UIC", hint: "Unión Internacional de Ferrocarriles (Ancho estándar: 1.435 mm)." },
  { word: "IBÉRICO", hint: "Ancho de vía tradicional en España (1.668 mm)." },
  { word: "MÉTRICO", hint: "Ancho de vía de 1.000 mm usado en líneas de vía estrecha." },
  { word: "ALVIA", hint: "Servicio de Renfe que circula tanto por vías de alta velocidad como convencionales." },
  { word: "AVLO", hint: "Servicio de alta velocidad de bajo coste de Renfe." },
  { word: "TALGO", hint: "Tren Articulado Ligero Goicoechea Oriol, famoso por su ligereza." },
  { word: "LOCOMOTORA", hint: "Vehículo que proporciona la tracción para remolcar el tren." },
  { word: "AUTOMOTOR", hint: "Vehículo ferroviario que dispone de motores propios sin necesidad de locomotora." },
  { word: "CRC", hint: "Centro de Regulación y Control del tráfico ferroviario." },
  { word: "PUESTO", hint: "Lugar desde el cual se ejerce el mando y control de la circulación." },
  { word: "ITINERARIO", hint: "Ruta establecida para el paso de un tren por una estación o tramo." },
  { word: "SEÑAL", hint: "Dispositivo para transmitir órdenes o informaciones a los maquinistas." },
  { word: "MANIOBRA", hint: "Movimientos de vehículos ferroviarios para formar, descomponer o desplazar trenes." },
  { word: "PASO", hint: "Cruce a nivel de una carretera con una línea de ferrocarril." },
  { word: "CRC", hint: "Centro de Regulación y Control del tráfico ferroviario." }
];

var wordGameState = {
  currentWord: "",
  currentHint: "",
  guessedLetters: [],
  points: 0,
  mistakes: 0,
  index: 0
};

function startWordGame() {
  hideAllScreens();
  document.getElementById('word-game').className = '';
  wordGameState.points = 0;
  wordGameState.index = 0;
  wordGameState.mistakes = 0;
  document.getElementById('game-points').textContent = '0';
  updateLivesDisplay();
  wordGameDefinitions = shuffle(wordGameDefinitions);
  loadNextWord();
}

function updateLivesDisplay() {
  var lives = 3 - wordGameState.mistakes;
  var hearts = "";
  for (var i = 0; i < 3; i++) {
    hearts += i < lives ? "❤️" : "🖤";
  }
  document.getElementById('game-lives').textContent = "Vidas: " + hearts;
}

function loadNextWord() {
  var item = wordGameDefinitions[wordGameState.index];
  wordGameState.currentWord = item.word.toUpperCase();
  wordGameState.currentHint = item.hint;
  wordGameState.guessedLetters = [];
  wordGameState.mistakes = 0;
  updateLivesDisplay();
  document.getElementById('game-definition').textContent = wordGameState.currentHint;
  document.getElementById('skip-word').style.display = 'none';
  renderWordDisplay();
  renderKeyboard();
}

function renderWordDisplay() {
  var container = document.getElementById('word-container');
  container.innerHTML = '';
  for (var i = 0; i < wordGameState.currentWord.length; i++) {
    var char = wordGameState.currentWord[i];
    var normChar = normalizeStr(char);
    var div = document.createElement('div');
    div.className = 'letter-box';
    if (char === ' ' || char === '-') {
      div.textContent = char;
      div.style.border = 'none';
      div.style.background = 'none';
    } else if (wordGameState.guessedLetters.indexOf(normChar) !== -1) {
      div.textContent = char;
      div.classList.add('correct');
    }
    container.appendChild(div);
  }
}

function renderKeyboard() {
  var container = document.getElementById('game-keyboard');
  container.innerHTML = '';
  var rows = ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"];
  rows.forEach(function(row) {
    var rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.justifyContent = 'center';
    rowDiv.style.gap = '4px';
    rowDiv.style.width = '100%';
    rowDiv.style.marginBottom = '6px';
    row.split("").forEach(function(letter) {
      var btn = document.createElement('button');
      btn.className = 'key';
      btn.textContent = letter;
      btn.style.width = 'auto';
      btn.style.flex = '1';
      btn.style.padding = '10px 4px';
      btn.style.fontSize = '14px';
      if (wordGameState.guessedLetters.indexOf(letter) !== -1) btn.classList.add('used');
      btn.onclick = function() { guessLetter(letter); };
      rowDiv.appendChild(btn);
    });
    container.appendChild(rowDiv);
  });
}

function guessLetter(letter) {
  var normalizedInput = normalizeStr(letter);
  if (wordGameState.guessedLetters.indexOf(normalizedInput) !== -1) return;
  wordGameState.guessedLetters.push(normalizedInput);
  var normalizedWord = normalizeStr(wordGameState.currentWord);
  if (normalizedWord.indexOf(normalizedInput) === -1) {
    wordGameState.mistakes++;
    updateLivesDisplay();
    var keys = document.querySelectorAll('.key');
    keys.forEach(function(k) {
      if (normalizeStr(k.textContent) === normalizedInput) {
        k.style.background = 'var(--danger)';
        k.style.color = 'white';
        setTimeout(function() { k.style.background = ''; k.style.color = ''; }, 500);
      }
    });
    if (wordGameState.mistakes >= 3) {
      setTimeout(function() {
        alert('💥 ¡HAS PERDIDO! La palabra era: ' + wordGameState.currentWord);
        backHome();
      }, 300);
      return;
    }
  }
  renderWordDisplay();
  renderKeyboard();
  checkWin();
}

function checkWin() {
  var normalizedWord = normalizeStr(wordGameState.currentWord);
  var won = true;
  for (var i = 0; i < normalizedWord.length; i++) {
    var char = normalizedWord[i];
    if (char !== ' ' && char !== '-' && wordGameState.guessedLetters.indexOf(char) === -1) {
      won = false;
      break;
    }
  }
  if (won) {
    wordGameState.points += 10;
    document.getElementById('game-points').textContent = wordGameState.points;
    var skipBtn = document.getElementById('skip-word');
    skipBtn.style.display = 'block';
    skipBtn.textContent = '¡Correcto! Siguiente';
    skipBtn.style.background = 'var(--success)';
    var boxes = document.querySelectorAll('.letter-box');
    boxes.forEach(function(b) { b.classList.add('correct'); });
    setTimeout(nextWord, 1500);
  }
}

function nextWord() {
  wordGameState.index++;
  if (wordGameState.index >= wordGameDefinitions.length) {
    alert('¡Felicidades! Has completado todas las palabras. Puntos totales: ' + wordGameState.points);
    backHome();
  } else {
    loadNextWord();
  }
}
