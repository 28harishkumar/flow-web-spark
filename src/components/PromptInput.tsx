
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PaperclipIcon, Import, Lock, ArrowUp } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const suggestionOptions = [
    "Crypto portfolio tracker",
    "E-commerce store",
    "Developer portfolio",
    "VitePress docs"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <Textarea
          placeholder="Ask Lovable to create a prototype..."
          className="bg-transparent border-none resize-none text-white text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        
        <div className="flex justify-between items-center mt-2 pt-2">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <PaperclipIcon className="w-5 h-5 mr-1" /> Attach
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Import className="w-5 h-5 mr-1" /> Import
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsPrivate(!isPrivate)}
            >
              <Lock className="w-5 h-5 mr-1" /> Private
            </Button>
            <Button 
              size="sm" 
              className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 p-0"
              onClick={handleSubmit}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        {suggestionOptions.map((option) => (
          <Button
            key={option}
            variant="outline"
            className="bg-black/30 text-white border-gray-700 hover:bg-black/50"
            onClick={() => setPrompt(option)}
          >
            {option} <ArrowUp className="ml-2 w-4 h-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PromptInput;
