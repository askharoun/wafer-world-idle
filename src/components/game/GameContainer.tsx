
import React, { useState, useEffect } from 'react';
import { GameProvider } from '../../contexts/GameContext';
import GameHeader from './GameHeader';
import ProductionLines from './ProductionLines';
import UpgradePanel from './UpgradePanel';
import StatsPanel from './StatsPanel';
import AchievementPanel from './AchievementPanel';
import PrestigePanel from './PrestigePanel';
import TutorialModal from './TutorialModal';
import EventModal from './EventModal';

const GameContainer = () => {
  const [showTutorial, setShowTutorial] = useState(true);

  const backgroundPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <div 
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: backgroundPattern }}
        ></div>
        
        <div className="relative z-10">
          <GameHeader />
          
          <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
              {/* Production Lines - Full width on mobile, 5 cols on large screens */}
              <div className="lg:col-span-5">
                <ProductionLines />
              </div>
              
              {/* Upgrades - Full width on mobile, 3 cols on large screens */}
              <div className="lg:col-span-3">
                <UpgradePanel />
              </div>
              
              {/* Stats and Achievements - Full width on mobile, 4 cols on large screens */}
              <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6">
                <PrestigePanel />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <StatsPanel />
                  <AchievementPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showTutorial && (
          <TutorialModal onClose={() => setShowTutorial(false)} />
        )}
        
        <EventModal />
      </div>
    </GameProvider>
  );
};

export default GameContainer;
