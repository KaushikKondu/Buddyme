import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, UserCog, Smartphone, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { currentUser, userDetails, isLoading, signOut } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated successfully.",
      });
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      <TabsTrigger value="profile" className="justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="justify-start">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy
                      </TabsTrigger>
                      <TabsTrigger value="account" className="justify-start">
                        <UserCog className="h-4 w-4 mr-2" />
                        Account
                      </TabsTrigger>
                      <TabsTrigger value="preferences" className="justify-start">
                        <Smartphone className="h-4 w-4 mr-2" />
                        App Settings
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
                <div className="p-4 border-t">
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account information and how it appears to others
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName" 
                          defaultValue={userDetails?.displayName || currentUser.email?.split('@')[0] || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          defaultValue={currentUser.email || ""} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          placeholder="Where are you located?" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input 
                          id="bio" 
                          placeholder="Tell us a bit about yourself" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Privacy Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="publicProfile">Public Profile</Label>
                          <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                        </div>
                        <Switch id="publicProfile" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showLocation">Show Location</Label>
                          <p className="text-sm text-muted-foreground">Display your location on your profile</p>
                        </div>
                        <Switch id="showLocation" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="activityStatus">Online Status</Label>
                          <p className="text-sm text-muted-foreground">Show when you're active on BuddyMe</p>
                        </div>
                        <Switch id="activityStatus" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch id="emailNotifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="connectionRequests">Connection Requests</Label>
                          <p className="text-sm text-muted-foreground">Get notified about new buddy requests</p>
                        </div>
                        <Switch id="connectionRequests" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="activityReminders">Activity Reminders</Label>
                          <p className="text-sm text-muted-foreground">Receive reminders about upcoming activities</p>
                        </div>
                        <Switch id="activityReminders" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-primary">
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}