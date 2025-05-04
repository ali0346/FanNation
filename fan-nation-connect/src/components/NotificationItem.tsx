
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface NotificationItemProps {
  id: string;
  type: "reply" | "mention" | "thread" | "like" | "poll" | "system";
  message: string;
  link: string;
  date: string;
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
  markAsRead: (id: string) => void;
}

const NotificationItem = ({ 
  id, 
  type, 
  message, 
  link, 
  date, 
  isRead, 
  senderName, 
  senderAvatar,
  markAsRead
}: NotificationItemProps) => {
  
  const handleClick = () => {
    if (!isRead) {
      markAsRead(id);
    }
  };
  
  const getTypeLabel = () => {
    switch (type) {
      case "reply":
        return { text: "Reply", variant: "default" as const };
      case "mention":
        return { text: "Mention", variant: "secondary" as const };
      case "thread":
        return { text: "New Thread", variant: "outline" as const };
      case "like":
        return { text: "Like", variant: "secondary" as const };
      case "poll":
        return { text: "Poll", variant: "default" as const };
      case "system":
        return { text: "System", variant: "destructive" as const };
      default:
        return { text: "Notification", variant: "outline" as const };
    }
  };
  
  const typeInfo = getTypeLabel();
  
  return (
    <Link
      to={link}
      className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${
        !isRead 
          ? "bg-primary/5 hover:bg-primary/10" 
          : "bg-background hover:bg-muted/50"
      }`}
      onClick={handleClick}
    >
      {senderAvatar ? (
        <Avatar className="h-9 w-9">
          <AvatarImage src={senderAvatar} alt={senderName || "User"} />
          <AvatarFallback>
            {senderName?.substring(0, 2).toUpperCase() || "UN"}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Badge variant={typeInfo.variant} className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
            {typeInfo.text.substring(0, 1)}
          </Badge>
        </div>
      )}
      
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          {senderName && (
            <span className="font-medium truncate">
              {senderName}
            </span>
          )}
          <Badge variant={typeInfo.variant} className="text-[10px]">
            {typeInfo.text}
          </Badge>
        </div>
        
        <p className={`text-sm ${!isRead ? "font-medium" : "text-muted-foreground"}`}>
          {message}
        </p>
        
        <p className="text-xs text-muted-foreground">
          {formatDate(date)}
        </p>
      </div>
      
      {!isRead && (
        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
      )}
    </Link>
  );
};

export default NotificationItem;
