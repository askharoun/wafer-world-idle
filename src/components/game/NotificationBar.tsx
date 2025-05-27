
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { Crown, Zap, Bell } from 'lucide-react';

const NotificationBar = () => {
  const { gameState, prestige, buyUpgrade } = useGame();

  const canPrestige = gameState.totalEarned >= 10000000;
  const prestigeTokensToGain = Math.floor(gameState.totalEarned / 10000000);
  
  const availableUpgrades = gameState.upgrades.filter(upgrade => 
    !upgrade.purchased && gameState.money >= upgrade.cost
  );

  if (!canPrestige && availableUpgrades.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      {canPrestige && (
        <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="font-bold text-purple-300">Ready to Prestige!</h3>
                <p className="text-sm text-purple-200">
                  Gain {prestigeTokensToGain} prestige tokens and unlock permanent upgrades
                </p>
              </div>
            </div>
            <button
              onClick={prestige}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-6 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
            >
              Prestige
            </button>
          </div>
        </div>
      )}

      {availableUpgrades.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-400/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="font-bold text-yellow-300">Upgrades Available!</h3>
                <p className="text-sm text-yellow-200">
                  {availableUpgrades.length} upgrade{availableUpgrades.length > 1 ? 's' : ''} ready to purchase
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-yellow-400 animate-bounce" />
              <span className="text-yellow-300 font-bold">{availableUpgrades.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
