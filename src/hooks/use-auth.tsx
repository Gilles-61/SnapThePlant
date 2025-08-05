
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle as signInWithGoogleFirebase, signOutFromGoogle, signUpWithEmailPassword, signInWithEmailPassword } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithGoogleFirebase();
      router.push('/');
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
        await signUpWithEmailPassword(email, pass);
        router.push('/');
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
        await signInWithEmailPassword(email, pass);
        router.push('/');
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

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail }}>
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
