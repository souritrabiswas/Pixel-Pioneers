
import React from 'react';
import type { PlayerState } from '../types';
import { HealthIcon, InventoryIcon, LocationIcon } from './icons';

interface PlayerStatusProps {
  playerState: PlayerState;
  location: string;
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({ playerState, location }) => {
  const healthPercentage = (playerState.health / playerState.maxHealth) * 100;
  
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-neutral-900/75 p-4 sm:p-6 rounded-lg shadow-2xl border border-neutral-800 space-y-6 sticky top-6">
      <div>
        <h3 className="flex items-center text-lg font-bold text-amber-500 mb-3">
            <LocationIcon className="h-5 w-5 mr-2" />
            Location
        </h3>
        <p className="text-neutral-300">{location}</p>
      </div>

      <div>
        <h3 className="flex items-center text-lg font-bold text-amber-500 mb-3">
            <HealthIcon className="h-5 w-5 mr-2" />
            Health
        </h3>
        <div className="w-full bg-neutral-800 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${getHealthColor()}`}
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
        <p className="text-center text-sm font-bold mt-1 text-neutral-200">{playerState.health} / {playerState.maxHealth}</p>
      </div>

      <div>
        <h3 className="flex items-center text-lg font-bold text-amber-500 mb-3">
          <InventoryIcon className="h-5 w-5 mr-2" />
          Inventory
        </h3>
        {playerState.inventory.length > 0 ? (
          <ul className="space-y-2">
            {playerState.inventory.map((item, index) => (
              <li key={index} className="bg-neutral-800/50 p-2 rounded-md text-neutral-300">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500 italic">Your pockets are empty.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerStatus;
