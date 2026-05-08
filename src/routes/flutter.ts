import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { BarcodeScan, ApiResponse } from '../types/index.js';

const router = Router();

// Get unique indices
router.get('/indices', async (req: Request, res: Response<ApiResponse<string[]>>) => {
  try {
    const { data, error } = await supabase
      .from('barcode_scans')
      .select('index');

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch indices: ${error.message}`,
      });
    }

    const indices = Array.from(new Set((data || [])
      .map((item: any) => item.index?.toString())
      .filter((idx: any) => idx !== undefined && idx !== null)
    )).sort();
    
    res.json({ success: true, data: indices });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Get scans with pagination and filtering
router.get('/scans', async (req: Request, res: Response<ApiResponse<{ data: BarcodeScan[], count: number }>>) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const pageSize = parseInt(req.query.pageSize as string) || 5;
    const indices = req.query.indices ? (req.query.indices as string).split(',') : [];

    let query = supabase
      .from('barcode_scans')
      .select('*', { count: 'exact' });

    if (indices.length > 0) {
      query = query.in('index', indices);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch scans: ${error.message}`,
      });
    }

    res.json({ 
      success: true, 
      data: { 
        data: data || [], 
        count: count || 0 
      } 
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Insert new scan
router.post('/scans', async (req: Request, res: Response<ApiResponse<BarcodeScan>>) => {
  try {
    const { barcode_value, index } = req.body;
    
    if (!barcode_value || !index) {
      return res.status(400).json({
        success: false,
        error: 'barcode_value and index are required',
      });
    }

    const { data, error } = await supabase
      .from('barcode_scans')
      .insert({ barcode_value, index })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to save scan: ${error.message}`,
      });
    }

    res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Delete scans for specific indices
router.delete('/scans', async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const indices = req.query.indices ? (req.query.indices as string).split(',') : [];
    
    if (indices.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one index is required for deletion',
      });
    }

    const { error } = await supabase
      .from('barcode_scans')
      .delete()
      .in('index', indices);

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to delete scans: ${error.message}`,
      });
    }

    res.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Delete all scans
router.delete('/scans/all', async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { error } = await supabase
      .from('barcode_scans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to clear table: ${error.message}`,
      });
    }

    res.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Verify master password
router.post('/verify-password', async (req: Request, res: Response<ApiResponse<boolean>>) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required',
      });
    }

    const { data, error } = await supabase
      .from('user_master')
      .select('secret')
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to verify password: ${error.message}`,
      });
    }

    const isValid = password === data.secret?.toString();
    res.json({ success: true, data: isValid });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Change master password
router.put('/change-password', async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Old and new passwords are required',
      });
    }

    const { data, error: fetchError } = await supabase
      .from('user_master')
      .select('id, secret')
      .single();

    if (fetchError) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch current password: ${fetchError.message}`,
      });
    }

    if (oldPassword !== data.secret?.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Current code is incorrect',
      });
    }

    const { error: updateError } = await supabase
      .from('user_master')
      .update({ secret: newPassword })
      .eq('id', data.id);

    if (updateError) {
      return res.status(500).json({
        success: false,
        error: `Failed to update password: ${updateError.message}`,
      });
    }

    res.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
