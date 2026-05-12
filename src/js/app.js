// App Manager - Interfaz y Navegación


function hideAllScreens() {
  document.getElementById('profile-screen').className = 'hidden';
  document.getElementById('app').className = 'hidden';
  document.getElementById('test').className = 'hidden';
  document.getElementById('results').className = 'hidden';
  document.getElementById('test-details').className = 'hidden';
  document.getElementById('history-screen').className = 'hidden';
  document.getElementById('search-screen').className = 'hidden';
  document.getElementById('loading').className = 'hidden';
  document.getElementById('word-game').className = 'hidden';
  var gameOverDiv = document.getElementById('game-over');
  if (gameOverDiv) gameOverDiv.className = 'hidden';
  var victoryDiv = document.getElementById('victory');
  if (victoryDiv) victoryDiv.className = 'hidden';
}

function setLoading(message) {
  if (timerInterval) clearInterval(timerInterval);
  hideAllScreens();
  document.getElementById('loading-text').textContent = message || 'Cargando...';
  document.getElementById('loading').className = '';
}

function shuffle(items) {
  var i, j, temp;
  for (i = items.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }
  return items;
}

function getQuestionText(q) {
  return q.enunciado || q.pregunta || 'Pregunta sin enunciado';
}

function formatDuration(seconds) {
  seconds = Math.max(0, Math.floor(seconds || 0));
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  if (m <= 0) return s + ' s';
  if (s === 0) return m + ' min';
  return m + ' min ' + s + ' s';
}

function startLoadedTest(cat, questions, seconds, options) {
  currentTest = {
    questions: shuffle(questions).slice(0, questions.length),
    index: 0,
    score: 0,
    blanks: 0,
    mistakes: 0,
    cat: cat,
    time: seconds,
    duration: seconds,
    survival: options && options.survival,
    penalty: options && options.penalty,
    invisibleTimer: options && options.invisibleTimer,
    fiveMinWarningShown: false,
    answers: []
  };
  showTest();
  if (currentTest.survival) {
    document.getElementById('btn-blank-answer').style.display = 'none';
    startSurvivalTimer();
  } else {
    document.getElementById('btn-blank-answer').style.display = 'block';
    startTimer();
  }
}

function applyTheme(theme) {
  var isDark = theme === 'dark';
  document.body.className = isDark ? 'dark' : '';
  var toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  var profileToggle = document.getElementById('theme-toggle-profile');
  if (profileToggle) profileToggle.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
}

function toggleTheme() {
  var nextTheme = document.body.className === 'dark' ? 'light' : 'dark';
  localStorage.setItem('oporail-theme', nextTheme);
  applyTheme(nextTheme);
}

function init() {
  applyTheme(localStorage.getItem('oporail-theme') || 'light');
  currentProfile = localStorage.getItem('oporail-current-profile');
  loadQuestionCounts();
  if (currentProfile) showAppForProfile();
  else showProfileScreen();
}

function showProfileScreen() {
  if (timerInterval) clearInterval(timerInterval);
  hideAllScreens();
  document.getElementById('sync-id-input').value = syncId === 'publico' ? '' : syncId;
  updateSyncStatus();
  renderProfileList();
  var backBtn = document.getElementById('back-to-app');
  if (backBtn) backBtn.style.display = currentProfile ? 'block' : 'none';
  document.getElementById('profile-screen').className = '';
}

function updateSyncStatus() {
  var status = document.getElementById('sync-status');
  if (syncId === 'publico') {
    status.innerHTML = '⚠️ Modo local (no se sincroniza)';
    status.style.color = 'var(--muted)';
  } else {
    status.innerHTML = '✅ Sincronizado con el código: <strong>' + syncId + '</strong>';
    status.style.color = 'var(--success)';
  }
}

function setSyncId() {
  var val = (document.getElementById('sync-id-input').value || '').trim();
  if (!val) {
    if (!confirm('¿Quieres desactivar la sincronización y volver al modo local?')) return;
    syncId = 'publico';
  } else {
    syncId = val;
  }
  localStorage.setItem('oporail-sync-id', syncId);
  updateSyncStatus();
  renderProfileList();
}

