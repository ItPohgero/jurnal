'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  name: string;
  description: string;
  date: Date;
  photo: string;
}

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [photo, setPhoto] = useState('');
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      name,
      description,
      date,
      photo,
    };

    setEntries([...entries, newEntry]);
    setName('');
    setDescription('');
    setDate(new Date());
    setPhoto('');

    toast({
      title: "Success",
      description: "Journal entry added successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">My Journal</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Entry Title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Write your thoughts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[150px]"
                />
              </div>
              
              <div className="flex space-x-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle>{entry.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  {format(entry.date, "PPP")}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{entry.description}</p>
                {entry.photo && (
                  <img
                    src={entry.photo}
                    alt="Journal entry"
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}