import cron from 'node-cron';
import { supabase } from './supabase.js';

const DUMMY_TABLE_ID = 'activity-monitor';

export const initializeScheduler = () => {
  console.log('Initializing activity monitor scheduler...');

  cron.schedule('0 0 * * *', async () => {
    try {
      console.log(`[${new Date().toISOString()}] Running daily activity monitor update...`);
      
      const { data: existingData, error: fetchError } = await supabase
        .from('dummy_table')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching dummy_table:', fetchError.message);
        return;
      }

      if (existingData && existingData.length > 0) {
        const existingEntry = existingData[0];
        const { error: deleteError } = await supabase
          .from('dummy_table')
          .delete()
          .eq('id', existingEntry.id);

        if (deleteError) {
          console.error('Error deleting old entry:', deleteError.message);
          return;
        }
      }

      const { error: insertError } = await supabase
        .from('dummy_table')
        .insert({
          sr_no: 1,
          index_no: 1,
          point_no: new Date().getTime(),
        });

      if (insertError) {
        console.error('Error inserting activity monitor entry:', insertError.message);
        return;
      }

      console.log(`[${new Date().toISOString()}] ✓ Activity monitor updated successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Activity monitor error:', errorMessage);
    }
  });

  console.log('Activity monitor scheduler initialized (runs daily at 00:00 UTC)');
};