async function renderProfileList() {
  var list = document.getElementById('profile-list');
  list.innerHTML = '<p class="muted">Cargando perfiles...</p>';
  var profiles = [];
  if (syncId === 'publico') {
    profiles = JSON.parse(localStorage.getItem('oporail-profiles') || '[]');
  } else {
    try {
      const { data, error } = await client.from('perfiles_cloud').select('nombre').eq('sync_id', syncId);
      if (error) throw error;
      profiles = data.map(function(p) { return p.nombre; });
    } catch (e) {
      console.error('Error cargando perfiles nube:', e);
      list.innerHTML = '<p class="muted" style="color: var(--danger);">Error al conectar con la nube.</p>';
      return;
    }
  }
  if (profiles.length === 0) {
    list.innerHTML = '<p class="muted">No hay perfiles con este código. Crea uno nuevo abajo para empezar.</p>';
    return;
  }
  profiles.sort();
  var html = '';
  profiles.forEach(function(profile) {
    var escaped = profile.replace(/'/g, "\\'");
    html += '<button class="profile-choice" onclick="selectProfile(\'' + encodeURIComponent(escaped) + '\')">' + profile + '</button>';
  });
  list.innerHTML = html;
}

async function createProfile() {
  var input = document.getElementById('new-profile-name');
  var name = (input.value || '').trim();
  if (!name) return alert('Escribe un nombre.');
  if (syncId === 'publico') {
    var profiles = JSON.parse(localStorage.getItem('oporail-profiles') || '[]');
    if (profiles.indexOf(name) === -1) {
      profiles.push(name);
      localStorage.setItem('oporail-profiles', JSON.stringify(profiles));
    }
  } else {
    try {
      setLoading('Creando perfil...');
      const { error } = await client.from('perfiles_cloud').insert({ nombre: name, sync_id: syncId });
      if (error && error.code !== '23505') throw error;
    } catch (e) {
      alert('Error: ' + e.message);
      backHome();
      return;
    }
  }
  input.value = '';
  selectProfile(encodeURIComponent(name));
}

function selectProfile(encodedName) {
  currentProfile = decodeURIComponent(encodedName);
  localStorage.setItem('oporail-current-profile', currentProfile);
  showAppForProfile();
}

function showAppForProfile() {
  hideAllScreens();
  document.getElementById('current-profile-label').textContent = currentProfile || 'Sin perfil';
  document.getElementById('app').className = '';
  loadStats();
  updateRecordsUI();
  loadDailyChallenges();
}

function updateRecordsUI() {
  var survivalRec = getRecord('survival');
  var wordsRec = getRecord('words');
  
  var survivalEl = document.getElementById('record-survival');
  if (survivalEl) survivalEl.textContent = survivalRec;
  
  var wordsEl = document.getElementById('record-words');
  if (wordsEl) wordsEl.textContent = wordsRec;
  
  var gameWordsRecEl = document.getElementById('game-record-words');
  if (gameWordsRecEl) gameWordsRecEl.textContent = wordsRec;
}

function renameCurrentProfile() {
  if (!currentProfile) return;
  var nextName = prompt('Nuevo nombre:', currentProfile);
  if (!nextName || !nextName.trim()) return;
  nextName = nextName.trim();
  // Logic here could be improved for cloud, but keeping it simple for now as per original
  currentProfile = nextName;
  localStorage.setItem('oporail-current-profile', currentProfile);
  showAppForProfile();
}

function handleProfileColumnError(err) {
  if (!err || !err.message) return false;
  var msg = err.message.toLowerCase();
  if (msg.indexOf('perfil') !== -1) {
    profileColumnAvailable = false;
    return true;
  }
  if (msg.indexOf('sync_id') !== -1) {
    syncColumnAvailable = false;
    return true;
  }
  return false;
}

function renderQuestionCounts(counts) {
  var total = 0;
  var largestName = '';
  var largestCount = 0;
  allCategories.forEach(function(cat) {
    var count = counts[cat];
    var badge = document.querySelector('[data-category-count="' + cat + '"]');
    if (badge) badge.textContent = count === null ? 'Sin datos' : count + ' preg.';
    if (typeof count === 'number') {
      total += count;
      if (count > largestCount) {
        largestCount = count;
        largestName = cat;
      }
    }
  });
  document.getElementById('total-question-count').textContent = total || 'Sin datos';
  document.getElementById('largest-category-count').textContent = largestName ? largestName + ' · ' + largestCount : 'Sin datos';
}

async function startTest(cat, num, mins) {
  setLoading('Cargando preguntas...');
  try {
    let correctIds = [];
    const resStats = await resultsQuery().limit(1000);
    if (resStats.data) {
      resStats.data.forEach(r => {
        if (r.detalles) {
          r.detalles.forEach(d => {
            if (d.es_correcta && d.pregunta_id) correctIds.push(d.pregunta_id);
          });
        }
      });
    }
    const resPreguntas = await client.from('preguntas').select('*').eq('categoria', getDbCategoryName(cat)).limit(200);
    if (resPreguntas.error || !resPreguntas.data || resPreguntas.data.length === 0) {
      backHome();
      alert('No hay preguntas.');
      return;
    }
    let filtered = resPreguntas.data.filter(q => correctIds.indexOf(q.id) === -1);
    if (filtered.length < num) filtered = resPreguntas.data;
    startLoadedTest(cat, filtered.slice(0, num), mins * 60, { penalty: false });
  } catch (err) {
    backHome();
    alert('Error cargando preguntas');
  }
}

function startCustomTest() {
  var numQ = parseInt(document.getElementById('custom-num-q').value) || 20;
  var cat = document.getElementById('custom-cat').value;
  var penalty = document.getElementById('custom-penalty').checked;
  var mins = numQ === 10 ? 10 : (numQ === 20 ? 15 : (numQ === 50 ? 30 : 60));
  
  setLoading('Cargando examen personalizado...');
  
  var query = client.from('preguntas').select('*').limit(500);
  if (cat !== 'Todas') {
    query = query.eq('categoria', getDbCategoryName(cat));
  }
  
  query.then(function(res) {
    if (res.error || !res.data || res.data.length === 0) {
      backHome(); alert('No hay suficientes preguntas para esta categoría.'); return;
    }
    var questions = shuffle(res.data).slice(0, numQ);
    startLoadedTest(cat === 'Todas' ? 'Examen Personalizado' : cat + ' (Personalizado)', questions, mins * 60, { penalty: penalty });
  });
}

function startSimulacro() {
  setLoading('Mezclando preguntas aleatorias...');
  var categories = temarioCategories;
  var allQuestions = [];
  var completed = 0;
  categories.forEach(function(cat) {
    client.from('preguntas').select('*').eq('categoria', getDbCategoryName(cat)).limit(100).then(function(res) {
      if (res.data) allQuestions = allQuestions.concat(res.data);
      completed++;
      if (completed === categories.length) {
        if (allQuestions.length === 0) {
          backHome();
          alert('No hay preguntas.');
          return;
        }
        startLoadedTest('Simulacro', shuffle(allQuestions).slice(0, 60), 30 * 60, { penalty: true });
      }
    }).catch(function() {
      completed++;
      if (completed === categories.length && allQuestions.length > 0) {
        startLoadedTest('Simulacro', shuffle(allQuestions).slice(0, 60), 30 * 60, { penalty: true });
      }
    });
  });
}

function startSimulacroPsicotecnico() {
  setLoading('Mezclando preguntas de psicotécnicos...');
  var psicoCategories = ['Numérico', 'Verbal', 'Series de Figuras', 'Atención'];
  var allQuestions = [];
  var completed = 0;
  psicoCategories.forEach(function(cat) {
    client.from('preguntas').select('*').eq('categoria', getDbCategoryName(cat)).limit(200).then(function(res) {
      if (res.data) allQuestions = allQuestions.concat(res.data);
      completed++;
      if (completed === psicoCategories.length) {
        if (allQuestions.length === 0) {
          backHome();
          alert('No hay preguntas de psicotécnicos.');
          return;
        }
        startLoadedTest('Simulacro Psicotécnico', shuffle(allQuestions).slice(0, 60), 20 * 60, { penalty: true, invisibleTimer: true });
      }
    }).catch(function() {
      completed++;
      if (completed === psicoCategories.length && allQuestions.length > 0) {
        startLoadedTest('Simulacro Psicotécnico', shuffle(allQuestions).slice(0, 60), 20 * 60, { penalty: true, invisibleTimer: true });
      }
    });
  });
}

function showTest() {
  hideAllScreens();
  document.getElementById('test').className = '';
  var q = currentTest.questions[currentTest.index];
  document.getElementById('test-title').textContent = currentTest.cat;
  document.getElementById('counter').textContent = 'Pregunta ' + (currentTest.index + 1) + ' de ' + currentTest.questions.length;
  
  var meta = document.getElementById('question-meta');
  meta.innerHTML = '';
  if (q.failCount && q.failCount >= 2) {
    meta.innerHTML = '<span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 800;">⚠️ Pregunta Crítica (' + Math.floor(q.failCount) + ' fallos)</span>';
  }
  if (q.srsInfo) {
    meta.innerHTML += '<span style="background: rgba(16, 185, 129, 0.1); color: #059669; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; margin-left: 8px;">🔄 ' + q.srsInfo + '</span>';
  }
  
  var qHtml = getQuestionText(q);
  if (q.imagen) {
    qHtml += '<div style="margin-top: 15px; text-align: center;"><img src="' + q.imagen + '" style="max-width: 100%; border-radius: 8px; border: 1px solid var(--border);"></div>';
  }
  document.getElementById('question').innerHTML = qHtml;
  
  var container = document.getElementById('options');
  container.innerHTML = '';
  ['A', 'B', 'C', 'D'].forEach(function(letra) {
    var btn = document.createElement('button');
    btn.className = 'option';
    
    var optionText = q['opcion_' + letra.toLowerCase()];
    var optionImg = q['opcion_' + letra.toLowerCase() + '_img'];
    
    var optHtml = '<strong>' + letra + ')</strong> ' + optionText;
    if (optionImg) {
      optHtml += '<div style="margin-top: 10px;"><img src="' + optionImg + '" style="max-width: 100px; border-radius: 4px;"></div>';
    }
    
    btn.innerHTML = optHtml;
    btn.onclick = function() { answer(letra); };
    container.appendChild(btn);
  });
  updateTimer();
}

function updateTimer() {
  if (currentTest.invisibleTimer) {
    document.getElementById('timer').textContent = 'Oculto';
    return;
  }
  var m = Math.floor(currentTest.time / 60);
  var s = currentTest.time % 60;
  document.getElementById('timer').textContent = m + ':' + (s < 10 ? '0' + s : s);
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    currentTest.time--;
    updateTimer();
    
    if (currentTest.invisibleTimer && currentTest.time === 5 * 60 && !currentTest.fiveMinWarningShown) {
      currentTest.fiveMinWarningShown = true;
      alert("¡Atención! Faltan 5 minutos para terminar el examen.");
    }

    if (currentTest.time <= 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}

function answer(letra) {
  var q = currentTest.questions[currentTest.index];
  var correcta = q.respuesta_correcta;
  var isBlank = letra === 'BLANK';
  var esCorrecta = isBlank ? false : letra === correcta;
  var startQTime = currentTest.lastQTime || currentTest.duration;
  var timeTaken = startQTime - currentTest.time;
  currentTest.lastQTime = currentTest.time;
  
  if (q.id) processSrsAnswer(q.id, esCorrecta);

  currentTest.answers.push({
    pregunta_id: q.id,
    respuesta_usuario: isBlank ? 'N/A' : letra,
    respuesta_correcta: correcta,
    es_correcta: esCorrecta,
    es_blanca: isBlank,
    tiempo_segundos: timeTaken,
    pregunta: getQuestionText(q),
    categoria: q.categoria || currentTest.cat,
    explicacion: q.explicacion,
    opciones: [q.opcion_a, q.opcion_b, q.opcion_c, q.opcion_d]
  });
  
  if (currentTest.survival) {
    var btns = document.querySelectorAll('.option');
    btns.forEach(function(b) {
      b.disabled = true;
      if (b.textContent[0] === correcta) {
        b.style.borderColor = '#16a34a'; 
        b.style.background = '#f0fdf4';
        b.style.color = '#166534';
      } else if (b.textContent[0] === letra && !esCorrecta) {
        b.style.borderColor = '#ef4444'; 
        b.style.background = '#fef2f2';
        b.style.color = '#991b1b';
      }
    });

    if (!esCorrecta) {
      setTimeout(function() {
        gameOver('❌ Respuesta incorrecta. ¡Sigue entrenando!');
      }, 2000);
      return;
    }
    
    currentTest.score++;
    setTimeout(function() {
      if (currentTest.index < currentTest.questions.length - 1) {
        currentTest.index++; currentTest.time = 30; currentTest.lastQTime = 30; showTest(); startSurvivalTimer();
      } else {
        clearInterval(timerInterval); finishSurvivalVictory();
      }
    }, 1000);
  } else {
    if (esCorrecta) currentTest.score++;
    else if (isBlank) currentTest.blanks++;
    else currentTest.mistakes++;

    var btns = document.querySelectorAll('.option');
    btns.forEach(function(b) {
      b.disabled = true;
      if (b.textContent[0] === correcta) {
        b.style.borderColor = '#16a34a'; 
        b.style.background = '#f0fdf4';
        b.style.color = '#166534';
      } else if (b.textContent[0] === letra && !esCorrecta && !isBlank) {
        b.style.borderColor = '#ef4444'; 
        b.style.background = '#fef2f2';
        b.style.color = '#991b1b';
      } else b.style.opacity = '0.5';
    });
    
    var blankBtn = document.getElementById('btn-blank-answer');
    if (blankBtn) {
      blankBtn.disabled = true;
      if (isBlank) blankBtn.style.background = '#fef08a';
    }

    setTimeout(function() {
      if (blankBtn) { blankBtn.disabled = false; blankBtn.style.background = 'var(--surface-soft)'; }
      if (currentTest.index < currentTest.questions.length - 1) {
        currentTest.index++; showTest();
      } else finishTest();
    }, 2000);
  }
}

function finishTest() {
  clearInterval(timerInterval);
  var elapsedSeconds = Math.max(0, (currentTest.duration || 0) - currentTest.time);
  client.from('resultados').insert(resultPayload({
    tipo_test: currentTest.cat,
    puntuacion: currentTest.score,
    total_preguntas: currentTest.questions.length,
    tiempo_usado: elapsedSeconds + ' seconds',
    fecha: new Date().toISOString(),
    detalles: currentTest.answers
  })).then(function(res) {
    if (res.error) {
      console.error('Error guardando resultado:', res.error);
      alert('Error al guardar el examen: ' + res.error.message);
      handleProfileColumnError(res.error);
    }
    loadStats();
  });
  
  hideAllScreens();
  document.getElementById('results').className = '';
  
  updateChallengesProgress(currentTest);
  
  var scorePoints = currentTest.score;
  if (currentTest.penalty) {
    scorePoints = currentTest.score - (currentTest.mistakes * 0.33);
    if (scorePoints < 0) scorePoints = 0;
  }
  
  var nota = ((scorePoints / currentTest.questions.length) * 10).toFixed(2);
  var notaNum = parseFloat(nota);
  if (notaNum >= 5) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#16a34a', '#f59e0b']
    });
  }
  
  var penaltyHtml = currentTest.penalty ? '<div style="font-size: 11px; color: var(--danger); font-weight: 700; margin-top: 5px;">Penalización activa (-0.33 por error)</div>' : '';
  
  document.getElementById('results-content').innerHTML = 
    '<div style="text-align: center; margin-bottom: 10px;">' + penaltyHtml + '</div>' +
    '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin: 20px 0;">' +
      '<div style="background: #f0fdf4; padding: 15px 5px; border-radius: 8px; text-align: center;"><div style="font-size: 22px; font-weight: bold; color: #16a34a;">' + currentTest.score + '</div><div style="font-size: 11px; color: #666; font-weight: bold;">Aciertos</div></div>' +
      '<div style="background: #fef2f2; padding: 15px 5px; border-radius: 8px; text-align: center;"><div style="font-size: 22px; font-weight: bold; color: #ef4444;">' + currentTest.mistakes + '</div><div style="font-size: 11px; color: #666; font-weight: bold;">Errores</div></div>' +
      '<div style="background: #fef08a; padding: 15px 5px; border-radius: 8px; text-align: center;"><div style="font-size: 22px; font-weight: bold; color: #854d0e;">' + currentTest.blanks + '</div><div style="font-size: 11px; color: #666; font-weight: bold;">Blancas</div></div>' +
      '<div style="background: #eff6ff; padding: 15px 5px; border-radius: 8px; text-align: center;"><div style="font-size: 22px; font-weight: bold; color: #3b82f6;">' + nota + '</div><div style="font-size: 11px; color: #666; font-weight: bold;">Nota</div></div>' +
    '</div>' +
    '<button class="secondary" onclick="showCurrentMistakes()">Ver detalle del examen</button>';
}

