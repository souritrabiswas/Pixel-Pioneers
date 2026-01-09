
import React, { useEffect, useRef } from 'react';

interface StoryDisplayProps {
  narrative: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ narrative }) => {
  const endOfStoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfStoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [narrative]);

  return (
    <div className="flex-grow overflow-y-auto h-96 lg:h-[calc(100vh-250px)] pr-2 mb-4 custom-scrollbar">
      {narrative.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4 text-neutral-300 leading-relaxed">
          {paragraph.startsWith('>') ? (
            <span className="text-amber-400 italic">{paragraph}</span>
          ) : (
            paragraph
          )}
        </p>
      ))}
      <div ref={endOfStoryRef} />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #171717; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #525252;
          border-radius: 10px;
          border: 2px solid #171717;
        }
      `}</style>
    </div>
  );
};

export default StoryDisplay;
