
import React from 'react';
import type { GameState, PlayerState } from '../types';
import StoryDisplay from './StoryDisplay';
import ActionPanel from './ActionPanel';
import PlayerStatus from './PlayerStatus';

interface GameScreenProps {
  gameState: GameState;
  playerState: PlayerState;
  onAction: (action: string) => void;
  isLoading: boolean;
  error: string | null;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, playerState, onAction, isLoading, error }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="bg-neutral-900/75 p-4 sm:p-6 rounded-lg shadow-2xl border border-neutral-800 h-full flex flex-col">
          <StoryDisplay narrative={gameState.narrative} />
          <ActionPanel choices={gameState.choices} onAction={onAction} isLoading={isLoading} error={error} />
        </div>
      </div>
      <div className="lg:col-span-1">
        <PlayerStatus playerState={playerState} location={gameState.location} />
      </div>
    </div>
  );
};

export default GameScreen;
