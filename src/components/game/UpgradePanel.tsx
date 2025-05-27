
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

const UpgradePanel = () => {
  const { gameState, buyUpgrade } = useGame();

  const availableUpgrades = gameState.upgrades.filter(upgrade => !upgrade.purchased);
  const purchasedUpgrades = gameState.upgrades.filter(upgrade => upgrade.purchased);

  return (
    <div className="w-full bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center space-x-2">
        <Zap className="w-6 h-6 text-yellow-400" />
        <span>Upgrades</span>
        <span className="text-sm text-gray-400">
          ({purchasedUpgrades.length}/{gameState.upgrades.length})
        </span>
      </h2>
      
      {availableUpgrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {availableUpgrades.map((upgrade) => {
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
        </div>
      ) : (
        <div className="text-center py-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-400" />
          <h3 className="text-2xl font-bold text-green-300 mb-2">All Upgrades Purchased!</h3>
          <p className="text-green-200">You've mastered the art of silicon production!</p>
          <p className="text-sm text-green-300 mt-2">Keep growing your empire and unlock prestige upgrades!</p>
        </div>
      )}
    </div>
  );
};

export default UpgradePanel;