function startMistakeReview() {
  setLoading('Calculando tu repaso diario SRS...');
  var srs = getSrsData();
  var now = Date.now();
  var dueIds = [];
  
  Object.keys(srs).forEach(function(id) {
    if (srs[id].nextReviewDate <= now) dueIds.push(parseInt(id));
  });
  
  if (dueIds.length === 0) {
    backHome();
    alert('¡Al día! No tienes preguntas pendientes para repasar hoy. 🎉');
    return;
  }
  
  dueIds = shuffle(dueIds).slice(0, 50);
  
  client.from('preguntas').select('*').in('id', dueIds).then(function(res) {
    if (res.error || !res.data || res.data.length === 0) {
      backHome(); alert('Error cargando preguntas de repaso.'); return;
    }
    
    var questions = res.data.map(q => {
      var item = srs[q.id];
      q.srsInfo = 'Nivel SRS: ' + (item ? item.easeFactor.toFixed(1) : '?');
      return q;
    });
    
    startLoadedTest('Repaso Diario (SRS)', questions, questions.length * 45, { penalty: false });
  });
}

function loadStats() {
  resultsQuery().limit(50).then(function(res) {
    if (res.error) {
      console.error('Error al cargar estadísticas:', res.error);
      if (handleProfileColumnError(res.error)) return loadStats();
      document.getElementById('stats').innerHTML = '<p class="muted" style="text-align:center; color: var(--danger);">Error al conectar: ' + res.error.message + '</p>';
      return;
    }

    if (res.data && res.data.length > 0) {
      lastResults = res.data;
      renderHeatmap(res.data);
      renderProgressChart(res.data);
      renderCategoryChart(res.data);
      
      var streak = calculateStreak(res.data);
      updateStreakUI(streak);
      checkAchievements(res.data, streak);
      loadGlobalRanking();
      renderHistoryPreview(res.data);
      
      document.getElementById('stats').innerHTML = '<p class="muted" style="text-align:center; margin-top:20px;">Últimos tests guardados: ' + res.data.length + '</p>';
    } else {
      lastResults = [];
      updateStreakUI(0);
      document.getElementById('stats').innerHTML = '<p class="muted" style="text-align:center;">No hay datos de exámenes todavía.</p>';
      renderHistoryPreview([]);
    }
  });
}

