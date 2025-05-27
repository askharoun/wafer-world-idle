
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { TrendingUp, TrendingDown, Settings, Save, Crown, Star } from 'lucide-react';
import SettingsModal from './SettingsModal';

const GameHeader = () => {
  const { gameState, saveGame } = useGame();
  const [showSettings, setShowSettings] = useState(false);

  const getMarketTrend = () => {
    if (gameState.marketMultiplier > 1.1) return { icon: TrendingUp, color: 'text-green-400', text: 'Bullish' };
    if (gameState.marketMultiplier < 0.9) return { icon: TrendingDown, color: 'text-red-400', text: 'Bearish' };
    return { icon: TrendingUp, color: 'text-yellow-400', text: 'Stable' };
  };

  const trend = getMarketTrend();
  const TrendIcon = trend.icon;

  return (
    <>
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🏭 SiliconFab Empire
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                  <div className="text-sm text-green-400">Current Money</div>
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
                    <div className="text-sm text-purple-400 flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>Prestige</span>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      Level {gameState.prestigeLevel}
                    </div>
                  </div>
                )}

                {gameState.prestigeTokens > 0 && (
                  <div className="bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30">
                    <div className="text-sm text-yellow-400 flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Tokens</span>
                    </div>
                    <div className="text-xl font-bold text-yellow-300">
                      {gameState.prestigeTokens}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${trend.color}`}>
                <TrendIcon className="w-5 h-5" />
                <div className="text-right">
                  <div className="text-sm">Market: {trend.text}</div>
                  <div className="font-bold">{(gameState.marketMultiplier * 100).toFixed(0)}%</div>
                </div>
              </div>

              <button
                onClick={saveGame}
                className="p-2 hover:bg-green-500/20 rounded-lg transition-colors group"
                title="Save Game"
              >
                <Save className="w-5 h-5 text-green-400 group-hover:text-green-300" />
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default GameHeader;
