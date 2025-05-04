
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define notification types
type NotificationType = "reply" | "mention" | "thread" | "like" | "poll" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  link: string;
  date: string;
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
}

// Notification preferences type
interface NotificationPreferences {
  replies: boolean;
  mentions: boolean;
  threads: boolean;
  likes: boolean;
  polls: boolean;
  system: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<Notification, "id" | "date" | "isRead">) => void;
  preferences: NotificationPreferences;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
}

// Mock initial notifications for development
const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "reply",
    message: "replied to your thread 'Who will win the Premier League?'",
    link: "/thread/1",
    date: new Date().toISOString(),
    isRead: false,
    senderName: "football_fan99",
    senderAvatar: "/placeholder.svg"
  },
  {
    id: "notif-2",
    type: "mention",
    message: "mentioned you in 'The GOAT debate: LeBron vs Jordan'",
    link: "/thread/2",
    date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isRead: false,
    senderName: "basket_master",
    senderAvatar: "/placeholder.svg"
  }
];

// Default preferences
const defaultPreferences: NotificationPreferences = {
  replies: true,
  mentions: true,
  threads: true,
  likes: true,
  polls: true,
  system: true
};

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  
  // Calculate unread count
  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  
  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    const savedPreferences = localStorage.getItem("notificationPreferences");
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);
  
  // Update localStorage when notifications or preferences change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);
  
  useEffect(() => {
    localStorage.setItem("notificationPreferences", JSON.stringify(preferences));
  }, [preferences]);
  
  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "date" | "isRead">) => {
    // Check if notification type is enabled in preferences
    if (!preferences[notification.type as keyof NotificationPreferences]) {
      return;
    }
    
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  // Update notification preferences
  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };
  
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
    preferences,
    updatePreferences
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
