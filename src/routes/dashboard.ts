import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { ApiResponse } from '../types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const [
      bankAccountsRes,
      creditCardsRes,
      generalDocumentsRes,
      insurancePoliciesRes,
      websitesRes
    ] = await Promise.all([
      supabase.from('bank_accounts').select('*').order('created_at', { ascending: false }),
      supabase.from('credit_cards').select('*').order('created_at', { ascending: false }),
      supabase.from('general_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('insurance_policies').select('*').order('created_at', { ascending: false }),
      supabase.from('website').select('*').order('created_at', { ascending: false })
    ]);

    // Check for errors in any of the requests
    const errors = [
      bankAccountsRes.error,
      creditCardsRes.error,
      generalDocumentsRes.error,
      insurancePoliciesRes.error,
      websitesRes.error
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error('Dashboard fetch errors:', errors);
      return res.status(500).json({
        success: false,
        error: `Failed to fetch some dashboard data: ${errors.map(e => e?.message).join(', ')}`,
      });
    }

    res.json({
      success: true,
      data: {
        bank_accounts: bankAccountsRes.data || [],
        credit_cards: creditCardsRes.data || [],
        general_documents: generalDocumentsRes.data || [],
        insurance_policies: insurancePoliciesRes.data || [],
        websites: websitesRes.data || []
      }
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

export default router;
