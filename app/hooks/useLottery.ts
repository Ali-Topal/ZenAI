import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import type { LotteryRound, TicketPurchase } from '../utils/supabase';

interface LotteryState {
    poolSize: number;
    timeRemaining: number;
    ticketPrice: number;
    userTickets: number;
    currentRound: LotteryRound | null;
}

export const useLottery = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [state, setState] = useState<LotteryState>({
        poolSize: 0,
        timeRemaining: 7200,
        ticketPrice: 0.1,
        userTickets: 0,
        currentRound: null
    });

    // Fetch current lottery round
    useEffect(() => {
        const fetchCurrentRound = async () => {
            const { data, error } = await supabase
                .from('lottery_rounds')
                .select('*')
                .eq('is_completed', false)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                console.error('Error fetching current round:', error);
                return;
            }

            if (data) {
                const endTime = new Date(data.end_time).getTime();
                const now = new Date().getTime();
                const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

                setState(prev => ({
                    ...prev,
                    currentRound: data,
                    poolSize: data.pool_size,
                    timeRemaining,
                    ticketPrice: data.ticket_price
                }));
            }
        };

        fetchCurrentRound();
        const interval = setInterval(fetchCurrentRound, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
    }, []);

    // Fetch user tickets for current round
    useEffect(() => {
        if (!publicKey || !state.currentRound) return;

        const fetchUserTickets = async () => {
            const { data, error } = await supabase
                .from('ticket_purchases')
                .select('ticket_count')
                .eq('round_id', state.currentRound.id)
                .eq('wallet_address', publicKey.toBase58());

            if (error) {
                console.error('Error fetching user tickets:', error);
                return;
            }

            const totalTickets = data?.reduce((sum, purchase) => sum + purchase.ticket_count, 0) || 0;
            setState(prev => ({ ...prev, userTickets: totalTickets }));
        };

        fetchUserTickets();
    }, [publicKey, state.currentRound]);

    const buyTicket = async (amount: number) => {
        if (!publicKey || !state.currentRound) throw new Error('Wallet not connected or no active round');
        
        try {
            // TODO: Implement Solana transaction for ticket purchase
            console.log('Buying ticket...');

            // Record the purchase in Supabase
            const { error } = await supabase
                .from('ticket_purchases')
                .insert({
                    round_id: state.currentRound.id,
                    wallet_address: publicKey.toBase58(),
                    ticket_count: amount,
                    transaction_signature: 'TODO_IMPLEMENT_TX_SIGNATURE'
                });

            if (error) throw error;

            // Update local state
            setState(prev => ({
                ...prev,
                userTickets: prev.userTickets + amount,
                poolSize: prev.poolSize + (amount * prev.ticketPrice)
            }));
        } catch (error) {
            console.error('Error buying ticket:', error);
            throw error;
        }
    };

    const claimPrize = async () => {
        if (!publicKey || !state.currentRound) throw new Error('Wallet not connected or no active round');
        
        try {
            // TODO: Implement prize claiming logic with Solana
            console.log('Claiming prize...');
        } catch (error) {
            console.error('Error claiming prize:', error);
            throw error;
        }
    };

    return {
        ...state,
        buyTicket,
        claimPrize,
        isConnected: !!publicKey
    };
}; 