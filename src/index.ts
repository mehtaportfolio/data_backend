import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bankAccountRoutes from './routes/bankAccounts.js';
import creditCardRoutes from './routes/creditCards.js';
import generalDocumentsRoutes from './routes/generalDocuments.js';
import insurancePoliciesRoutes from './routes/insurancePolicies.js';
import depositsRoutes from './routes/deposits.js';
import dummyTableRoutes from './routes/dummyTable.js';
import websiteRoutes from './routes/websites.js';
import serviceRoutes from './routes/service.js';
import dashboardRoutes from './routes/dashboard.js';
import flutterRoutes from './routes/flutter.js';
import authRoutes from './routes/auth.js';
import storageRoutes from './routes/storage.js';
import { initializeScheduler } from './utils/scheduler.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

initializeScheduler();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(express.json({ limit: '10mb' }));

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Mobile apps, Postman, server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    // Allow any localhost port (Flutter Web / React dev)
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }

    // Allow configured production origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS not allowed for ${origin}`));
  },
  credentials: true
}));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API test route works' });
});

// Auth routes - NOT protected by authMiddleware
app.use('/api/auth', authRoutes);

// Protected routes - everything under /api requires a user ID header
app.use('/api', authMiddleware);

app.use('/api/storage', storageRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api/general-documents', generalDocumentsRoutes);
app.use('/api/insurance-policies', insurancePoliciesRoutes);
app.use('/api/deposits', depositsRoutes);
app.use('/api/dummy-table', dummyTableRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/flutter', flutterRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
