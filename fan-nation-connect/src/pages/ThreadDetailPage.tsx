// src/pages/ThreadDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useThread, Reply } from "@/contexts/ThreadContext";
import ReplyCard from "@/components/ReplyCard";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const ThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { getThreadById, likeThread, createReply } = useThread();
  const navigate = useNavigate();

  const thread = getThreadById(id || "");

  // ** NEW ** local replies state
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load replies from backend when thread is found
  useEffect(() => {
    if (!thread) return;
    (async () => {
      try {
        // Fetch replies for the thread
        const res = await fetch(
          `http://localhost:5000/api/threads/${thread.id}/replies`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error("Failed to load replies");
        const data: Reply[] = await res.json();
        setReplies(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [thread]);

  if (!thread) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Thread not found</h1>
        <p className="mb-4">The thread you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    likeThread(thread.id);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("You must be logged in to reply");
      navigate("/login");
      return;
    }
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    setIsSubmitting(true);
    try {
      const newReply = await createReply(thread.id, replyContent);
      // prepend or append as desired
      setReplies((prev) => [...prev, newReply]);
      setReplyContent("");
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link to={`/sport/${thread.sportId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {thread.sportName}
        </Link>
      </Button>

      {/* Thread Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <Avatar>
              <AvatarImage
                src={thread.userProfilePicture}
                alt={thread.username}
              />
              <AvatarFallback>
                {thread.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold">{thread.username}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatDate(thread.dateCreated)}
                </p>
              </div>
              <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
              <p className="mb-4 whitespace-pre-wrap">{thread.content}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Link
                  to={`/sport/${thread.sportId}`}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
                >
                  {thread.sportName}
                </Link>
                {thread.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={handleLike}
              >
                <ThumbsUp
                  className={`h-4 w-4 ${
                    thread.userLiked ? "fill-primary text-primary" : ""
                  }`}
                />
                <span>{thread.likes}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {replies.length > 0
              ? `Replies (${replies.length})`
              : "Be the first to reply"}
          </h2>
          <form onSubmit={handleSubmitReply} className="space-y-4">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              disabled={!isAuthenticated || isSubmitting}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!isAuthenticated || isSubmitting}>
                {isSubmitting ? (
                  "Posting..."
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Post Reply
                  </>
                )}
              </Button>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground text-center">
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>{" "}
                to join the conversation
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Render Replies */}
      <div className="space-y-4">
        {replies.map((reply) => (
          <ReplyCard key={reply.id} reply={reply} threadId={thread.id} />
        ))}
      </div>
    </div>
  );
};

export default ThreadDetailPage;
