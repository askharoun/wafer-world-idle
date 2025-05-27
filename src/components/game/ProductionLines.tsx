
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import ProductionLineCard from './ProductionLineCard';

const ProductionLines = () => {
  const { gameState } = useGame();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-center">
        Production Lines
      </h2>
      
      <div className="space-y-4">
        {gameState.productionLines.map((line) => (
          <ProductionLineCard key={line.id} line={line} />
        ))}
      </div>
    </div>
  );
};

export default ProductionLines;
