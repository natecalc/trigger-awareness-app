import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { allEmotions } from "@/helpers/colors";

interface Emotion {
  name: string;
  color: string;
  textColor: string;
}

const EmotionSelector = ({
  onChange,
}: {
  onChange?: (value: string[]) => void;
}) => {
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectEmotion = (emotion: Emotion) => {
    if (!selectedEmotions.find((e) => e.name === emotion.name)) {
      const newSelection = [...selectedEmotions, emotion] as Emotion[];
      setSearchTerm("");
      setSelectedEmotions(newSelection);
      onChange?.(newSelection.map((e) => e.name));
    }
  };

  const handleRemoveEmotion = (emotionName: string) => {
    const newSelection = selectedEmotions.filter((e) => e.name !== emotionName);
    setSelectedEmotions(newSelection);
    onChange?.(newSelection.map((e) => e.name));
  };

  const filteredEmotions = allEmotions.filter(
    (emotion) =>
      emotion.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedEmotions.find((e) => e.name === emotion.name)
  );

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>How are you feeling?</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedEmotions([])}
          >
            Clear All
          </Button>
        </div>
        <CardDescription>
          Select all emotions that best describe how you feel about this trigger
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Selected Emotions Section */}
        {selectedEmotions.length > 0 && (
          <section className="mb-6">
            <h3 className="text-sm font-medium mb-2">Selected Emotions:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedEmotions.map((emotion) => (
                <Badge
                  key={emotion.name}
                  className={`${emotion.color} ${emotion.textColor} flex items-center gap-1 px-3 py-1`}
                >
                  {emotion.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleRemoveEmotion(emotion.name)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Search Input */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search emotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        </div>

        <ScrollArea className="h-48 w-full mb-4">
          {/* Available Emotions */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredEmotions.map((emotion) => (
              <Button
                key={emotion.name}
                variant="outline"
                className={`h-auto py-2 ${emotion.color}`}
                onClick={() => {
                  handleSelectEmotion(emotion);
                }}
              >
                <span className={`${emotion.textColor}`}>{emotion.name}</span>
              </Button>
            ))}
            {filteredEmotions.length === 0 && (
              <div className="col-span-full text-center py-4 text-muted-foreground">
                {searchTerm
                  ? "No matching emotions found"
                  : "All emotions have been selected"}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EmotionSelector;
