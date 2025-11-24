import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Add Ra's email
const { data, error } = await supabase
  .from('reengagement_campaign')
  .upsert({
    customer_email: 'kingthriva@gmail.com',
    customer_name: 'Ra',
    status: 'pending',
    batch_number: 999,
  }, {
    onConflict: 'customer_email'
  })
  .select();

if (error) {
  console.error('Error:', error);
} else {
  console.log('✅ Added Ra to campaign:', data);
}
