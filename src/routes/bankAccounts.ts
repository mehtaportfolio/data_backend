import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { BankAccount, ApiResponse } from '../types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response<ApiResponse<BankAccount[]>>) => {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch bank accounts: ${error.message}`,
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

router.post('/', async (req: Request, res: Response<ApiResponse<BankAccount>>) => {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to create bank account: ${error.message}`,
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

router.put('/:id', async (req: Request, res: Response<ApiResponse<BankAccount>>) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('bank_accounts')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to update bank account: ${error.message}`,
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

    const { error } = await supabase.from('bank_accounts').delete().eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to delete bank account: ${error.message}`,
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
