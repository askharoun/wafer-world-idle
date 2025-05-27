
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { BarChart3, Zap, Award, RefreshCw } from 'lucide-react';

const StatsPanel = () => {
  const { gameState, prestige } = useGame();

  const totalProduction = gameState.productionLines.reduce((total, line) => {
    if (line.owned > 0 && line.managerHired) {
      return total + (line.baseProduction * line.owned * line.level * gameState.marketMultiplier);
    }
    return total;
  }, 0);

  const canPrestige = gameState.totalEarned >= 1000000;
  const prestigeTokens = Math.floor(gameState.totalEarned / 1000000);

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent flex items-center space-x-2">
        <BarChart3 className="w-6 h-6 text-cyan-400" />
        <span>Statistics</span>
      </h2>
      
      <div className="space-y-4">
        <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-blue-300">Income per Second</span>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-blue-200">${formatNumber(totalProduction)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
          <div className="flex items-center justify-between">
            <span className="text-green-300">Total Facilities</span>
            <span className="font-bold text-green-200">
              {gameState.productionLines.reduce((total, line) => total + line.owned, 0)}
            </span>
          </div>
        </div>
        
        <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-purple-300">Managers Hired</span>
            <span className="font-bold text-purple-200">
              {gameState.productionLines.filter(line => line.managerHired).length}
            </span>
          </div>
        </div>
        
        {gameState.prestigeTokens > 0 && (
          <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <span className="text-yellow-300">Prestige Tokens</span>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-yellow-200">{gameState.prestigeTokens}</span>
              </div>
            </div>
          </div>
        )}
        
        {canPrestige && (
          <button
            onClick={prestige}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Prestige (+{prestigeTokens} tokens)</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
