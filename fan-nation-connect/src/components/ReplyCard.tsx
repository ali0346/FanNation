
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Reply, useThread } from "@/contexts/ThreadContext";
import { formatDate } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";

type ReplyCardProps = {
  reply: Reply;
  threadId: string;
};

const ReplyCard = ({ reply, threadId }: ReplyCardProps) => {
  const { likeReply } = useThread();

  const handleLike = () => {
    likeReply(threadId, reply.id);
  };

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="p-4 pb-0 flex flex-row items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={reply.userProfilePicture} alt={reply.username} />
          <AvatarFallback>{reply.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{reply.username}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(reply.dateCreated)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pl-[3.25rem]">
        <p className="text-sm">{reply.content}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 pl-[3.25rem]">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 h-8 text-muted-foreground hover:text-primary"
          onClick={handleLike}
        >
          <ThumbsUp 
            className={`h-4 w-4 ${reply.userLiked ? 'fill-primary text-primary' : ''}`} 
          />
          <span>{reply.likes}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReplyCard;
