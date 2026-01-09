
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, PlayerState } from './types';
import { startGame, processPlayerAction } from './services/geminiService';
import GameScreen from './components/GameScreen';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<any>(null);

  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { chat, initialGameState, initialPlayerState } = await startGame();
      chatRef.current = chat;
      setGameState(initialGameState);
      setPlayerState(initialPlayerState);
    } catch (err) {
      console.error(err);
      setError('Failed to start a new adventure. Please check your API key and refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (action: string) => {
    if (!chatRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Add player action to narrative immediately for better UX
    setGameState(prevState => prevState ? ({
      ...prevState,
      narrative: `${prevState.narrative}\n\n> ${action}`
    }) : null);


    try {
      const { newGameState, newPlayerState } = await processPlayerAction(chatRef.current, action);
      setGameState(newGameState);
      setPlayerState(newPlayerState);
    } catch (err) {
      console.error(err);
      setError('The story took an unexpected turn, and the connection was lost. Try another action.');
       // Revert optimistic update on error
      setGameState(prevState => prevState ? ({
        ...prevState,
        narrative: prevState.narrative.substring(0, prevState.narrative.lastIndexOf('\n\n>'))
      }) : null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setGameState(null);
    setPlayerState(null);
    chatRef.current = null;
    initializeGame();
  };

  if (!gameState || !playerState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
        {isLoading && <LoadingSpinner message="Forging a new world..." />}
        {error && (
           <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>
            <p>{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                Refresh Page
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 font-serif">
       <header className="flex justify-between items-center mb-4 pb-2 border-b-2 border-amber-700/50">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-500 tracking-wider">Pixel Pioneers</h1>
        <button
          onClick={handleRestart}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          New Game
        </button>
      </header>
      <GameScreen
        gameState={gameState}
        playerState={playerState}
        onAction={handleAction}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default App;
