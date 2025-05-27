
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { Zap, TrendingUp, Award, Settings } from 'lucide-react';

const GameHeader = () => {
  const { gameState } = useGame();

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🏭 SiliconFab Empire
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                <div className="text-sm text-green-400">Total Money</div>
                <div className="text-xl font-bold text-green-300">
                  ${formatNumber(gameState.money)}
                </div>
              </div>
              
              <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
                <div className="text-sm text-blue-400">Total Earned</div>
                <div className="text-xl font-bold text-blue-300">
                  ${formatNumber(gameState.totalEarned)}
                </div>
              </div>
              
              {gameState.prestigeLevel > 0 && (
                <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
                  <div className="text-sm text-purple-400">Prestige Level</div>
                  <div className="text-xl font-bold text-purple-300">
                    {gameState.prestigeLevel}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-yellow-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Market: {(gameState.marketMultiplier * 100).toFixed(0)}%</span>
            </div>
            
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
