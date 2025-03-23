import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  loginWithFacebook, 
  logout,
  onAuthChange,
  verifyUserWithBackend,
  getAuthResult
} from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  currentUser: FirebaseUser | null;
  userDetails: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for redirect result when the component mounts
    getAuthResult()
      .then(async (result) => {
        if (result?.user) {
          try {
            const userData = await verifyUserWithBackend(result.user);
            setUserDetails(userData.user);
            toast({
              title: "Authentication successful",
              description: `Welcome ${userData.user.displayName || 'back'} to BuddyMatch!`,
            });
          } catch (error) {
            console.error("Failed to verify user with backend:", error);
            toast({
              title: "Authentication Error",
              description: "There was a problem verifying your account.",
              variant: "destructive",
            });
          }
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
        if (error.code !== 'auth/no-auth-event') {
          toast({
            title: "Authentication Error",
            description: error.message || "There was a problem with authentication.",
            variant: "destructive",
          });
        }
      });

    // Set up auth state listener
    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user);
      if (!user) {
        setUserDetails(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await loginWithEmail(email, password);
      
      // Backend verification would be handled automatically by the auth state change
      toast({
        title: "Login successful",
        description: "Welcome back to BuddyMatch!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Failed to login with email and password";
      
      // Provide more helpful error messages for common Firebase errors
      if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Firebase authentication not configured properly. Please make sure email/password authentication is enabled in your Firebase console.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No user found with this email address.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many unsuccessful login attempts. Please try again later.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true);
      const { user } = await registerWithEmail(email, password);
      
      // Register with backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          displayName
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to register with backend');
      }
      
      const userData = await response.json();
      setUserDetails(userData.user);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Failed to create your account";
      
      // Provide more helpful error messages for common Firebase registration errors
      if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Firebase authentication not configured properly. Please make sure email/password authentication is enabled in your Firebase console.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email address already exists.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password accounts are not enabled in your Firebase project.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await loginWithGoogle();
      
      if (result?.user) {
        try {
          const userData = await verifyUserWithBackend(result.user);
          setUserDetails(userData.user);
          toast({
            title: "Google Authentication successful",
            description: `Welcome ${userData.user.displayName || 'back'} to BuddyMatch!`,
          });
        } catch (error) {
          console.error("Failed to verify user with backend:", error);
          toast({
            title: "Authentication Error",
            description: "There was a problem verifying your account with our servers.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      let errorMessage = "Failed to sign in with Google";
      if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Firebase authentication not properly configured. Please make sure Google authentication is enabled in your Firebase console, and the Replit domain is added to the authorized domains list.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please allow popups for this site.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in popup was closed before completing the sign-in process.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setIsLoading(true);
      const result = await loginWithFacebook();
      
      if (result?.user) {
        try {
          const userData = await verifyUserWithBackend(result.user);
          setUserDetails(userData.user);
          toast({
            title: "Facebook Authentication successful",
            description: `Welcome ${userData.user.displayName || 'back'} to BuddyMatch!`,
          });
        } catch (error) {
          console.error("Failed to verify user with backend:", error);
          toast({
            title: "Authentication Error",
            description: "There was a problem verifying your account with our servers.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Facebook sign-in error:", error);
      
      let errorMessage = "Failed to sign in with Facebook";
      if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Firebase authentication not properly configured. Please make sure Facebook authentication is enabled in your Firebase console, and the Replit domain is added to the authorized domains list.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please allow popups for this site.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in popup was closed before completing the sign-in process.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        userDetails, 
        isLoading, 
        login, 
        register, 
        signInWithGoogle, 
        signInWithFacebook, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}