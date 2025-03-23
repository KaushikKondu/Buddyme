import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/providers/auth-provider";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialLoginButtons } from "@/components/auth/social-buttons";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeatureBanner } from "@/components/ui/feature-banner";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";

export default function LoginPage() {
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const [showSetupAlert, setShowSetupAlert] = useState(true);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-md">
          {/* Firebase Setup Alert */}
          {showSetupAlert && (
            <Alert className="mb-6 bg-amber-50 border-amber-200 text-left">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <div className="flex justify-between w-full">
                <div>
                  <AlertTitle className="text-amber-800 text-sm sm:text-base">Firebase Configuration Required</AlertTitle>
                  <AlertDescription className="text-amber-700 mt-1 text-xs sm:text-sm">
                    For authentication to work, you need to:
                    <ol className="list-decimal ml-4 mt-2 space-y-1">
                      <li>Enable Email/Password and Google authentication in your Firebase project</li>
                      <li>Add the Replit domain to authorized domains in Firebase Authentication settings</li>
                    </ol>
                  </AlertDescription>
                </div>
                <button 
                  onClick={() => setShowSetupAlert(false)}
                  className="text-amber-600 hover:text-amber-800 flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Alert>
          )}
          
          {/* Auth Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden auth-transition">
            <div className="p-5 sm:p-6 md:p-8">
              {/* Welcome Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-neutral-500 mb-2">
                  Welcome to BuddyMe
                </h2>
                <p className="text-sm text-muted-foreground font-inter">
                  Find activity partners who share your interests
                </p>
              </div>

              <AuthForm />

              {/* Divider */}
              <div className="flex items-center my-6">
                <Separator className="flex-grow" />
                <span className="px-4 text-xs sm:text-sm text-muted-foreground font-medium">
                  or continue with
                </span>
                <Separator className="flex-grow" />
              </div>

              {/* Social Login Buttons */}
              <SocialLoginButtons />
            </div>

            {/* App Features Banner */}
            <FeatureBanner />
          </div>

          {/* App Info */}
          <div className="mt-6 sm:mt-8 text-center text-muted-foreground text-xs sm:text-sm">
            <p className="mb-2">
              Find the perfect activity partner based on your interests
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-0 sm:space-x-4">
              <a href="#" className="hover:text-secondary transition px-1">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-secondary transition px-1">
                Terms of Service
              </a>
              <a href="#" className="hover:text-secondary transition px-1">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