function renderProgressChart(results) {
  var canvas = document.getElementById('progressChart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  
  // Procesar datos (revertir para que la racha vaya de pasado a presente)
  var data = results.slice().reverse().map(function(r) {
    return ((r.puntuacion / r.total_preguntas) * 10).toFixed(2);
  });
  
  var labels = results.slice().reverse().map(function(r) {
    return new Date(r.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  });

  if (progressChart) progressChart.destroy();

  progressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Nota media',
        data: data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 10 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 }
        }
      }
    }
  });
}

function renderCategoryChart(results) {
  var canvas = document.getElementById('categoryChart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  
  var stats = {};
  results.forEach(function(r) {
    var name = r.tipo_test || 'General';
    if (!stats[name]) stats[name] = { score: 0, total: 0 };
    stats[name].score += Number(r.puntuacion || 0);
    stats[name].total += Number(r.total_preguntas || 0);
  });

  var labels = Object.keys(stats);
  var data = labels.map(function(name) {
    return Math.round((stats[name].score / stats[name].total) * 100);
  });

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '% Aciertos',
        data: data,
        backgroundColor: data.map(function(v) {
          return v >= 70 ? 'rgba(16, 185, 129, 0.6)' : (v >= 50 ? 'rgba(245, 158, 11, 0.6)' : 'rgba(239, 68, 68, 0.6)');
        }),
        borderColor: data.map(function(v) {
          return v >= 70 ? '#10b981' : (v >= 50 ? '#f59e0b' : '#ef4444');
        }),
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: { callback: function(value) { return value + '%'; }, font: { size: 10 } }
        },
        y: {
          ticks: { font: { size: 11, weight: '600' } }
        }
      }
    }
  });
}

