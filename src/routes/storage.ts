import { Router, Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { ApiResponse } from '../types/index.js';

const router = Router();

// Proxy for uploading files to Supabase Storage
router.post('/upload', async (req: Request, res: Response<ApiResponse<string>>) => {
  try {
    const { bucket, path, fileBase64, contentType } = req.body;

    if (!bucket || !path || !fileBase64) {
      return res.status(400).json({ success: false, error: 'Bucket, path, and file data are required' });
    }

    // Convert base64 to Buffer
    const buffer = Buffer.from(fileBase64, 'base64');

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      return res.status(500).json({ success: false, error: `Upload failed: ${error.message}` });
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    res.json({ success: true, data: publicUrlData.publicUrl });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Proxy for deleting files from Supabase Storage
router.delete('/delete', async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { bucket, path } = req.body;

    if (!bucket || !path) {
      return res.status(400).json({ success: false, error: 'Bucket and path are required' });
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return res.status(500).json({ success: false, error: `Delete failed: ${error.message}` });
    }

    res.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
