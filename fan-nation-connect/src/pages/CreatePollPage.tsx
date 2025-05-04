// src/pages/CreatePollPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePoll } from "@/contexts/PollContext";
import { toast } from "sonner";

type Sport = { id: number; name: string };

export default function CreatePollPage() {
  const { user, isAuthenticated } = useAuth();
  const { createPoll } = usePoll();
  const navigate = useNavigate();

  const [title, setTitle]         = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions]     = useState<string[]>(["", ""]);
  const [sportId, setSportId]     = useState<string>("");
  const [endDate, setEndDate]     = useState<Date>();
  const [sports, setSports]       = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isModOrAdmin = user?.role === "moderator" || user?.role === "admin";

  // load categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then((data: any[]) => {
        // category.id comes back as a number, so cast to number
        setSports(data.map(c => ({ id: c.id, name: c.name })));
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load sports");
      });
  }, []);

  // guard
  useEffect(() => {
    if (!isAuthenticated || !isModOrAdmin) {
      toast.error("You don't have permission to create polls");
      navigate("/");
    }
  }, [isAuthenticated, isModOrAdmin, navigate]);

  const handleAddOption = () => setOptions(opts => [...opts, ""]);
  const handleRemoveOption = (i: number) => {
    if (options.length <= 2) {
      return toast.error("A poll needs at least 2 options");
    }
    setOptions(opts => opts.filter((_, idx) => idx !== i));
  };
  const handleOptionChange = (i: number, v: string) => {
    setOptions(opts => {
      const copy = [...opts];
      copy[i] = v;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Enter a poll title");
    if (!sportId)       return toast.error("Select a sport category");

    const filled = options.map(o => o.trim()).filter(o => o);
    if (filled.length < 2) return toast.error("At least two options");
    if (new Set(filled.map(o => o.toLowerCase())).size < filled.length) {
      return toast.error("Options must be unique");
    }

    try {
      setIsLoading(true);
      await createPoll({
        title:       title.trim(),
        description: description.trim() || undefined,
        options:     filled,
        sportId,    // now a non‑empty string
        endDate:     endDate?.toISOString()
      });
      toast.success("Poll created!");
      navigate("/polls");
    } catch (err: any) {
      toast.error(err.message || "Failed to create poll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create New Poll</h1>

      <Card>
        <CardHeader><CardTitle>Poll Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Poll Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Your question"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="More context…"
              />
            </div>

            {/* Sport Category */}
            <div>
              <Label htmlFor="sport">Sport Category <span className="text-red-500">*</span></Label>
              <Select value={sportId} onValueChange={setSportId}>
                <SelectTrigger id="sport">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* End Date */}
            <div>
              <Label>End Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={d => d < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Options <span className="text-red-500">*</span></Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={opt}
                    onChange={e => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(i)}
                    disabled={options.length <= 2}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating…" : "Create Poll"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
