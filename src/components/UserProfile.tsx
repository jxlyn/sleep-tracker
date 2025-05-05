import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserCog, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { userStorage, UserPreferences } from "@/lib/userStorage";
import React, { useEffect, useState } from "react";
import ProfilePage from "@/pages/profile";
import "./Parallax.css";

export const UserProfile: React.FC = () => {
  const { toast } = useToast();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rawScrollY, setRawScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const preferences = userStorage.getPreferences();
    setUserPreferences(preferences);
  }, []);

  const handleSavePreferences = () => {
    if (userPreferences) {
      userStorage.updatePreferences(userPreferences);
      setIsEditing(false);
      toast({
        title: "Preferences updated",
        description: "Your sleep preferences have been saved successfully.",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => setRawScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let animationFrame: number;
    const smoothScroll = () => {
      setScrollY((prev) => {
        const diff = rawScrollY - prev;
        return prev + diff * 0.1;
      });
      animationFrame = requestAnimationFrame(smoothScroll);
    };
    smoothScroll();
    return () => cancelAnimationFrame(animationFrame);
  }, [rawScrollY]);

  const clampedScroll = Math.min(scrollY, window.innerHeight);
  const maxScroll = window.innerHeight;
  const titleTranslateX = 100 - (clampedScroll / maxScroll) * 160;

  const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '';

  if (!userPreferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No User Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please complete your profile setup first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="gradient-overlay" />
      <div className="parallax-wrapper">
        <div
          className="parallax-layer stars"
          style={{ transform: `translateY(-${scrollY * 0.1}px)` }}
        />
        <div
          className="parallax-layer moon"
          style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
        />
        <div
          className="parallax-layer mountains-back"
          style={{ transform: `translateY(-${scrollY * 0.3}px)` }}
        />
        <div
          className="parallax-layer mountains-front"
          style={{ transform: `translateY(-${scrollY * 0.4}px)` }}
        />
        <div
          className="parallax-layer parallax-title fixed-title"
          style={{ left: `${titleTranslateX}vw`}}
        >
          <h1>Good night, {userPreferences.name}!</h1>
        </div>
      </div>

      <div className="spacer-block" style={{ height: "130vh" }}></div>

      <div className="after-parallax-text w-full px-0">
        <Card className="border-border/50 bg-gradient-to-b from-card/95 to-card shadow-xl w-full text-xl p-12">
          <CardContent className="pt-10">
            <ProfilePage />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;