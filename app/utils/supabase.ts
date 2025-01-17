import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Define types for our database tables
export interface LotteryRound {
    id: number;
    start_time: string;
    end_time: string;
    pool_size: number;
    ticket_price: number;
    winner_address: string | null;
    is_completed: boolean;
    created_at: string;
}

export interface TicketPurchase {
    id: number;
    round_id: number;
    wallet_address: string;
    ticket_count: number;
    transaction_signature: string;
    created_at: string;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function to verify database connection
export async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('lottery_rounds')
            .select('*')
            .limit(1);
        
        if (error) throw error;
        console.log('Successfully connected to Supabase');
        return true;
    } catch (error) {
        console.error('Error connecting to Supabase:', error);
        return false;
    }
} 