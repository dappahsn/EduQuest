import { useGame } from '../context/GameContext';

export function useGameState() {
  return useGame();
}
