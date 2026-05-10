// Core Initialization - Supabase & Global State
var supabaseUrl = 'https://kxhtiqaupfodbxskcjox.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aHRpcWF1cGZvZGJ4c2tjam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjYwMzUsImV4cCI6MjA5MzU0MjAzNX0.Frwfdt6weBnyltD9G3y6wID5c9n6r1t6gTALsGTdbUA';

var client = supabase.createClient(supabaseUrl, supabaseKey);

// Global State
var syncId = localStorage.getItem('oporail-sync-id') || 'publico';
var currentProfile = localStorage.getItem('oporail-current-profile');
var currentTest = null;
var timerInterval = null;
var lastResults = [];
var profileColumnAvailable = true;
var syncColumnAvailable = true;
var progressChart = null;
var categoryChart = null;

var temarioCategories = ['Actividad Comercial', 'Conocimientos Ferroviarios', 'Cultura de la Seguridad', 'Experiencia de Cliente', 'II Plan de Igualdad'];
var allCategories = ['Actividad Comercial', 'Conocimientos Ferroviarios', 'Cultura de la Seguridad', 'Experiencia de Cliente', 'II Plan de Igualdad', 'Numérico', 'Verbal', 'Series de Figuras', 'Atención'];

function getDbCategoryName(cat) {
  var categoryDbNames = { 'Cultura de la Seguridad': 'Cultura de Seguridad' };
  return categoryDbNames[cat] || cat;
}

function normalizeStr(str) {
  return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}
