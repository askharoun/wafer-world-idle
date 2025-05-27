
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { BarChart3, Zap, Users, Factory, Clock, DollarSign } from 'lucide-react';

const StatsPanel = () => {
  const { gameState } = useGame();

  const totalProduction = gameState.productionLines.reduce((total, line) => {
    if (line.owned > 0 && line.managerHired) {
      const eventMultiplier = gameState.currentEvent?.multiplier || 1;
      return total + (line.baseProduction * line.owned * line.level * gameState.marketMultiplier * eventMultiplier);
    }
    return total;
  }, 0);

  const totalFacilities = gameState.productionLines.reduce((total, line) => total + line.owned, 0);
  const managersHired = gameState.productionLines.filter(line => line.managerHired).length;
  const upgradesPurchased = gameState.upgrades.filter(u => u.purchased).length;
  const achievementsUnlocked = gameState.achievements.filter(a => a.unlocked).length;

  const timeElapsed = Date.now() - gameState.gameStartTime;
  const hoursPlayed = Math.floor(timeElapsed / (1000 * 60 * 60));
  const minutesPlayed = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));

  const stats = [
    {
      label: 'Income/Second',
      value: `$${formatNumber(totalProduction)}`,
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Total Facilities',
      value: totalFacilities.toString(),
      icon: Factory,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      label: 'Managers Hired',
      value: `${managersHired}/6`,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      label: 'Upgrades Owned',
      value: upgradesPurchased.toString(),
      icon: BarChart3,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      label: 'Achievements',
      value: `${achievementsUnlocked}/${gameState.achievements.length}`,
      icon: DollarSign,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30'
    },
    {
      label: 'Time Played',
      value: `${hoursPlayed}h ${minutesPlayed}m`,
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    }
  ];

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent flex items-center space-x-2">
        <BarChart3 className="w-6 h-6 text-cyan-400" />
        <span>Live Statistics</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} p-4 rounded-lg border ${stat.borderColor} transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  <span className={`text-sm ${stat.color}`}>{stat.label}</span>
                </div>
                <span className="font-bold text-white text-lg">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Event Display */}
      {gameState.currentEvent && (
        <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-300 font-bold">🎯 Active Event</span>
            <span className="text-orange-300 text-sm">{gameState.currentEvent.effect}</span>
          </div>
          <p className="text-white text-sm">{gameState.currentEvent.title}</p>
        </div>
      )}

      {/* Efficiency Display */}
      <div className="mt-6 bg-gray-500/20 p-4 rounded-lg border border-gray-500/30">
        <h3 className="text-gray-300 font-bold mb-2">Production Efficiency</h3>
        <div className="space-y-2">
          {gameState.productionLines.map((line) => {
            if (line.owned === 0) return null;
            const efficiency = line.managerHired ? 100 : 0;
            return (
              <div key={line.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{line.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-black/20 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        efficiency === 100 ? 'bg-green-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${efficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-300 w-8">{efficiency}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
