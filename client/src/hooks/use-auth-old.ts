import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
      toast({
        title: "Login failed",
        description: error.message || "Failed to login with email and password",
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
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create your account",
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
      await loginWithGoogle();
      // The redirect happens here, so the result is handled in the useEffect
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setIsLoading(true);
      await loginWithFacebook();
      // The redirect happens here, so the result is handled in the useEffect
    } catch (error: any) {
      console.error("Facebook sign-in error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Facebook",
        variant: "destructive",
      });
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

  const contextValue = {
    currentUser,
    userDetails,
    isLoading,
    login,
    register,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
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
