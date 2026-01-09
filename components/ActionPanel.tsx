
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ActionPanelProps {
  choices: string[];
  onAction: (action: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ choices, onAction, isLoading, error }) => {
  const [customAction, setCustomAction] = useState('');

  const handleCustomActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim() && !isLoading) {
      onAction(customAction.trim());
      setCustomAction('');
    }
  };

  return (
    <div className="mt-auto pt-4 border-t border-neutral-800">
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <LoadingSpinner message="The world is reacting..." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onAction(choice)}
                disabled={isLoading}
                className="w-full text-left bg-neutral-800 hover:bg-amber-900 text-amber-300 font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
              >
                {choice}
              </button>
            ))}
          </div>
          <form onSubmit={handleCustomActionSubmit} className="flex gap-3">
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="Or type your own action..."
              disabled={isLoading}
              className="flex-grow bg-black border border-neutral-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-200 placeholder-neutral-500"
            />
            <button
              type="submit"
              disabled={isLoading || !customAction.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go
            </button>
          </form>
          {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
        </>
      )}
    </div>
  );
};

export default ActionPanel;
