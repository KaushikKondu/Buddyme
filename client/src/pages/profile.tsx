import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit, 
  Heart, 
  Users, 
  Settings, 
  Dumbbell, 
  Utensils, 
  Trophy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { currentUser, userDetails, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);

  // Mock interests data - this will be replaced by actual user data later
  useEffect(() => {
    // This would normally come from the backend
    setSelectedInterests(['Weight Training', 'Running', 'BBQ']);
  }, []);

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
      icon: <Dumbbell className="h-5 w-5 text-primary" />,
      interests: ['Weight Training', 'Cardio', 'CrossFit', 'Yoga', 'Swimming'] 
    },
    { 
      id: 'cooking', 
      name: 'Cooking Adventures', 
      icon: <Utensils className="h-5 w-5 text-primary" />,
      interests: ['Baking', 'International Cuisine', 'Vegetarian', 'BBQ', 'Desserts'] 
    },
    { 
      id: 'sports', 
      name: 'Sports & Recreation', 
      icon: <Trophy className="h-5 w-5 text-primary" />,
      interests: ['Badminton', 'Tennis', 'Basketball', 'Soccer', 'Running'] 
    }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="px-6 pb-6 relative">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <Avatar className="h-24 w-24 border-4 border-white">
                      <AvatarImage src={currentUser.photoURL || undefined} alt={userDetails?.displayName || "User"} />
                      <AvatarFallback className="bg-secondary text-white text-xl">
                        {userDetails?.displayName?.[0] || currentUser.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="mt-16 text-center">
                    <h2 className="text-xl font-semibold">
                      {userDetails?.displayName || currentUser.email?.split('@')[0]}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Activity Enthusiast</p>
                    
                    <div className="flex justify-center space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">{currentUser.email}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Joined {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">Location not specified</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    My Connections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center text-muted-foreground text-sm">
                    <p>You haven't connected with anyone yet.</p>
                    <Button variant="link" className="text-primary p-0 h-auto mt-1">
                      Find Buddies
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Content Area */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="interests">
                <TabsList className="mb-6">
                  <TabsTrigger value="interests">My Interests</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="interests" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">My Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedInterests.length > 0 ? (
                          selectedInterests.map(interest => (
                            <Badge key={interest} className="bg-primary text-white">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">No interests selected yet. Select some below!</p>
                        )}
                      </div>
                      
                      <div className="space-y-6 mt-8">
                        {categories.map((category) => (
                          <div key={category.id} className="border-t pt-4">
                            <div className="flex items-center mb-3">
                              {category.icon}
                              <h3 className="font-medium ml-2">{category.name}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {category.interests.map((interest) => (
                                <Badge 
                                  key={interest} 
                                  variant={selectedInterests.includes(interest) ? "default" : "outline"} 
                                  className={`cursor-pointer transition-colors ${
                                    selectedInterests.includes(interest) 
                                      ? "bg-primary text-white" 
                                      : "hover:bg-primary/10"
                                  }`}
                                  onClick={() => toggleInterest(interest)}
                                >
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <Button className="bg-primary">
                          Save Interests
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activities">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">My Activities</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <div className="text-muted-foreground">
                        <p>You haven't created any activities yet.</p>
                        <Button className="mt-4 bg-primary">
                          Create New Activity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommended Buddies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="border rounded-lg p-4 flex space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary text-white">
                                U{i}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium">User {i}</h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {i % 2 === 0 ? 'Cooking, Tennis' : 'Gym, Running'}
                              </p>
                              <Button variant="outline" size="sm" className="h-8 rounded-full">
                                <Heart className="h-3 w-3 mr-1" />
                                Connect
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}