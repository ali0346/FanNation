import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, Share2, Bookmark } from "lucide-react"
import Link from "next/link"

interface ThreadCardProps {
  id: string
  title: string
  author: string
  date: string
  content: string
  likes: number
  comments: number
  category: string
}

export function ThreadCard({ id, title, author, date, content, likes, comments, category }: ThreadCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={author} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${author}`} className="font-medium hover:underline">
                {author}
              </Link>
              <p className="text-xs text-muted-foreground">{date}</p>
            </div>
          </div>
          <Badge variant="outline">{category}</Badge>
        </div>
        <CardTitle className="text-xl mt-3">
          <Link href={`/thread/${id}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
