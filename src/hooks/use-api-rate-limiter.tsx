
"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './use-auth';

const RATE_LIMIT_KEY = 'snaptheplant_rate_limit';
const DAILY_LIMIT = 15; // Max 15 AI calls per day for free users

interface RateLimitInfo {
    count: number;
    date: string; // YYYY-MM-DD
}

export function useApiRateLimiter() {
    const { subscriptionStatus } = useAuth();
    const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);

    const getTodayString = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Rate limiting only applies to free users
        if (subscriptionStatus !== 'free' || typeof window === 'undefined') return;

        try {
            const item = window.localStorage.getItem(RATE_LIMIT_KEY);
            const today = getTodayString();
            
            if (item) {
                const parsed = JSON.parse(item) as RateLimitInfo;
                if (parsed.date === today) {
                    setRateLimitInfo(parsed);
                } else {
                    // It's a new day, reset the counter
                    const newInfo = { count: 0, date: today };
                    window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newInfo));
                    setRateLimitInfo(newInfo);
                }
            } else {
                // No previous record, start fresh
                const newInfo = { count: 0, date: today };
                window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newInfo));
                setRateLimitInfo(newInfo);
            }
        } catch (error) {
            console.error("Error accessing rate limit info from localStorage", error);
        }
    }, [subscriptionStatus]);

    const canCallApi = useCallback((): boolean => {
        // Unlimited calls for non-free users
        if (subscriptionStatus !== 'free') {
            return true;
        }

        if (!rateLimitInfo) {
            // If state hasn't loaded yet, default to allowing the call.
            // This is a safe default to prevent blocking users on first load.
            return true; 
        }
        return rateLimitInfo.count < DAILY_LIMIT;
    }, [rateLimitInfo, subscriptionStatus]);

    const recordApiCall = useCallback(() => {
        // Only record calls for free users
        if (subscriptionStatus !== 'free' || typeof window === 'undefined') return;

        try {
            const today = getTodayString();
            const newCount = (rateLimitInfo?.count ?? 0) + 1;
            const newInfo: RateLimitInfo = { count: newCount, date: today };
            
            window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newInfo));
            setRateLimitInfo(newInfo);
        } catch (error) {
            console.error("Error updating rate limit info in localStorage", error);
        }
    }, [rateLimitInfo, subscriptionStatus]);

    return {
        canCallApi,
        recordApiCall,
        currentCount: rateLimitInfo?.count ?? 0,
        limit: DAILY_LIMIT,
    };
}
