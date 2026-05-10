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
