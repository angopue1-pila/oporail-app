// Estado Global de la Aplicación
var syncId = localStorage.getItem('oporail-sync-id') || 'publico';
var currentProfile = localStorage.getItem('oporail-current-profile');
var currentTest = null;
var timerInterval = null;
var lastResults = [];
var profileColumnAvailable = true;
var progressChart = null;
var categoryChart = null;

var temarioCategories = ['Actividad Comercial', 'Conocimientos Ferroviarios', 'Cultura de la Seguridad', 'Experiencia de Cliente', 'II Plan de Igualdad'];
var allCategories = ['Actividad Comercial', 'Conocimientos Ferroviarios', 'Cultura de la Seguridad', 'Experiencia de Cliente', 'II Plan de Igualdad', 'Numérico', 'Verbal', 'Series de Figuras', 'Atención'];
var categoryDbNames = {
  'Cultura de la Seguridad': 'Cultura de Seguridad'
};

function getDbCategoryName(cat) {
  return categoryDbNames[cat] || cat;
}

function normalizeStr(str) {
  return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function getRecord(mode) {
  if (!currentProfile) return 0;
  return parseInt(localStorage.getItem('oporail-record-' + mode + '-' + currentProfile)) || 0;
}

function updateRecord(mode, score) {
  if (!currentProfile) return false;
  var current = getRecord(mode);
  if (score > current) {
    localStorage.setItem('oporail-record-' + mode + '-' + currentProfile, score);
    return true; // New record
  }
  return false;
}

// Spaced Repetition System (SRS) Logic
function getSrsData() {
  if (!currentProfile) return {};
  var data = localStorage.getItem('oporail-srs-' + currentProfile);
  return data ? JSON.parse(data) : {};
}

function saveSrsData(data) {
  if (!currentProfile) return;
  localStorage.setItem('oporail-srs-' + currentProfile, JSON.stringify(data));
}

function processSrsAnswer(preguntaId, esCorrecta) {
  var srs = getSrsData();
  var item = srs[preguntaId] || { easeFactor: 2.5, interval: 0, repetitions: 0 };
  
  if (esCorrecta) {
    if (item.repetitions === 0) item.interval = 1;
    else if (item.repetitions === 1) item.interval = 6;
    else item.interval = Math.round(item.interval * item.easeFactor);
    item.repetitions++;
    item.easeFactor = item.easeFactor + 0.1;
  } else {
    item.repetitions = 0;
    item.interval = 1;
    item.easeFactor = Math.max(1.3, item.easeFactor - 0.2);
  }
  
  // Set next review date at midnight of the target day
  var nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + item.interval);
  nextDate.setHours(0, 0, 0, 0);
  item.nextReviewDate = nextDate.getTime();
  
  srs[preguntaId] = item;
  saveSrsData(srs);
}
