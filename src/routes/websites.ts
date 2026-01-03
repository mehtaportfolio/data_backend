import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { Website, ApiResponse } from '../types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response<ApiResponse<Website[]>>) => {
  try {
    const { data, error } = await supabase
      .from('website')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch websites: ${error.message}`,
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

router.post('/', async (req: Request, res: Response<ApiResponse<Website>>) => {
  try {
    const { data, error } = await supabase
      .from('website')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to create website: ${error.message}`,
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

router.put('/:id', async (req: Request, res: Response<ApiResponse<Website>>) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('website')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to update website: ${error.message}`,
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

router.delete('/:id', async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('website').delete().eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to delete website: ${error.message}`,
      });
    }

    res.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

export default router;
