export interface Goal {
  id: number;
  title: string;
  target_amount: number;
  current_balance: number;
  target_date: string; // ISO date string
  description?: string;
 image_url?: string;
  is_active: boolean;
  created_at: string; // ISO date string
}

export interface CreateGoalRequest {
  title: string;
  target_amount: number;
  target_date?: string; // ISO date string
  description?: string;
  image_url?: string;
  is_active: boolean;
}

export interface Transaction {
  id: number;
  goal_id?: number;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal';
  description: string;
  created_at: string; // ISO date string
}

export interface Settings {
  id: number;
  theme: string;
 currency: string;
 language: string;
 created_at: string; // ISO date string
  updated_at: string; // ISO date string
}