import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white py-4 border-t border-neutral-300">
      <div className="container mx-auto px-4">
        <div className="text-center text-muted-foreground text-sm">
          <p className="mb-3">&copy; {new Date().getFullYear()} BuddyMe. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/privacy" className="hover:text-secondary transition w-full sm:w-auto py-1 sm:py-0">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary transition w-full sm:w-auto py-1 sm:py-0">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-secondary transition w-full sm:w-auto py-1 sm:py-0">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
