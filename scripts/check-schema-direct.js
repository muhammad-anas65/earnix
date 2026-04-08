const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.log('Credentials not found');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

// To query information schema we might need postgres access, but let's try a bulk approach:
// We can just try to update a fake user with `reset_token: 'test'` and see if it throws "column not found"
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { error } = await supabase.from('users').update({ reset_token: 'test' }).eq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Error when updating reset_token:', error?.message || 'No error, column exists!');
}
check();