function getOptionText(m, letter) {
  if (!m.opciones || !letter) return letter;
  var idx = letter.toUpperCase().charCodeAt(0) - 65;
  if (idx >= 0 && idx < m.opciones.length) return letter + ') ' + m.opciones[idx];
  return letter;
}

function showCurrentMistakes() {
  hideAllScreens();
  document.getElementById('test-details').className = '';
  document.getElementById('test-details-title').textContent = 'Detalle del Examen';
  var html = '';
  var mistakes = currentTest.answers.filter(a => !a.es_correcta);
  
  if (mistakes.length === 0) {
    html += '<div class="card" style="text-align:center;"><p>¡No has tenido ningún fallo! Increíble. 🌟</p></div>';
  } else {
    mistakes.forEach(function(m, i) {
      var isBlank = m.es_blanca;
      var borderColor = isBlank ? '#ca8a04' : '#ef4444';
      var bgColor = isBlank ? 'rgba(253, 224, 71, 0.1)' : 'rgba(239, 68, 68, 0.05)';
      var statusText = isBlank ? '<span style="color: #ca8a04;">En blanco</span>' : '<span style="color: #ef4444;">Tu respuesta: ' + getOptionText(m, m.respuesta_usuario) + '</span>';
      
      var timeHtml = m.tiempo_segundos ? '<span style="float:right; font-size: 11px; color: var(--muted);">⏱️ ' + m.tiempo_segundos + 's</span>' : '';

      html += '<div class="card" style="background: ' + bgColor + '; margin-bottom: 15px; border-left: 4px solid ' + borderColor + '; text-align: left;">' +
        '<p style="font-size: 13px; color: var(--muted); margin-bottom: 5px;">Pregunta ' + (i + 1) + timeHtml + '</p>' +
        '<p style="margin-bottom: 10px;"><strong>' + m.pregunta + '</strong></p>' +
        '<p style="font-weight: 600; margin-bottom: 5px;">' + statusText + '</p>' +
        '<p style="color: #16a34a; font-weight: 600; margin-bottom: 10px;">Respuesta correcta: ' + getOptionText(m, m.respuesta_correcta) + '</p>' +
        (m.explicacion ? '<div style="background: var(--surface-soft); padding: 10px; border-radius: 8px; font-size: 13px; color: var(--text-soft);">💡 ' + m.explicacion + '</div>' : '') +
      '</div>';
    });
  }
  document.getElementById('test-details-content').innerHTML = html;
}

