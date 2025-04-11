
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/20 rounded-xl p-4 shadow-lg">
        <Textarea
          placeholder="Create a campaign or workflow..."
          className="bg-transparent border-none resize-none text-foreground text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        
        <div className="flex justify-end items-center mt-2 pt-2">
          <Button 
            size="sm" 
            className="bg-primary/80 hover:bg-primary text-primary-foreground rounded-full w-8 h-8 p-0"
            onClick={handleSubmit}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
