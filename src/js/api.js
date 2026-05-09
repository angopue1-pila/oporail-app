function resultsQuery() {
  var query = client.from('resultados').select('*').order('fecha', { ascending: false });
  if (syncId !== 'publico') query = query.eq('sync_id', syncId);
  else query = query.filter('sync_id', 'is', null);
  
  if (currentProfile && profileColumnAvailable) query = query.eq('perfil', currentProfile);
  return query;
}

function resultPayload(base) {
  if (profileColumnAvailable) base.perfil = currentProfile || 'Sin perfil';
  if (syncId !== 'publico') base.sync_id = syncId;
  return base;
}

function loadQuestionCounts() {
  var counts = {};
  var completed = 0;
  allCategories.forEach(function(cat) {
    client.from('preguntas').select('id', { count: 'exact', head: true }).eq('categoria', getDbCategoryName(cat)).then(function(res) {
      counts[cat] = res.count || 0;
      completed++;
      if (completed === allCategories.length) renderQuestionCounts(counts);
    }).catch(function(err) {
      console.error('Error contando preguntas:', err);
      counts[cat] = null;
      completed++;
      if (completed === allCategories.length) renderQuestionCounts(counts);
    });
  });
}