function renderCategoryStats(results) {
  var stats = {};
  results.forEach(r => {
    var name = r.tipo_test || 'General';
    if (!stats[name]) stats[name] = { score: 0, total: 0 };
    stats[name].score += Number(r.puntuacion || 0);
    stats[name].total += Number(r.total_preguntas || 0);
  });
  var html = '<div class="progress-list">';
  Object.keys(stats).forEach(name => {
    var item = stats[name];
    var percent = Math.round((item.score / item.total) * 100);
    html += '<div style="margin-bottom:10px;"><strong>' + name + '</strong> (' + percent + '%)<div class="progress-track"><div class="progress-bar" style="width:' + percent + '%;"></div></div></div>';
  });
  return html + '</div>';
}

function backHome() {
  if (timerInterval) clearInterval(timerInterval);
  hideAllScreens();
  document.getElementById('app').className = '';
  loadStats();
}

function startSurvival() {
  setLoading('Preparando supervivencia...');
  var allQuestions = []; var completed = 0;
  temarioCategories.forEach(cat => {
    client.from('preguntas').select('*').eq('categoria', getDbCategoryName(cat)).limit(50).then(res => {
      if (res.data) allQuestions = allQuestions.concat(res.data);
      completed++;
      if (completed === temarioCategories.length) startLoadedTest('Supervivencia', allQuestions, 30, { survival: true });
    });
  });
}

function startSurvivalTimer() {
  if (timerInterval) clearInterval(timerInterval);
  updateTimer();
  timerInterval = setInterval(() => {
    currentTest.time--; updateTimer();
    if (currentTest.time <= 0) { clearInterval(timerInterval); gameOver('⏱️ Tiempo agotado'); }
  }, 1000);
}

function gameOver(reason) {
  clearInterval(timerInterval); hideAllScreens();
  var points = currentTest.score || 0;
  var isNewRecord = updateRecord('survival', points);
  
  if (isNewRecord) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#ffffff']
    });
    alert('💥 GAME OVER: ' + reason + '\n\n🏆 ¡NUEVO RÉCORD!: ' + points + ' aciertos');
  } else {
    alert('GAME OVER: ' + reason + '\nAciertos: ' + points);
  }
  backHome();
}

function finishSurvivalVictory() {
  var points = currentTest.score || 0;
  var isNewRecord = updateRecord('survival', points);
  
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 }
  });
  
  if (isNewRecord) {
    alert('¡VICTORIA! Has superado todas las preguntas.\n\n🏆 ¡NUEVO RÉCORD!: ' + points + ' aciertos');
  } else {
    alert('¡VICTORIA! Has superado todas las preguntas.');
  }
  backHome();
}

document.addEventListener('DOMContentLoaded', init);

