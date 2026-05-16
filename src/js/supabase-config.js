var supabaseUrl = 'https://kxhtiqaupfodbxskcjox.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aHRpcWF1cGZvZGJ4c2tjam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjYwMzUsImV4cCI6MjA5MzU0MjAzNX0.Frwfdt6weBnyltD9G3y6wID5c9n6r1t6gTALsGTdbUA';

var client = null;

function initSupabase() {
  if (!client) {
    client = supabase.createClient(supabaseUrl, supabaseKey);
  }
  return client;
}
