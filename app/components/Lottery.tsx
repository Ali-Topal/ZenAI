import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useLottery } from '../hooks/useLottery';

export const Lottery = () => {
    const { isConnected } = useWallet();
    const [ticketAmount, setTicketAmount] = useState(1);
    const { poolSize, timeRemaining, ticketPrice, userTickets, buyTicket, claimPrize } = useLottery();

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">Solana Lottery</h1>
                        <WalletMultiButton />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4">Pool Info</h2>
                            <div className="space-y-4">
                                <p>Pool Size: {poolSize} SOL</p>
                                <p>Time Remaining: {formatTime(timeRemaining)}</p>
                                <p>Ticket Price: {ticketPrice} SOL</p>
                                <p>Your Tickets: {userTickets}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4">Buy Tickets</h2>
                            {isConnected ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="number"
                                            min="1"
                                            value={ticketAmount}
                                            onChange={(e) => setTicketAmount(Math.max(1, parseInt(e.target.value)))}
                                            className="bg-gray-700 text-white px-4 py-2 rounded-lg w-24"
                                        />
                                        <button
                                            onClick={() => buyTicket(ticketAmount)}
                                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
                                        >
                                            Buy Tickets
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Total Cost: {(ticketAmount * ticketPrice).toFixed(2)} SOL
                                    </p>
                                </div>
                            ) : (
                                <p>Connect your wallet to participate</p>
                            )}
                        </div>
                    </div>

                    {isConnected && userTickets > 0 && (
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4">Your Prizes</h2>
                            <button
                                onClick={claimPrize}
                                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors"
                            >
                                Claim Prize
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 