function checkAchievements(results, streak) {
  var container = document.getElementById('achievements-list');
  if (!container) return;
  
  var badges = [];
  
  if (results.length >= 1) badges.push({ icon: '🎓', title: 'Novato', desc: 'Tu primer test completado' });
  if (streak >= 3) badges.push({ icon: '🔥', title: 'Constante', desc: 'Racha de 3 días' });
  if (streak >= 7) badges.push({ icon: '👑', title: 'Maestro', desc: 'Racha de 7 días' });
  
  var perfectScore = results.some(r => ((r.puntuacion / r.total_preguntas) * 10) >= 10);
  if (perfectScore) badges.push({ icon: '🎯', title: 'Infalible', desc: 'Nota máxima en un test' });
  
  var fastTest = results.some(r => {
    var secs = parseInt(r.tiempo_usado) || 999;
    return secs < 300 && ((r.puntuacion / r.total_preguntas) * 10) >= 5;
  });
  if (fastTest) badges.push({ icon: '⚡', title: 'Velocista', desc: 'Test aprobado en menos de 5 min' });

  if (badges.length === 0) {
    container.innerHTML = '<p class="muted">Sigue entrenando para conseguir medallas.</p>';
    return;
  }
  
  container.innerHTML = badges.map(b => `
    <div class="achievement-badge">
      <div style="font-size: 32px; margin-bottom: 8px;">${b.icon}</div>
      <strong style="font-size: 14px; color: var(--text); display: block;">${b.title}</strong>
      <span style="font-size: 11px; color: var(--muted);">${b.desc}</span>
    </div>
  `).join('');
}
function loadGlobalRanking() {
  var container = document.getElementById('global-ranking');
  if (!container) return;

  // Consultamos los últimos resultados globales (no solo del perfil actual)
  client.from('resultados').select('perfil, puntuacion').limit(2000).then(function(res) {
    if (!res.data || res.data.length === 0) {
      container.innerHTML = '<p class="muted" style="padding: 20px; text-align: center;">Aún no hay suficientes datos para el ránking.</p>';
      return;
    }

    var rankingMap = {};
    res.data.forEach(function(r) {
      var name = r.perfil || 'Anónimo';
      rankingMap[name] = (rankingMap[name] || 0) + Number(r.puntuacion || 0);
    });

    var sorted = Object.keys(rankingMap).map(function(name) {
      return { name: name, score: rankingMap[name] };
    }).sort((a, b) => b.score - a.score).slice(0, 10);

    var html = '<table style="width: 100%; border-collapse: collapse;">';
    sorted.forEach(function(p, i) {
      var icon = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : (i + 1) + '.'));
      var isMe = p.name === currentProfile;
      var rowBg = isMe ? 'rgba(37, 99, 235, 0.1)' : 'transparent';
      
      html += `<tr style="background: ${rowBg}; border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; font-weight: 800; width: 40px; text-align: center;">${icon}</td>
        <td style="padding: 12px; font-weight: 600; color: var(--text);">${p.name} ${isMe ? '(Tú)' : ''}</td>
        <td style="padding: 12px; text-align: right; font-weight: 800; color: var(--primary);">${p.score} pts</td>
      </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
  }).catch(function(err) {
    console.error('Error cargando ránking:', err);
    container.innerHTML = '<p class="muted" style="padding: 20px; text-align: center;">Error al cargar el ránking.</p>';
  });
}

function calculateStreak(results) {
  if (!results || results.length === 0) return 0;
  
  var dates = results.map(function(r) {
    var d = new Date(r.fecha);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  });
  
  // Eliminar duplicados de fechas (mismo día) y ordenar
  var uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
  
  var streak = 0;
  var today = new Date();
  var checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  
  // Si el último test no fue hoy ni ayer, racha es 0
  var lastTestDate = uniqueDates[0];
  var diff = (checkDate - lastTestDate) / (1000 * 60 * 60 * 24);
  
  if (diff > 1) return 0;
  
  for (var i = 0; i < uniqueDates.length; i++) {
    if (i > 0) {
      var prevDate = uniqueDates[i-1];
      var currDate = uniqueDates[i];
      var dayDiff = (prevDate - currDate) / (1000 * 60 * 60 * 24);
      if (dayDiff === 1) streak++;
      else break;
    } else {
      streak = 1;
    }
  }
  
  return streak;
}

function updateStreakUI(streak) {
  var label = document.getElementById('streak-count');
  if (label) label.textContent = streak;
  var container = document.getElementById('streak-container');
  if (container) container.className = streak > 0 ? '' : 'hidden';
}

function renderHistoryPreview(results) {
  var container = document.getElementById('history-list');
  if (!container) return;
  
  var html = '';
  results.slice(0, 5).forEach(function(r) {
    var nota = ((r.puntuacion / r.total_preguntas) * 10).toFixed(1);
    var color = nota >= 7 ? '#16a34a' : (nota >= 5 ? '#f59e0b' : '#ef4444');
    var fecha = new Date(r.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    
    html += `<div class="profile-choice" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; cursor: pointer; margin-bottom: 8px;" onclick="showPastTestDetails('${r.id}')">
      <div style="text-align: left;">
        <div style="font-weight: 700; font-size: 14px;">${r.tipo_test}</div>
        <div style="font-size: 11px; color: var(--muted);">${fecha}</div>
      </div>
      <div style="font-weight: 800; color: ${color}; font-size: 16px;">${nota}</div>
    </div>`;
  });
  container.innerHTML = html || '<p class="muted">No hay exámenes realizados.</p>';
}

function showFullHistory() {
  hideAllScreens();
  document.getElementById('history-screen').className = '';
  var container = document.getElementById('full-history-content');
  
  var html = '';
  lastResults.forEach(function(r) {
    var nota = ((r.puntuacion / r.total_preguntas) * 10).toFixed(1);
    var color = nota >= 7 ? '#16a34a' : (nota >= 5 ? '#f59e0b' : '#ef4444');
    var fecha = new Date(r.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    
    html += `<div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: pointer;" onclick="showPastTestDetails('${r.id}')">
      <div style="text-align: left;">
        <strong>${r.tipo_test}</strong>
        <p class="muted" style="margin: 0; font-size: 12px;">${fecha} · ${r.puntuacion}/${r.total_preguntas} aciertos</p>
      </div>
      <div style="font-size: 20px; font-weight: 800; color: ${color};">${nota}</div>
    </div>`;
  });
  container.innerHTML = html || '<p class="muted">No hay historial todavía.</p>';
}

function showPastTestDetails(id) {
  var test = lastResults.find(r => r.id == id);
  if (!test || !test.detalles) return;
  
  hideAllScreens();
  document.getElementById('test-details').className = '';
  document.getElementById('test-details-title').textContent = 'Detalles del Test';
  
  var nota = ((test.puntuacion / test.total_preguntas) * 10).toFixed(1);
  var html = `<h3 style="margin-top:0;">${test.tipo_test}</h3>
    <p class="muted">${new Date(test.fecha).toLocaleString()}</p>
    <div style="font-size: 24px; font-weight: 800; text-align: center; margin: 20px 0; color: var(--primary);">Nota: ${nota}</div>
    <hr style="opacity: 0.1; margin: 20px 0;">`;
  
  test.detalles.forEach(function(m, i) {
    var userAnsText = getOptionText(m, m.respuesta_usuario);
    var correctAnsText = getOptionText(m, m.respuesta_correcta);
    var isCorrect = m.es_correcta;
    var bgColor = isCorrect ? 'rgba(22, 163, 74, 0.05)' : 'rgba(239, 68, 68, 0.05)';
    var borderColor = isCorrect ? '#16a34a' : '#ef4444';
    
    html += `<div class="card" style="background: ${bgColor}; margin-bottom: 15px; border-left: 4px solid ${borderColor}; text-align: left;">
      <p style="font-size: 11px; color: var(--muted); margin-bottom: 5px;">Pregunta ${i + 1}</p>
      <p style="margin-bottom: 10px;"><strong>${m.pregunta}</strong></p>
      <p style="color: ${isCorrect ? '#16a34a' : '#ef4444'}; font-weight: 600; margin-bottom: 5px;">Tu respuesta: ${userAnsText}</p>
      ${!isCorrect ? `<p style="color: #16a34a; font-weight: 600; margin-bottom: 10px;">Respuesta correcta: ${correctAnsText}</p>` : ''}
      ${m.explicacion ? `<div style="background: var(--surface-soft); padding: 10px; border-radius: 8px; font-size: 13px; color: var(--text-soft);">💡 ${m.explicacion}</div>` : ''}
    </div>`;
  });
  
  document.getElementById('test-details-content').innerHTML = html;
}

function showSearchScreen() {
  hideAllScreens();
  document.getElementById('search-screen').className = '';
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = '<p class="muted" style="text-align: center; margin-top: 50px;">Escribe algo para buscar en la base de datos...</p>';
  setTimeout(() => document.getElementById('search-input').focus(), 100);
}

async function handleSearch(event) {
  var query = event.target.value.trim();
  if (query.length < 3) {
    document.getElementById('search-results').innerHTML = '<p class="muted" style="text-align: center; margin-top: 50px;">Escribe al menos 3 caracteres...</p>';
    return;
  }
  
  document.getElementById('search-results').innerHTML = '<p class="muted" style="text-align: center; margin-top: 50px;">Buscando...</p>';
  
  try {
    var html = '';
    
    // 1. Buscamos en el Glosario (Tren de las Palabras)
    var glossaryMatch = wordGameDefinitions.find(d => normalizeStr(d.word).includes(normalizeStr(query)) || normalizeStr(query).includes(normalizeStr(d.word)));
    if (glossaryMatch) {
      html += `<div class="card" style="background: rgba(22, 163, 74, 0.1); border: 2px solid var(--success); margin-bottom: 25px; text-align: left;">
        <p style="font-size: 11px; color: var(--success); font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">📖 Definición Oficial</p>
        <h3 style="margin-bottom: 10px; color: var(--text);">${glossaryMatch.word}</h3>
        <p style="font-size: 15px; line-height: 1.5;">${glossaryMatch.hint}</p>
      </div>`;
    }

    // 2. Buscamos en la tabla de preguntas
    const { data, error } = await client.from('preguntas')
      .select('*')
      .or(`enunciado.ilike.%${query}%,opcion_a.ilike.%${query}%,opcion_b.ilike.%${query}%,opcion_c.ilike.%${query}%,opcion_d.ilike.%${query}%,explicacion.ilike.%${query}%`)
      .limit(15);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      if (!glossaryMatch) {
        document.getElementById('search-results').innerHTML = '<p class="muted" style="text-align: center; margin-top: 50px;">No se han encontrado resultados ni definiciones.</p>';
      } else {
        document.getElementById('search-results').innerHTML = html + '<p class="muted" style="text-align: center;">No hay preguntas adicionales vinculadas.</p>';
      }
      return;
    }
    
    html += `<p class="muted" style="margin-bottom: 20px;">Preguntas relacionadas:</p>`;
    data.forEach(function(q) {
      html += `<div class="card" style="text-align: left; margin-bottom: 15px; border-left: 4px solid var(--primary);">
        <p style="font-size: 11px; color: var(--muted); margin-bottom: 5px;">${q.categoria}</p>
        <p style="margin-bottom: 10px;"><strong>${getQuestionText(q)}</strong></p>
        <div style="font-size: 13px; margin-bottom: 5px;">✅ <span style="color: var(--success); font-weight: 600;">Correcta: ${q['opcion_' + q.respuesta_correcta.toLowerCase()]}</span></div>
        ${q.explicacion ? `<div style="background: var(--surface-soft); padding: 10px; border-radius: 8px; font-size: 12px; color: var(--text-soft); margin-top: 10px;">💡 ${q.explicacion}</div>` : ''}
      </div>`;
    });
    document.getElementById('search-results').innerHTML = html;
    
  } catch (e) {
    console.error('Error en búsqueda:', e);
    document.getElementById('search-results').innerHTML = '<p class="muted" style="text-align: center; margin-top: 50px; color: var(--danger);">Error al conectar con la base de datos.</p>';
  }
}
