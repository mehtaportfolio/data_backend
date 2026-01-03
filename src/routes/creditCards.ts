import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { CreditCard, ApiResponse } from '../types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response<ApiResponse<CreditCard[]>>) => {
  try {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch credit cards: ${error.message}`,
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

router.post('/', async (req: Request, res: Response<ApiResponse<CreditCard>>) => {
  try {
    const { data, error } = await supabase
      .from('credit_cards')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to create credit card: ${error.message}`,
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

router.put('/:id', async (req: Request, res: Response<ApiResponse<CreditCard>>) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('credit_cards')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to update credit card: ${error.message}`,
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

    const { error } = await supabase.from('credit_cards').delete().eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to delete credit card: ${error.message}`,
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
