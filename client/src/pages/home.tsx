import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Utensils, Trophy, Users, Heart, User } from "lucide-react";

export default function HomePage() {
  const { currentUser, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If user is not logged in and not loading, they'll be redirected by the useEffect
  if (!currentUser) {
    return null;
  }

  const categories = [
    { 
      id: 'gym', 
      name: 'Gym Activities', 
      icon: <Dumbbell className="h-8 w-8 text-primary" />,
      interests: ['Weight Training', 'Cardio', 'CrossFit', 'Yoga', 'Swimming'] 
    },
    { 
      id: 'cooking', 
      name: 'Cooking Adventures', 
      icon: <Utensils className="h-8 w-8 text-primary" />,
      interests: ['Baking', 'International Cuisine', 'Vegetarian', 'BBQ', 'Desserts'] 
    },
    { 
      id: 'sports', 
      name: 'Sports & Recreation', 
      icon: <Trophy className="h-8 w-8 text-primary" />,
      interests: ['Badminton', 'Tennis', 'Basketball', 'Soccer', 'Running'] 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-neutral-200">
        <div className="pt-10 pb-16">
          {/* Hero section */}
          <div className="bg-gradient-to-r from-secondary to-primary mb-10 py-12 sm:py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-poppins mb-4">
                Find Your Perfect Activity Partner
              </h1>
              <p className="text-white/90 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
                Connect with like-minded individuals who share your passion for fitness, cooking, sports, and more.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Button className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                  <Users className="mr-2 h-4 w-4" />
                  Find Buddies
                </Button>
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto mt-2 sm:mt-0">
                  <User className="mr-2 h-4 w-4" />
                  Complete Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold font-poppins mb-6">
              Select Your Interests
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
              {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="bg-neutral-100 flex flex-row items-center gap-4 p-4 md:p-6">
                    <div className="flex-shrink-0">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-xs md:text-sm">Select your preferences</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
                    <div className="flex flex-wrap gap-2">
                      {category.interests.map((interest) => (
                        <Badge 
                          key={interest} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-white transition-colors text-xs md:text-sm py-1"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Suggested Buddies Section */}
            <h2 className="text-2xl font-bold font-poppins mb-6">
              Suggested Buddies
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-300 flex items-center justify-center">
                      <User className="h-8 w-8 text-neutral-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">User {i}</h3>
                      <p className="text-sm text-muted-foreground">
                        {i === 1 ? 'Yoga, Running' : i === 2 ? 'BBQ, Badminton' : 'CrossFit, Soccer'}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto order-2 sm:order-1">View Profile</Button>
                    <Button size="sm" className="bg-primary w-full sm:w-auto order-1 sm:order-2">
                      <Heart className="h-4 w-4 mr-1" /> Connect
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
