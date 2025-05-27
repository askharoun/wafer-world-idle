
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { Zap, TrendingUp } from 'lucide-react';

const UpgradePanel = () => {
  const { gameState, buyUpgrade } = useGame();

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center space-x-2">
        <Zap className="w-6 h-6 text-yellow-400" />
        <span>Upgrades</span>
      </h2>
      
      <div className="space-y-4">
        {gameState.upgrades.filter(upgrade => !upgrade.purchased).map((upgrade) => {
          const canAfford = gameState.money >= upgrade.cost;
          
          return (
            <div
              key={upgrade.id}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/30"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-yellow-300">{upgrade.name}</h3>
                <div className="flex items-center space-x-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">{upgrade.multiplier}x</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{upgrade.description}</p>
              
              <button
                onClick={() => buyUpgrade(upgrade.id)}
                disabled={!canAfford}
                className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
                  canAfford
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 transform hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                Buy for ${formatNumber(upgrade.cost)}
              </button>
            </div>
          );
        })}
        
        {gameState.upgrades.every(u => u.purchased) && (
          <div className="text-center py-8 text-gray-400">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>All upgrades purchased!</p>
            <p className="text-sm">More upgrades coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradePanel;
