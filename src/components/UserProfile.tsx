
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog } from "lucide-react";

export const UserProfile = () => {
  // This would typically come from your auth system
  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinedDate: "April 2024",
    sleepGoal: "8 hours",
    preferredBedtime: "10:30 PM",
    avatar: "/placeholder.svg"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        User Profile
      </h1>
      
      <Card className="border-border/50 bg-gradient-to-b from-card/95 to-card shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback className="bg-secondary">
              <UserCog className="h-8 w-8 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-foreground/90">{userProfile.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Member since {userProfile.joinedDate}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <h3 className="font-medium text-foreground/90">Contact Information</h3>
            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-medium text-foreground/90">Sleep Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-sm font-medium text-foreground/90">Daily Sleep Goal</p>
                <p className="text-sm text-muted-foreground">{userProfile.sleepGoal}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-sm font-medium text-foreground/90">Preferred Bedtime</p>
                <p className="text-sm text-muted-foreground">{userProfile.preferredBedtime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
