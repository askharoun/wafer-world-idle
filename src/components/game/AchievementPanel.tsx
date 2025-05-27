
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { Award, Check, Lock, DollarSign, Gift } from 'lucide-react';

const AchievementPanel = () => {
  const { gameState, claimAchievement, getVisibleAchievements } = useGame();
  
  const visibleAchievements = getVisibleAchievements();

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
      <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent flex items-center space-x-2">
        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
        <span>Achievements</span>
        <span className="text-xs sm:text-sm text-gray-400">
          ({gameState.achievements.filter(a => a.unlocked).length}/{gameState.achievements.length})
        </span>
      </h2>
      
      <div className="space-y-3">
        {visibleAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
              achievement.unlocked && !achievement.claimed
                ? 'bg-green-500/30 border-green-500/50 shadow-lg shadow-green-500/20'
                : achievement.claimed
                ? 'bg-blue-500/20 border-blue-500/30'
                : achievement.unlocked
                ? 'bg-green-500/20 border-green-500/30'
                : 'bg-gray-500/20 border-gray-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-bold text-sm sm:text-base ${
                achievement.claimed 
                  ? 'text-blue-300' 
                  : achievement.unlocked 
                  ? 'text-green-300' 
                  : 'text-gray-300'
              }`}>
                {achievement.name}
              </h3>
              <div className="flex items-center space-x-2">
                {achievement.claimed ? (
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                ) : achievement.unlocked ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                ) : (
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                )}
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">{formatNumber(achievement.reward)}</span>
                </div>
              </div>
            </div>
            
            <p className={`text-xs sm:text-sm mb-3 ${
              achievement.claimed 
                ? 'text-blue-200' 
                : achievement.unlocked 
                ? 'text-green-200' 
                : 'text-gray-400'
            }`}>
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-between mb-2">
              <div className={`text-xs ${
                achievement.claimed 
                  ? 'text-blue-400' 
                  : achievement.unlocked 
                  ? 'text-green-400' 
                  : 'text-gray-500'
              }`}>
                Progress: {formatNumber(achievement.progress)}/{formatNumber(achievement.target)}
              </div>
              <div className={`text-xs ${
                achievement.claimed 
                  ? 'text-blue-400' 
                  : achievement.unlocked 
                  ? 'text-green-400' 
                  : 'text-gray-500'
              }`}>
                {Math.min(100, Math.round((achievement.progress / achievement.target) * 100))}%
              </div>
            </div>
            
            <div className="bg-black/20 rounded-full h-2 mb-3">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  achievement.claimed 
                    ? 'bg-blue-400' 
                    : achievement.unlocked 
                    ? 'bg-green-400' 
                    : 'bg-gray-500'
                }`}
                style={{
                  width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%`
                }}
              ></div>
            </div>

            {achievement.unlocked && !achievement.claimed && (
              <button
                onClick={() => claimAchievement(achievement.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 animate-pulse"
              >
                <Gift className="w-4 h-4" />
                <span className="text-sm">Claim Reward</span>
              </button>
            )}
          </div>
        ))}

        {visibleAchievements.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Start playing to unlock achievements!</p>
          </div>
        )}

        {visibleAchievements.length < gameState.achievements.length && (
          <div className="text-center py-4 text-gray-400">
            <p className="text-sm">
              {gameState.achievements.length - visibleAchievements.length} more achievements to discover...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementPanel;
