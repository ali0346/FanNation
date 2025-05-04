
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSport } from "@/contexts/SportContext";
import { useThread } from "@/contexts/ThreadContext";

const CreateThreadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { sports } = useSport();
  const { createThread } = useThread();
  
  // Check if a sport was pre-selected (e.g., from a sport page)
  const initialSportId = location.state?.sportId || "";
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sportId: initialSportId,
  });
  
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/create-thread" } });
    return null;
  }
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }
    
    if (!formData.sportId) {
      newErrors.sportId = "Please select a sport category";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  const handleSportChange = (value: string) => {
    setFormData({ ...formData, sportId: value });
    
    // Clear error for this field if it exists
    if (errors.sportId) {
      setErrors({ ...errors, sportId: "" });
    }
  };
  
  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      
      if (!tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
      }
      
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newThread = await createThread({
        title: formData.title,
        content: formData.content,
        sportId: formData.sportId,
        tags,
      });
      
      navigate(`/thread/${newThread.id}`);
    } catch (error) {
      console.error("Failed to create thread:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Thread</CardTitle>
          <CardDescription>
            Share your thoughts, questions, or insights with the community
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Give your thread a descriptive title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            {/* Sport Category */}
            <div className="space-y-2">
              <Label htmlFor="sportId">Sport Category</Label>
              <Select
                value={formData.sportId}
                onValueChange={handleSportChange}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport category" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.icon} {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sportId && (
                <p className="text-sm text-red-500">{errors.sportId}</p>
              )}
            </div>
            
            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (up to 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} className="px-3 py-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Input
                id="tags"
                placeholder="Add tags (press Enter or comma to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                disabled={isSubmitting || tags.length >= 5}
              />
              <p className="text-xs text-muted-foreground">
                Press Enter or comma to add a tag. {5 - tags.length} tags remaining.
              </p>
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your thoughts here..."
                value={formData.content}
                onChange={handleChange}
                disabled={isSubmitting}
                className="min-h-[200px]"
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Thread"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateThreadPage;
