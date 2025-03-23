import { Link } from "wouter";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { currentUser, userDetails, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="cursor-pointer flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold font-poppins">B</span>
              </div>
              <h1 className="text-2xl font-poppins font-semibold">
                <span className="text-primary">Buddy</span>
                <span className="text-secondary">Me</span>
              </h1>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.photoURL || undefined} alt={userDetails?.displayName || "User"} />
                    <AvatarFallback className="bg-secondary text-white">
                      {userDetails?.displayName?.[0] || currentUser.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/login" className="text-secondary font-medium text-sm">
                Login
              </Link>
            </Button>
          )}
          <Button variant="ghost" className="text-secondary font-medium text-sm">
            Help
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-neutral-700" />
            ) : (
              <Menu className="h-6 w-6 text-neutral-700" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 mt-4 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 px-2 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.photoURL || undefined} alt={userDetails?.displayName || "User"} />
                    <AvatarFallback className="bg-secondary text-white">
                      {userDetails?.displayName?.[0] || currentUser.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userDetails?.displayName || currentUser.email}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <Link href="/profile" className="px-2 py-3 hover:bg-neutral-100 rounded-md">
                  Profile
                </Link>
                <Link href="/settings" className="px-2 py-3 hover:bg-neutral-100 rounded-md">
                  Settings
                </Link>
                <button 
                  onClick={signOut}
                  className="px-2 py-3 text-left hover:bg-neutral-100 rounded-md"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" className="px-2 py-3 hover:bg-neutral-100 rounded-md text-secondary font-medium">
                Login
              </Link>
            )}
            <Link href="/help" className="px-2 py-3 hover:bg-neutral-100 rounded-md">
              Help
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
