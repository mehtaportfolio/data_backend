import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { ApiResponse } from '../types/index.js';

const router = Router();

// Login endpoint - verifies PIN
router.post('/login', async (req: Request, res: Response<ApiResponse<{ userId: string }>>) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN is required' });
    }

    const { data, error } = await supabase
      .from('user_master')
      .select('id, master_password')
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to verify credentials: ${error.message}`,
      });
    }

    if (data && data.master_password === pin) {
      // In a real single-user app, we just return a consistent ID or the DB ID
      return res.json({ 
        success: true, 
        data: { userId: data.id.toString() } 
      });
    }

    res.status(401).json({ success: false, error: 'Invalid PIN' });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Update PIN endpoint
router.post('/change-pin', async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { oldPin, newPin } = req.body;

    if (!oldPin || !newPin) {
      return res.status(400).json({ success: false, error: 'Both old and new PIN are required' });
    }

    const { data, error } = await supabase
      .from('user_master')
      .select('master_password')
      .single();

    if (error || !data) {
      return res.status(500).json({ success: false, error: 'Failed to verify current PIN' });
    }

    if (data.master_password !== oldPin) {
      return res.status(401).json({ success: false, error: 'Current PIN is incorrect' });
    }

    const { error: updateError } = await supabase
      .from('user_master')
      .update({ master_password: newPin })
      .eq('id', 1); // Assuming single user has ID 1

    if (updateError) {
      return res.status(500).json({ success: false, error: 'Failed to update PIN' });
    }

    res.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
