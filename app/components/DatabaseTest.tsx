'use client';
import React, { useEffect, useState } from 'react';
import { testConnection } from '../utils/supabase';

export const DatabaseTest: React.FC = () => {
    const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');

    useEffect(() => {
        const checkConnection = async () => {
            const isConnected = await testConnection();
            setConnectionStatus(isConnected ? 'success' : 'error');
        };

        checkConnection();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg">
            {connectionStatus === 'testing' && (
                <div className="text-yellow-500">Testing database connection...</div>
            )}
            {connectionStatus === 'success' && (
                <div className="text-green-500">✓ Database connected</div>
            )}
            {connectionStatus === 'error' && (
                <div className="text-red-500">✗ Database connection failed</div>
            )}
        </div>
    );
}; 