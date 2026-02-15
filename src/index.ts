import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bankAccountRoutes from './routes/bankAccounts.js';
import creditCardRoutes from './routes/creditCards.js';
import generalDocumentsRoutes from './routes/generalDocuments.js';
import insurancePoliciesRoutes from './routes/insurancePolicies.js';
import depositsRoutes from './routes/deposits.js';
import websiteRoutes from './routes/websites.js';
import serviceRoutes from './routes/service.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api/general-documents', generalDocumentsRoutes);
app.use('/api/insurance-policies', insurancePoliciesRoutes);
app.use('/api/deposits', depositsRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
