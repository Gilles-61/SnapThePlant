
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle as signInWithGoogleFirebase, signOutFromGoogle, signUpWithEmailPassword, signInWithEmailPassword, sendPasswordReset as sendPasswordResetFirebase } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

export type SubscriptionStatus = 'free' | 'paid' | 'beta';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscriptionStatus: SubscriptionStatus;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('free');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (user) {
        // TODO: Replace with your Firestore logic to fetch subscription status
        // For now, all logged-in users are considered 'beta' testers
        setSubscriptionStatus('beta');
      } else {
        setSubscriptionStatus('free');
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (user: User) => {
    // In a real app, you'd fetch this from Firestore after login.
    // For this example, all authenticated users are 'beta' testers.
    const currentSubscriptionStatus: SubscriptionStatus = 'beta';
    setSubscriptionStatus(currentSubscriptionStatus);
    
    // Redirect based on subscription. 'free' goes to pricing, others to home.
    if (currentSubscriptionStatus === 'free') {
      router.push('/pricing');
    } else {
      router.push('/');
    }
  }

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithGoogleFirebase();
      handleAuthSuccess(userCredential.user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({
        title: "Sign-in Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      })
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
        const userCredential = await signUpWithEmailPassword(email, pass);
        // On new sign-up, they are 'free' tier until they choose a plan
        setSubscriptionStatus('free');
        router.push('/pricing'); // Redirect to pricing page
    } catch (error: any) {
        console.error("Error signing up: ", error);
        toast({
            title: "Sign-up Failed",
            description: error.message || "Could not create an account. Please try again.",
            variant: "destructive",
        })
    }
  }

  const signInWithEmail = async (email: string, pass: string) => {
    try {
        const userCredential = await signInWithEmailPassword(email, pass);
        handleAuthSuccess(userCredential.user);
    } catch (error: any) {
        console.error("Error signing in: ", error);
        toast({
            title: "Sign-in Failed",
            description: error.message || "Could not sign in. Please check your credentials.",
            variant: "destructive",
        })
    }
  }

  const signOut = async () => {
    try {
      await signOutFromGoogle();
      router.push('/login');
    } catch (error) {
        console.error("Error signing out: ", error);
        toast({
            title: "Sign-out Failed",
            description: "Could not sign out. Please try again.",
            variant: "destructive",
        })
    }
  };

  const sendPasswordReset = async (email: string) => {
    return sendPasswordResetFirebase(email);
  }

  return (
    <AuthContext.Provider value={{ user, loading, subscriptionStatus, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail, sendPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
