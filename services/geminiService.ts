
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import type { GameState, PlayerState, GeminiApiResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-3-flash-preview';

const systemInstruction = `You are an immersive and creative D&D-style Game Master for an interactive text adventure game.
Your role is to:
1.  **World Building**: Create a rich, detailed fantasy world with vivid descriptions of locations, atmospheres, and environmental details. The world should be consistent.
2.  **Dynamic Storytelling**: Respond to player actions with creative, logical consequences. Track game state and adapt the story. Introduce plot twists.
3.  **NPC Interactions**: Create distinct personalities for NPCs. Remember past interactions.
4.  **Game Mechanics**: Implement a simple combat system (player health), inventory management, and puzzles. A player starts with 100 health.
5.  **Pacing and Engagement**: Keep responses concise (2-4 paragraphs) but immersive. End each response with 2-4 distinct action options for the player.
6.  **World Consistency**: Track all established lore, character relationships, and plot points. Reference previous events naturally.

**RESPONSE FORMAT**:
You MUST respond with a single valid JSON object. Do NOT wrap it in markdown backticks. The JSON object must conform to this structure:
{
  "narrative": "A multi-paragraph, immersive description of the current scene and the results of the player's last action.",
  "location": "The player's current location (e.g., 'Whispering Caves', 'Aethelgard City Gates').",
  "player": {
    "health": <number>, // The player's current health. Must be a number.
    "inventory": ["<item1>", "<item2>"] // An array of strings representing the player's inventory.
  },
  "choices": ["<choice1>", "<choice2>", "<choice3>"] // An array of 2-4 strings for the player's next actions.
}

**STARTING SCENARIO**:
The player awakens in a dimly lit, moss-covered stone chamber with no memory of how they arrived. A single, heavy oak door stands before them, bound by rusty iron. The air is cold and smells of damp earth and something faintly metallic. A faint, rhythmic dripping sound echoes from somewhere in the darkness.`;


const parseGeminiResponse = (responseText: string): { newGameState: GameState; newPlayerState: PlayerState } => {
    try {
        // Clean the response text by removing potential markdown backticks
        const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed: GeminiApiResponse = JSON.parse(cleanText);

        const newGameState: GameState = {
            narrative: parsed.narrative,
            location: parsed.location,
            choices: parsed.choices || [],
        };

        const newPlayerState: PlayerState = {
            health: parsed.player.health,
            maxHealth: 100, // Assuming max health is always 100
            inventory: parsed.player.inventory || [],
        };
        
        return { newGameState, newPlayerState };
    } catch (error) {
        console.error("Failed to parse Gemini response:", error);
        console.error("Raw response text:", responseText);
        throw new Error("The story took an unexpected turn. The world seems to have shifted in a way you can't comprehend. Please try a different action.");
    }
};

export const startGame = async () => {
    const chat: Chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: "Begin the adventure." });
    
    if (!response.text) {
        throw new Error("The world failed to materialize. Please try again.");
    }

    const { newGameState: initialGameState, newPlayerState: initialPlayerState } = parseGeminiResponse(response.text);

    return { chat, initialGameState, initialPlayerState };
};

export const processPlayerAction = async (chat: Chat, action: string) => {
    const response: GenerateContentResponse = await chat.sendMessage({ message: action });

    if (!response.text) {
         throw new Error("Your action echoed into silence. The world did not respond.");
    }
    
    return parseGeminiResponse(response.text);
};
