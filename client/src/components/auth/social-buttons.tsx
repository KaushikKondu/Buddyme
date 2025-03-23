import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export function SocialLoginButtons() {
  const { signInWithGoogle, signInWithFacebook, isLoading } = useAuth();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <Button
        variant="outline"
        className="auth-button group flex items-center justify-center gap-2 h-11"
        onClick={signInWithGoogle}
        disabled={isLoading}
      >
        <FcGoogle className="h-5 w-5" />
        <span className="font-medium group-hover:text-neutral-600">Google</span>
      </Button>
      <Button
        variant="outline"
        className="auth-button group flex items-center justify-center gap-2 bg-white h-11"
        onClick={signInWithFacebook}
        disabled={isLoading}
      >
        <FaFacebook className="h-5 w-5 text-[#3b5998]" />
        <span className="font-medium group-hover:text-neutral-600">Facebook</span>
      </Button>
    </div>
  );
}
