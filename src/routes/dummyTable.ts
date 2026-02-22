import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { DummyTable, ApiResponse } from '../types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response<ApiResponse<DummyTable[]>>) => {
  try {
    const { data, error } = await supabase
      .from('dummy_table')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch dummy table entries: ${error.message}`,
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

router.post('/', async (req: Request, res: Response<ApiResponse<DummyTable>>) => {
  try {
    const { sr_no, index_no, point_no } = req.body;

    if (sr_no === undefined || index_no === undefined || point_no === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sr_no, index_no, point_no',
      });
    }

    const { data, error } = await supabase
      .from('dummy_table')
      .insert({
        sr_no: parseInt(sr_no),
        index_no: parseInt(index_no),
        point_no: parseFloat(point_no),
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to create entry: ${error.message}`,
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

router.put('/:id', async (req: Request, res: Response<ApiResponse<DummyTable>>) => {
  try {
    const { id } = req.params;
    const { sr_no, index_no, point_no } = req.body;

    const updatePayload: any = {};
    if (sr_no !== undefined) updatePayload.sr_no = parseInt(sr_no);
    if (index_no !== undefined) updatePayload.index_no = parseInt(index_no);
    if (point_no !== undefined) updatePayload.point_no = parseFloat(point_no);

    const { data, error } = await supabase
      .from('dummy_table')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to update entry: ${error.message}`,
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

router.delete('/:id', async (req: Request, res: Response<ApiResponse<DummyTable>>) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('dummy_table')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: `Failed to delete entry: ${error.message}`,
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
