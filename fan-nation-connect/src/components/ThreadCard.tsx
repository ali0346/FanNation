// src/components/ThreadCard.tsx
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Thread, useThread } from "@/contexts/ThreadContext";
import { formatDate } from "@/lib/utils";

type ThreadCardProps = {
  thread: Thread;
  compact?: boolean;
};

const ThreadCard = ({ thread, compact = false }: ThreadCardProps) => {
  const { likeThread } = useThread();
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    likeThread(thread.id);
  };

  const goToSport = (e: React.MouseEvent) => {
    e.stopPropagation();                // prevent outer Link
    navigate(`/sport/${thread.sportId}`);
  };

  return (
    <Card className="overflow-hidden hover:border-primary/20 transition-all">
      {/* Entire card header/content/footer is wrapped in this Link */}
      <Link to={`/thread/${thread.id}`} className="block">
        <CardHeader className="p-4 pb-0 flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={thread.userProfilePicture} alt={thread.username} />
            <AvatarFallback>
              {thread.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{thread.username}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(thread.dateCreated)}
              </p>
            </div>
            <h3 className={`font-semibold text-${compact ? 'md' : 'lg'} leading-tight`}>
              {thread.title}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {thread.content}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {/* SPORT BUTTON INSTEAD OF NESTED LINK */}
            <button
              onClick={goToSport}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              {thread.sportName}
            </button>
            {!compact &&
              thread.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8 text-muted-foreground hover:text-primary"
              onClick={handleLike}
            >
              <ThumbsUp
                className={`h-4 w-4 ${thread.userLiked ? 'fill-primary text-primary' : ''}`}
              />
              <span>{thread.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8 text-muted-foreground"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{thread.replies.length}</span>
            </Button>
          </div>
          {!compact && thread.tags.length > 2 && (
            <Badge variant="outline">+{thread.tags.length - 2} more</Badge>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ThreadCard;
