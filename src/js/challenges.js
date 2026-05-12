// Challenges and Heatmap Logic

function getTodayString() {
  return new Date().toDateString();
}

function loadDailyChallenges() {
  if (!currentProfile) return;
  var today = getTodayString();
  var stored = localStorage.getItem('oporail-challenges-' + currentProfile);
  var data = stored ? JSON.parse(stored) : null;
  
  if (!data || data.date !== today) {
    // Generate new challenges
    data = {
      date: today,
      challenges: [
        { id: 'c1', type: 'tests', target: 3, progress: 0, desc: 'Completa 3 tests de cualquier tipo' },
        { id: 'c2', type: 'score', target: 15, progress: 0, desc: 'Acierta 15 o más preguntas en un test' },
        { id: 'c3', type: 'survival', target: 10, progress: 0, desc: 'Consigue 10 aciertos en Supervivencia' }
      ]
    };
    localStorage.setItem('oporail-challenges-' + currentProfile, JSON.stringify(data));
  }
  
  renderChallengesUI(data.challenges);
}

function updateChallengesProgress(currentTest) {
  if (!currentProfile || !currentTest) return;
  var stored = localStorage.getItem('oporail-challenges-' + currentProfile);
  if (!stored) return;
  var data = JSON.parse(stored);
  if (data.date !== getTodayString()) return;
  
  var updated = false;
  
  data.challenges.forEach(function(c) {
    if (c.progress >= c.target) return; // Already completed
    
    if (c.type === 'tests') {
      c.progress++;
      updated = true;
    } else if (c.type === 'score' && !currentTest.survival) {
      if (currentTest.score > c.progress) {
        c.progress = Math.min(currentTest.score, c.target);
        updated = true;
      }
    } else if (c.type === 'survival' && currentTest.survival) {
      if (currentTest.score > c.progress) {
        c.progress = Math.min(currentTest.score, c.target);
        updated = true;
      }
    }
  });
  
  if (updated) {
    localStorage.setItem('oporail-challenges-' + currentProfile, JSON.stringify(data));
    var allCompleted = data.challenges.every(c => c.progress >= c.target);
    if (allCompleted) {
      setTimeout(() => alert('🎉 ¡Has completado todos los retos de hoy!'), 1500);
    }
  }
}

function renderChallengesUI(challenges) {
  var container = document.getElementById('daily-challenges');
  if (!container) return;
  
  var html = '';
  challenges.forEach(function(c) {
    var percent = Math.min(100, Math.round((c.progress / c.target) * 100));
    var isDone = percent >= 100;
    var icon = isDone ? '✅' : '🎯';
    var color = isDone ? 'var(--success)' : 'var(--primary)';
    
    html += '<div style="background: var(--surface-opaque); border: 1px solid var(--border); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">' +
      '<div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">' +
        '<span>' + icon + ' ' + c.desc + '</span>' +
        '<span style="color: ' + color + ';">' + c.progress + '/' + c.target + '</span>' +
      '</div>' +
      '<div class="progress-track" style="margin: 0; height: 6px;"><div class="progress-bar" style="width: ' + percent + '%; background: ' + color + ';"></div></div>' +
    '</div>';
  });
  
  container.innerHTML = html;
}

function renderHeatmap(results) {
  var container = document.getElementById('heatmap-container');
  if (!container) return;
  
  var now = new Date();
  now.setHours(0,0,0,0);
  
  var counts = {};
  results.forEach(r => {
    var d = new Date(r.fecha);
    d.setHours(0,0,0,0);
    counts[d.getTime()] = (counts[d.getTime()] || 0) + 1;
  });
  
  var html = '';
  for (var i = 29; i >= 0; i--) {
    var d = new Date(now);
    d.setDate(d.getDate() - i);
    var count = counts[d.getTime()] || 0;
    
    var color = '#e2e8f0'; // Empty
    if (count === 1) color = '#93c5fd';
    else if (count === 2) color = '#3b82f6';
    else if (count >= 3) color = '#1d4ed8';
    
    var title = d.toLocaleDateString() + ': ' + count + ' tests';
    html += '<div title="' + title + '" style="width: 14px; height: 14px; background: ' + color + '; border-radius: 3px;"></div>';
  }
  
  container.innerHTML = html;
}
