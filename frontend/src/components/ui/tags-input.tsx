import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

export const TagsInput = ({
  value: initialValue = [],
  onChange,
  ...props
}: {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  [key: string]: any;
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const isInternalChange = useRef(false);

  const updateTags = (newTags: string[]) => {
    isInternalChange.current = true;
    onChange?.(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      if (inputValue.trim() && !initialValue.includes(inputValue.trim())) {
        updateTags([...initialValue, inputValue.trim()]);
        setInputValue("");
      }
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      initialValue.length > 0
    ) {
      const newTags = [...initialValue];
      newTags.pop();
      updateTags(newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateTags(initialValue.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2 mb-2">
        {initialValue.map((tag, index) => (
          <Badge
            key={index}
            className="rounded-full bg-amber-200 px-2 py-1 flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={initialValue.length === 0 ? props.placeholder : ""}
      />
    </div>
  );
};
