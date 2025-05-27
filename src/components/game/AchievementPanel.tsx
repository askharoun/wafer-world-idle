
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Award, Check } from 'lucide-react';

const AchievementPanel = () => {
  const { gameState } = useGame();

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent flex items-center space-x-2">
        <Award className="w-6 h-6 text-amber-400" />
        <span>Achievements</span>
      </h2>
      
      <div className="space-y-3">
        {gameState.achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              achievement.unlocked
                ? 'bg-green-500/20 border-green-500/30'
                : 'bg-gray-500/20 border-gray-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-bold ${achievement.unlocked ? 'text-green-300' : 'text-gray-300'}`}>
                {achievement.name}
              </h3>
              {achievement.unlocked && (
                <Check className="w-5 h-5 text-green-400" />
              )}
            </div>
            
            <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-green-200' : 'text-gray-400'}`}>
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className={`text-xs ${achievement.unlocked ? 'text-green-400' : 'text-gray-500'}`}>
                Progress: {achievement.progress}/{achievement.target}
              </div>
              <div className={`text-xs font-semibold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                Reward: ${achievement.reward}
              </div>
            </div>
            
            <div className="mt-2 bg-black/20 rounded-full h-2">
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
      </div>
    </div>
  );
};

export default AchievementPanel;
