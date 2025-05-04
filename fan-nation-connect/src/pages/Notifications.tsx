
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, Bell, Filter } from "lucide-react";
import NotificationItem from '@/components/NotificationItem';

// Mock notification data
const initialNotifications = [
  {
    id: "notif-1",
    type: "reply" as const,
    message: "replied to your thread 'Who will win the Premier League?'",
    link: "/thread/1",
    date: "2023-09-15T10:45:00Z",
    isRead: false,
    senderName: "football_fan99",
    senderAvatar: "/placeholder.svg"
  },
  {
    id: "notif-2",
    type: "mention" as const,
    message: "mentioned you in 'The GOAT debate: LeBron vs Jordan'",
    link: "/thread/2",
    date: "2023-09-15T09:30:00Z",
    isRead: false,
    senderName: "basket_master",
    senderAvatar: "/placeholder.svg"
  },
  {
    id: "notif-3",
    type: "like" as const,
    message: "liked your reply in 'Cricket World Cup predictions'",
    link: "/thread/3",
    date: "2023-09-14T22:15:00Z",
    isRead: true,
    senderName: "cricket_lover",
    senderAvatar: "/placeholder.svg"
  },
  {
    id: "notif-4",
    type: "thread" as const,
    message: "New thread in Basketball: 'NBA Finals predictions'",
    link: "/thread/4",
    date: "2023-09-14T18:00:00Z",
    isRead: true
  },
  {
    id: "notif-5",
    type: "poll" as const,
    message: "New poll: 'Greatest football player of all time?'",
    link: "/polls",
    date: "2023-09-13T14:20:00Z",
    isRead: true
  },
  {
    id: "notif-6",
    type: "system" as const,
    message: "Welcome to FanNation! Complete your profile to get started.",
    link: "/profile",
    date: "2023-09-10T08:00:00Z",
    isRead: true
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");
  
  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };
  
  const filterNotifications = () => {
    switch(activeTab) {
      case "unread":
        return notifications.filter(notif => !notif.isRead);
      case "mentions":
        return notifications.filter(notif => notif.type === "mention");
      case "replies":
        return notifications.filter(notif => notif.type === "reply");
      case "system":
        return notifications.filter(notif => notif.type === "system");
      default:
        return notifications;
    }
  };
  
  const filteredNotifications = filterNotifications();
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="all" className="relative">
            All
            {unreadCount > 0 && (
              <span className="absolute top-0 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length > 0 ? (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    {...notification} 
                    markAsRead={markAsRead} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any {activeTab !== 'all' ? activeTab : ''} notifications at the moment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
