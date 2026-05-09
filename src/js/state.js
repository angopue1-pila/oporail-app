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
