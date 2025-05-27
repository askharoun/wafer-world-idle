
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { Crown, Star, RefreshCw, TrendingUp } from 'lucide-react';

const PrestigePanel = () => {
  const { gameState, prestige, buyPrestigeUpgrade } = useGame();

  const canPrestige = gameState.totalEarned >= 10000000; // 10M
  const prestigeTokensToGain = Math.floor(gameState.totalEarned / 10000000);

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center space-x-2">
        <Crown className="w-6 h-6 text-purple-400" />
        <span>Prestige System</span>
      </h2>

      {gameState.prestigeLevel > 0 && (
        <div className="mb-6 bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-300">Current Prestige Level</span>
            <div className="flex items-center space-x-1">
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-purple-200">{gameState.prestigeLevel}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-300">Prestige Tokens</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-200">{gameState.prestigeTokens}</span>
            </div>
          </div>
        </div>
      )}

      {canPrestige && (
        <div className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
          <h3 className="font-bold text-purple-300 mb-2">Ready for Prestige!</h3>
          <p className="text-sm text-gray-300 mb-4">
            Reset your progress to gain <span className="text-yellow-400 font-bold">{prestigeTokensToGain}</span> prestige tokens
            and unlock powerful permanent upgrades!
          </p>
          <button
            onClick={prestige}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Prestige (+{prestigeTokensToGain} tokens)</span>
          </button>
        </div>
      )}

      {!canPrestige && gameState.prestigeLevel === 0 && (
        <div className="mb-6 bg-gray-500/20 p-4 rounded-lg border border-gray-500/30">
          <h3 className="font-bold text-gray-300 mb-2">Prestige Locked</h3>
          <p className="text-sm text-gray-400">
            Earn ${formatNumber(10000000)} to unlock prestige system.
            <br />
            Progress: ${formatNumber(gameState.totalEarned)} / ${formatNumber(10000000)}
          </p>
          <div className="mt-2 bg-black/20 rounded-full h-2">
            <div
              className="h-full bg-purple-400 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (gameState.totalEarned / 10000000) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-purple-300 flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Permanent Upgrades</span>
        </h3>

        {gameState.prestigeUpgrades.map((upgrade) => {
          const canAfford = gameState.prestigeTokens >= upgrade.cost;
          
          return (
            <div
              key={upgrade.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                upgrade.purchased
                  ? 'bg-green-500/20 border-green-500/30 opacity-75'
                  : canAfford
                  ? 'bg-purple-500/20 border-purple-500/30'
                  : 'bg-gray-500/20 border-gray-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-bold ${
                  upgrade.purchased ? 'text-green-300' : 'text-purple-300'
                }`}>
                  {upgrade.name}
                </h4>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-300">
                    {upgrade.multiplier}x
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{upgrade.description}</p>
              
              {upgrade.purchased ? (
                <div className="bg-green-500/20 py-2 rounded text-center text-green-300 font-bold">
                  OWNED
                </div>
              ) : (
                <button
                  onClick={() => buyPrestigeUpgrade(upgrade.id)}
                  disabled={!canAfford}
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
                    canAfford
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transform hover:scale-105'
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>{upgrade.cost} Tokens</span>
                  </div>
                </button>
              )}
            </div>
          );
        })}

        {gameState.prestigeUpgrades.every(u => u.purchased) && (
          <div className="text-center py-8 text-purple-400">
            <Crown className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>All prestige upgrades purchased!</p>
            <p className="text-sm">You are a true Silicon Emperor!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrestigePanel;
