
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserCog } from "lucide-react";

import React, { useEffect, useState } from "react";
import "./Parallax.css";

export const UserProfile = () => {
  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinedDate: "April 2024",
    sleepGoal: "8 hours",
    preferredBedtime: "10:30 PM",
    avatar: "/placeholder.svg"
  };

  const [rawScrollY, setRawScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);

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
        return prev + diff * 0.1; // 控制滚动“阻尼”速度
      });
      animationFrame = requestAnimationFrame(smoothScroll);
    };
    smoothScroll();
    return () => cancelAnimationFrame(animationFrame);
  }, [rawScrollY]);

  // 控制 Nice to meet you, John 的水平移动位置（从右到左）
  const clampedScroll = Math.min(scrollY, window.innerHeight);
  const maxScroll = window.innerHeight;
  const titleTranslateX = 100 - (clampedScroll / maxScroll) * 160; // 从 100vw 到 -60vw 左侧外

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
          <h1>Good night, {userProfile.name}!</h1>
        </div>
      </div>

      <div className="spacer-block" style={{ height: "130vh" }}></div>

      <div className="after-parallax-text px-4 sm:px-8 space-y-6">
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
    </div>
  );
}