
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { Award, Check, Lock, DollarSign } from 'lucide-react';

const AchievementPanel = () => {
  const { gameState } = useGame();

  const visibleAchievements = gameState.achievements.slice(0, 5); // Show only first 5

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent flex items-center space-x-2">
        <Award className="w-6 h-6 text-amber-400" />
        <span>Achievements</span>
        <span className="text-sm text-gray-400">
          ({gameState.achievements.filter(a => a.unlocked).length}/{gameState.achievements.length})
        </span>
      </h2>
      
      <div className="space-y-3">
        {visibleAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              achievement.unlocked
                ? 'bg-green-500/20 border-green-500/30 animate-pulse-slow'
                : 'bg-gray-500/20 border-gray-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-bold ${achievement.unlocked ? 'text-green-300' : 'text-gray-300'}`}>
                {achievement.name}
              </h3>
              <div className="flex items-center space-x-2">
                {achievement.unlocked ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">{formatNumber(achievement.reward)}</span>
                </div>
              </div>
            </div>
            
            <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-green-200' : 'text-gray-400'}`}>
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-between mb-2">
              <div className={`text-xs ${achievement.unlocked ? 'text-green-400' : 'text-gray-500'}`}>
                Progress: {formatNumber(achievement.progress)}/{formatNumber(achievement.target)}
              </div>
              <div className={`text-xs ${achievement.unlocked ? 'text-green-400' : 'text-gray-500'}`}>
                {Math.min(100, Math.round((achievement.progress / achievement.target) * 100))}%
              </div>
            </div>
            
            <div className="bg-black/20 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  achievement.unlocked ? 'bg-green-400' : 'bg-gray-500'
                }`}
                style={{
                  width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        ))}

        {gameState.achievements.length > 5 && (
          <div className="text-center py-4 text-gray-400">
            <p className="text-sm">
              {gameState.achievements.length - 5} more achievements to unlock...
            </p>
          </div>
        )}

        {gameState.achievements.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start playing to unlock achievements!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementPanel;
