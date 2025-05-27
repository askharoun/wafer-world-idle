
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { MousePointer, TrendingUp } from 'lucide-react';

const MegaClickButton = () => {
  const { gameState, clickProduction } = useGame();
  const { playClick, playProduction } = useSoundEffects();

  const handleMegaClick = () => {
    playClick();
    playProduction();
    
    // Click all production lines at once
    gameState.productionLines.forEach(line => {
      if (line.owned > 0) {
        clickProduction(line.id);
      }
    });
  };

  const hasProduction = gameState.productionLines.some(line => line.owned > 0);

  return (
    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-lg border border-cyan-500/30">
      <div className="flex items-center space-x-2 mb-3">
        <MousePointer className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold text-cyan-300">Mega Click</h3>
        <TrendingUp className="w-4 h-4 text-green-400" />
      </div>
      
      <p className="text-sm text-gray-300 mb-4">
        Click all production lines at once for massive instant income!
      </p>
      
      <button
        onClick={handleMegaClick}
        disabled={!hasProduction}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
          hasProduction
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 animate-pulse'
            : 'bg-gray-600 cursor-not-allowed opacity-50'
        }`}
      >
        🚀 MEGA CLICK 🚀
      </button>
    </div>
  );
};

export default MegaClickButton;
