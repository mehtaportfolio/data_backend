import express from 'express';

const router = express.Router();

interface ServiceStatusResponse {
  success: boolean;
  status?: string;
  message?: string;
  error?: string;
  isRunning?: boolean;
}

router.get('/status', async (req, res): Promise<void> => {
  try {
    const RENDER_API_KEY = process.env.RENDER_API_KEY;
    const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID;

    if (!RENDER_API_KEY || !RENDER_SERVICE_ID) {
      res.status(500).json({
        success: false,
        error: 'Render API credentials not configured',
      } as ServiceStatusResponse);
      return;
    }

    const deploysResponse = await fetch(
      `https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys?limit=1`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${RENDER_API_KEY}`,
          Accept: 'application/json',
        },
      }
    );

    if (!deploysResponse.ok) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch deployment status from Render',
      } as ServiceStatusResponse);
      return;
    }

    const deploysData = await deploysResponse.json() as Array<{ deploy?: { status?: string } }>;
    
    const latestDeployItem = deploysData[0];
    const deployStatus = latestDeployItem?.deploy?.status;

    console.log('Latest Deploy Status:', deployStatus);

    const isRunning = deployStatus === 'live';

    res.json({
      success: true,
      status: deployStatus,
      isRunning,
      message: isRunning ? 'Service is running' : 'Service is not running',
    } as ServiceStatusResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ServiceStatusResponse);
  }
});

router.post('/restart', async (req, res): Promise<void> => {
  try {
    const RENDER_API_KEY = process.env.RENDER_API_KEY;
    const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID;

    if (!RENDER_API_KEY || !RENDER_SERVICE_ID) {
      res.status(500).json({
        success: false,
        error: 'Render API credentials not configured',
      } as ServiceStatusResponse);
      return;
    }

    const restartResponse = await fetch(
      `https://api.render.com/v1/services/${RENDER_SERVICE_ID}/restart`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!restartResponse.ok) {
      res.status(500).json({
        success: false,
        error: 'Failed to restart service',
      } as ServiceStatusResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Service restart initiated',
    } as ServiceStatusResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    } as ServiceStatusResponse);
  }
});

export default router;
