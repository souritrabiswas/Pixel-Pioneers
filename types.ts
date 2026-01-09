
export interface PlayerState {
  health: number;
  maxHealth: number;
  inventory: string[];
}

export interface GameState {
  narrative: string;
  location: string;
  choices: string[];
}

export interface GeminiApiResponse {
  narrative: string;
  player: {
    health: number;
    inventory: string[];
  };
  location: string;
  choices: string[];
}
