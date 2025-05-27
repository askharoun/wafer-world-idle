
import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { Zap, Timer } from 'lucide-react';

const BoostButton = () => {
  const { gameState, dispatch } = useGame();
  const { playClick, playPurchase } = useSoundEffects();
  const [cooldown, setCooldown] = useState(0);

  const boostCost = Math.floor(gameState.money * 0.1); // 10% of current money
  const canAfford = gameState.money >= boostCost && cooldown === 0;

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const activateBoost = () => {
    if (!canAfford) return;
    
    playPurchase();
    dispatch({ type: 'UPDATE_MONEY', payload: gameState.money - boostCost });
    dispatch({ type: 'ACTIVATE_BOOST' });
    setCooldown(60); // 60 second cooldown
    
    setTimeout(() => {
      dispatch({ type: 'DEACTIVATE_BOOST' });
    }, 30000);
  };

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold text-yellow-300">Production Boost</h3>
        </div>
        {gameState.boostActive && (
          <div className="flex items-center space-x-1 text-green-400">
            <Timer className="w-4 h-4" />
            <span className="text-sm font-bold">ACTIVE</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-300 mb-4">
        {gameState.boostActive 
          ? 'Production increased by 300% for 30 seconds!'
          : 'Pay 10% of current money for 30 seconds of 3x production boost'
        }
      </p>
      
      {cooldown > 0 ? (
        <div className="bg-gray-600 py-3 rounded-lg text-center">
          <span className="text-gray-300">Cooldown: {cooldown}s</span>
        </div>
      ) : (
        <button
          onClick={activateBoost}
          disabled={!canAfford || gameState.boostActive}
          className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
            canAfford && !gameState.boostActive
              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 transform hover:scale-105'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          }`}
        >
          {gameState.boostActive ? 'Boost Active' : `Activate Boost ($${boostCost.toLocaleString()})`}
        </button>
      )}
    </div>
  );
};

export default BoostButton;
