
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/gameUtils';
import { Play, User, ShoppingCart } from 'lucide-react';

interface ProductionLineCardProps {
  line: {
    id: string;
    name: string;
    description: string;
    baseProduction: number;
    baseCost: number;
    owned: number;
    managerHired: boolean;
    managerCost: number;
    level: number;
    icon: string;
    color: string;
  };
}

const ProductionLineCard: React.FC<ProductionLineCardProps> = ({ line }) => {
  const { gameState, buyProductionLine, hireManager, clickProduction } = useGame();
  const [isAnimating, setIsAnimating] = useState(false);

  const cost = line.baseCost * Math.pow(1.15, line.owned);
  const canAfford = gameState.money >= cost;
  const canAffordManager = gameState.money >= line.managerCost;
  const production = line.baseProduction * line.level * gameState.marketMultiplier;

  const handleClick = () => {
    if (line.owned > 0) {
      setIsAnimating(true);
      clickProduction(line.id);
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const handleBuy = () => {
    if (canAfford) {
      buyProductionLine(line.id);
    }
  };

  const handleHireManager = () => {
    if (canAffordManager && !line.managerHired) {
      hireManager(line.id);
    }
  };

  return (
    <div className={`bg-gradient-to-r ${line.color} p-1 rounded-xl transform hover:scale-[1.02] transition-all duration-300`}>
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className={`text-4xl cursor-pointer transform transition-transform duration-200 ${
                isAnimating ? 'scale-125' : 'hover:scale-110'
              }`}
              onClick={handleClick}
            >
              {line.icon}
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white">{line.name}</h3>
              <p className="text-gray-300 text-sm">{line.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-green-400 font-semibold">
                  Owned: {line.owned}
                </span>
                <span className="text-blue-400 font-semibold">
                  Production: ${formatNumber(production)}/s
                </span>
                {line.level > 1 && (
                  <span className="text-purple-400 font-semibold">
                    Level: {line.level}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {line.owned > 0 && !line.managerHired && (
              <button
                onClick={handleClick}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Click</span>
              </button>
            )}
            
            {line.owned > 0 && !line.managerHired && (
              <button
                onClick={handleHireManager}
                disabled={!canAffordManager}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  canAffordManager
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>${formatNumber(line.managerCost)}</span>
              </button>
            )}
            
            {line.managerHired && (
              <div className="bg-green-500/20 px-3 py-2 rounded-lg border border-green-500/30">
                <span className="text-green-400 text-sm font-semibold">AUTO</span>
              </div>
            )}
            
            <button
              onClick={handleBuy}
              disabled={!canAfford}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center space-x-2 ${
                canAfford
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>${formatNumber(cost)}</span>
            </button>
          </div>
        </div>
        
        {line.managerHired && line.owned > 0 && (
          <div className="mt-4 bg-black/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Auto-producing every second</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">
                  +${formatNumber(production * line.owned)}/s
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionLineCard;
