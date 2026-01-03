import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { Deposit, ApiResponse } from '../types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response<ApiResponse<Deposit[]>>) => {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .order('deposit_date', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch deposits: ${error.message}`,
      });
    }

    res.json({ success: true, data: data || [] });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<Deposit>>) => {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to create deposit: ${error.message}`,
      });
    }

    res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

router.put('/:id', async (req: Request, res: Response<ApiResponse<Deposit>>) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('deposits')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to update deposit: ${error.message}`,
      });
    }

    res.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse<Deposit>>) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('deposits')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to delete deposit: ${error.message}`,
      });
    }

    res.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

export default router;
