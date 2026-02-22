export interface BankAccount {
  id: string;
  bank_name: string;
  account_number?: string;
  ifsc_code?: string;
  branch?: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  customer_id?: string;
  username?: string;
  login_password?: string;
  account_owner?: string;
  upi_pin?: string;
  atm_pin?: string;
  transaction_password?: string;
  status?: string;
  issue_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreditCard {
  id: string;
  bank_name: string;
  credit_card_number?: string;
  issue_date?: string;
  expiry_date?: string;
  cvv_number?: string;
  billing_cycle?: string;
  last_date?: string;
  transaction_limit?: number;
  pin?: string;
  internet_banking_id?: string;
  login_password?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
}

export interface GeneralDocument {
  id: string;
  document_name: string;
  account_owner: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  file_attachment?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface InsurancePolicy {
  id: string;
  policy_type: string;
  policy_name: string;
  policy_number: string;
  start_date: string;
  expiry_date?: string;
  insured_amount: number;
  premium_amount: number;
  policy_year?: string;
  payment_year?: string;
  frequency?: string;
  nominee_name?: string;
  nominee_dob?: string;
  notes?: string;
  policy_document?: string;
  created_at: string;
  updated_at?: string;
}

export interface Deposit {
  id: string;
  deposit_date: string;
  amount: number;
  bank_name: string;
  branch?: string;
  created_at: string;
  updated_at?: string;
}

export interface DummyTable {
  id: string;
  sr_no: number;
  index_no: number;
  point_no: number;
  created_at: string;
  updated_at?: string;
}

export interface Website {
  id: string;
  account_owner: string;
  account_type?: string;
  short_web_name: string;
  number?: string;
  website_address: string;
  login_id?: string;
  login_password?: string;
  two_step_password?: string;
  other_password?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthRequest {
  userId: string;
}
