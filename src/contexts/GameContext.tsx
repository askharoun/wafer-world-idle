import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Define the types for upgrades, production lines, market conditions, and achievements
interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: number;
  owned: number;
  maxLevel: number;
  affects: string;
  unlockCondition?: {
    type: string;
    value: number;
  };
}

interface ProductionLine {
  id: string;
  name: string;
  cost: number;
  production: number;
  owned: number;
}

interface MarketCondition {
  id: string;
  name: string;
  efficiency: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  reward: number;
  target: number;
  type: string;
  progress: number;
  unlocked: boolean;
  claimed: boolean;
}

interface GameSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
}

interface GameState {
  money: number;
  totalEarned: number;
  totalSpent: number;
  productionLines: ProductionLine[];
  upgrades: Upgrade[];
  marketConditions: MarketCondition[];
  achievements: Achievement[];
  currentEvent: {
    id: number;
    title: string;
    description: string;
    effect: string;
    value: number;
    duration: number;
  } | null;
  prestigeLevel: number;
  prestigePoints: number;
  prestigeUpgrades: Upgrade[];
  settings: GameSettings;
  lastSave: number;
}

interface GameContextType {
  gameState: GameState;
  purchaseUpgrade: (upgradeId: string) => void;
  purchaseProductionLine: (lineId: string) => void;
  purchasePrestigeUpgrade: (upgradeId: string) => void;
  claimAchievement: (achievementId: string) => void;
  prestige: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  exportSave: () => string;
  importSave: (saveDataString: string) => boolean;
  getVisibleUpgrades: () => Upgrade[];
  getVisibleAchievements: () => Achievement[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState: GameState = {
  money: 500,
  totalEarned: 0,
  totalSpent: 0,
  productionLines: [
    { id: 'line1', name: 'Silicon Smelters', cost: 500, production: 5, owned: 0 },
    { id: 'line2', name: 'Wafer Fabricators', cost: 2500, production: 25, owned: 0 },
    { id: 'line3', name: 'Chip Assemblers', cost: 10000, production: 120, owned: 0 },
    { id: 'line4', name: 'Quantum Processors', cost: 50000, production: 700, owned: 0 },
    { id: 'line5', name: 'AI Supercomputers', cost: 250000, production: 3500, owned: 0 },
  ],
  upgrades: [
    { id: 'upgrade1', name: 'Efficient Smelting', description: 'Silicon Smelters produce 20% more silicon.', cost: 1000, effect: 0.2, owned: 0, maxLevel: 5, affects: 'line1' },
    { id: 'upgrade2', name: 'Advanced Fabrication', description: 'Wafer Fabricators produce 30% more wafers.', cost: 5000, effect: 0.3, owned: 0, maxLevel: 5, affects: 'line2' },
    { id: 'upgrade3', name: 'Optimized Assembly', description: 'Chip Assemblers produce 40% more chips.', cost: 20000, effect: 0.4, owned: 0, maxLevel: 5, affects: 'line3' },
    { id: 'upgrade4', name: 'Quantum Optimization', description: 'Quantum Processors produce 50% more quantum processors.', cost: 100000, effect: 0.5, owned: 0, maxLevel: 5, affects: 'line4' },
    { id: 'upgrade5', name: 'AI Enhancement', description: 'AI Supercomputers produce 60% more AI power.', cost: 500000, effect: 0.6, owned: 0, maxLevel: 5, affects: 'line5' },
    { id: 'upgrade6', name: 'Global Marketing', description: 'Increase all production by 10%', cost: 750000, effect: 0.1, owned: 0, maxLevel: 5, affects: 'all', unlockCondition: { type: 'spent', value: 500000 } },
    { id: 'upgrade7', name: 'Government Subsidies', description: 'Reduce all production costs by 15%', cost: 1250000, effect: -0.15, owned: 0, maxLevel: 5, affects: 'cost', unlockCondition: { type: 'achievements', value: 5 } },
    { id: 'upgrade8', name: 'Prestige Production', description: 'Increase all production by 5% per prestige level', cost: 2500000, effect: 0.05, owned: 0, maxLevel: 1, affects: 'prestige', unlockCondition: { type: 'prestige', value: 1 } },
  ],
  marketConditions: [
    { id: 'market1', name: 'Silicon Market', efficiency: 1.0 },
    { id: 'market2', name: 'Wafer Market', efficiency: 1.0 },
    { id: 'market3', name: 'Chip Market', efficiency: 1.0 },
    { id: 'market4', name: 'Quantum Market', efficiency: 1.0 },
    { id: 'market5', name: 'AI Market', efficiency: 1.0 },
  ],
  achievements: [
    { id: 'ach1', name: 'First Silicon', description: 'Produce your first silicon.', reward: 1000, target: 1, type: 'production_lines', progress: 0, unlocked: false, claimed: false },
    { id: 'ach2', name: 'Wafer Novice', description: 'Produce 500 wafers.', reward: 5000, target: 500, type: 'total_earned', progress: 0, unlocked: false, claimed: false },
    { id: 'ach3', name: 'Chip Tycoon', description: 'Produce 2500 chips.', reward: 25000, target: 2500, type: 'total_earned', progress: 0, unlocked: false, claimed: false },
    { id: 'ach4', name: 'Quantum Baron', description: 'Produce 10000 quantum processors.', reward: 100000, target: 10000, type: 'total_earned', progress: 0, unlocked: false, claimed: false },
    { id: 'ach5', name: 'AI Empire', description: 'Produce 50000 AI supercomputers.', reward: 500000, target: 50000, type: 'total_earned', progress: 0, unlocked: false, claimed: false },
    { id: 'ach6', name: 'Money Maker', description: 'Earn $1,000,000.', reward: 1000000, target: 1000000, type: 'money', progress: 0, unlocked: false, claimed: false },
    { id: 'ach7', name: 'Upgrade Master', description: 'Purchase 10 upgrades.', reward: 500000, target: 10, type: 'upgrades', progress: 0, unlocked: false, claimed: false },
    { id: 'ach8', name: 'Prestige Player', description: 'Prestige once.', reward: 1000000, target: 1, type: 'prestige', progress: 0, unlocked: false, claimed: false },
  ],
  currentEvent: null,
  prestigeLevel: 0,
  prestigePoints: 0,
  prestigeUpgrades: [
    { id: 'prestige1', name: 'Enhanced Automation', description: 'Increase base production by 10% per level', cost: 1, effect: 0.1, owned: 0, maxLevel: 5, affects: 'all' },
    { id: 'prestige2', name: 'Skilled Workforce', description: 'Reduce production costs by 5% per level', cost: 1, effect: -0.05, owned: 0, maxLevel: 5, affects: 'cost' },
  ],
  settings: {
    soundEnabled: true,
    notificationsEnabled: true,
    autoSave: true,
  },
  lastSave: Date.now(),
};

const gameReducer = (state: GameState, action: any): GameState => {
  switch (action.type) {
    case 'UPDATE_MONEY':
      return { ...state, money: Math.max(0, action.payload) };
    
    case 'PURCHASE_UPGRADE':
      const upgrade = state.upgrades.find(u => u.id === action.payload);
      if (!upgrade || state.money < upgrade.cost || upgrade.owned >= upgrade.maxLevel) {
        return state;
      }
      
      const newUpgrades = state.upgrades.map(u =>
        u.id === action.payload
          ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.5) }
          : u
      );
      
      return {
        ...state,
        money: state.money - upgrade.cost,
        totalSpent: state.totalSpent + upgrade.cost,
        upgrades: newUpgrades
      };
    
    case 'PURCHASE_PRODUCTION_LINE':
      const line = state.productionLines.find(l => l.id === action.payload);
      if (!line || state.money < line.cost) {
        return state;
      }
      
      const newLines = state.productionLines.map(l =>
        l.id === action.payload
          ? { ...l, owned: l.owned + 1, cost: Math.floor(l.cost * 1.15) }
          : l
      );
      
      return {
        ...state,
        money: state.money - line.cost,
        totalSpent: state.totalSpent + line.cost,
        productionLines: newLines
      };
    
    case 'UPDATE_PRODUCTION':
      return {
        ...state,
        totalProduced: state.totalProduced + action.payload,
        totalEarned: state.totalEarned + action.payload
      };
    
    case 'UPDATE_MARKET':
      return {
        ...state,
        marketConditions: state.marketConditions.map(market =>
          market.id === action.payload.id
            ? { ...market, efficiency: Math.max(0.3, Math.min(1.5, action.payload.efficiency)) }
            : market
        )
      };
    
    case 'TRIGGER_EVENT':
      return {
        ...state,
        currentEvent: action.payload
      };
    
    case 'CLEAR_EVENT':
      return {
        ...state,
        currentEvent: null
      };
    
    case 'UPDATE_ACHIEVEMENTS':
      return {
        ...state,
        achievements: action.payload
      };
    
    case 'CLAIM_ACHIEVEMENT':
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (!achievement || achievement.claimed || !achievement.unlocked) {
        return state;
      }
      
      const updatedAchievements = state.achievements.map(a =>
        a.id === action.payload ? { ...a, claimed: true } : a
      );
      
      return {
        ...state,
        money: state.money + achievement.reward,
        achievements: updatedAchievements
      };
    
    case 'PRESTIGE':
      if (state.totalEarned < 1000000) return state;
      
      const newPrestigePoints = Math.floor(state.totalEarned / 1000000);
      return {
        ...initialState,
        prestigeLevel: state.prestigeLevel + 1,
        prestigePoints: state.prestigePoints + newPrestigePoints,
        prestigeUpgrades: state.prestigeUpgrades,
        settings: state.settings,
        lastSave: state.lastSave
      };
    
    case 'PURCHASE_PRESTIGE_UPGRADE':
      const prestigeUpgrade = state.prestigeUpgrades.find(u => u.id === action.payload);
      if (!prestigeUpgrade || state.prestigePoints < prestigeUpgrade.cost || prestigeUpgrade.owned >= prestigeUpgrade.maxLevel) {
        return state;
      }
      
      const newPrestigeUpgrades = state.prestigeUpgrades.map(u =>
        u.id === action.payload
          ? { ...u, owned: u.owned + 1, cost: u.cost + 1 }
          : u
      );
      
      return {
        ...state,
        prestigePoints: state.prestigePoints - prestigeUpgrade.cost,
        prestigeUpgrades: newPrestigeUpgrades
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'LOAD_GAME':
      return { ...action.payload, lastSave: Date.now() };
    
    case 'RESET_GAME':
      return { ...initialState };
    
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  // Auto-save functionality
  useEffect(() => {
    if (gameState.settings.autoSave) {
      const saveInterval = setInterval(() => {
        saveGame();
      }, 30000); // Save every 30 seconds

      return () => clearInterval(saveInterval);
    }
  }, [gameState.settings.autoSave, saveGame]);

  // Load game on mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  // Market fluctuation
  useEffect(() => {
    const marketInterval = setInterval(() => {
      gameState.marketConditions.forEach(market => {
        const fluctuation = (Math.random() - 0.5) * 0.3; // ±15% change
        const newEfficiency = Math.max(0.3, Math.min(1.5, market.efficiency + fluctuation));
        
        dispatch({
          type: 'UPDATE_MARKET',
          payload: { id: market.id, efficiency: newEfficiency }
        });
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(marketInterval);
  }, [gameState.marketConditions]);

  // Random events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (!gameState.currentEvent && Math.random() < 0.1) { // 10% chance every interval
        const events = [
          { id: 1, title: "Tech Breakthrough!", description: "Production efficiency increased by 20% for 60 seconds!", effect: "production", value: 1.2, duration: 60000 },
          { id: 2, title: "Market Boom!", description: "All markets are performing at 150% for 45 seconds!", effect: "market", value: 1.5, duration: 45000 },
          { id: 3, title: "Investment Opportunity", description: "Get 50% more money from sales for 30 seconds!", effect: "income", value: 1.5, duration: 30000 },
          { id: 4, title: "Supply Chain Issues", description: "Production costs increased by 30% for 90 seconds.", effect: "cost", value: 1.3, duration: 90000 },
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        dispatch({ type: 'TRIGGER_EVENT', payload: randomEvent });
        
        setTimeout(() => {
          dispatch({ type: 'CLEAR_EVENT' });
        }, randomEvent.duration);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(eventInterval);
  }, [gameState.currentEvent]);

  // Production loop
  useEffect(() => {
    const productionInterval = setInterval(() => {
      let totalIncome = 0;
      
      gameState.productionLines.forEach(line => {
        if (line.owned > 0) {
          const market = gameState.marketConditions.find(m => m.name.toLowerCase().includes(line.name.toLowerCase().split(' ')[0]));
          const marketEfficiency = market ? market.efficiency : 1;
          
          const upgradeMultiplier = gameState.upgrades
            .filter(u => u.affects === line.id && u.owned > 0)
            .reduce((mult, upgrade) => mult + (upgrade.effect * upgrade.owned), 1);
          
          const prestigeMultiplier = gameState.prestigeUpgrades
            .filter(u => u.owned > 0)
            .reduce((mult, upgrade) => mult + (upgrade.effect * upgrade.owned), 1);
          
          const eventMultiplier = gameState.currentEvent?.effect === 'income' ? gameState.currentEvent.value : 1;
          
          const income = line.owned * line.production * marketEfficiency * upgradeMultiplier * prestigeMultiplier * eventMultiplier;
          totalIncome += income;
        }
      });
      
      if (totalIncome > 0) {
        dispatch({ type: 'UPDATE_MONEY', payload: gameState.money + totalIncome });
        dispatch({ type: 'UPDATE_PRODUCTION', payload: totalIncome });
      }
    }, 1000);

    return () => clearInterval(productionInterval);
  }, [gameState.money, gameState.productionLines, gameState.upgrades, gameState.marketConditions, gameState.prestigeUpgrades, gameState.currentEvent]);

  // Achievement tracking
  useEffect(() => {
    const updatedAchievements = gameState.achievements.map(achievement => {
      let progress = 0;
      let unlocked = achievement.unlocked;

      switch (achievement.type) {
        case 'money':
          progress = gameState.money;
          break;
        case 'total_earned':
          progress = gameState.totalEarned;
          break;
        case 'production_lines':
          progress = gameState.productionLines.reduce((total, line) => total + line.owned, 0);
          break;
        case 'upgrades':
          progress = gameState.upgrades.reduce((total, upgrade) => total + upgrade.owned, 0);
          break;
        case 'prestige':
          progress = gameState.prestigeLevel;
          break;
      }

      if (progress >= achievement.target && !unlocked) {
        unlocked = true;
      }

      return { ...achievement, progress, unlocked };
    });

    dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: updatedAchievements });
  }, [gameState.money, gameState.totalEarned, gameState.productionLines, gameState.upgrades, gameState.prestigeLevel]);

  const purchaseUpgrade = useCallback((upgradeId: string) => {
    dispatch({ type: 'PURCHASE_UPGRADE', payload: upgradeId });
  }, [dispatch]);

  const purchaseProductionLine = useCallback((lineId: string) => {
    dispatch({ type: 'PURCHASE_PRODUCTION_LINE', payload: lineId });
  }, [dispatch]);

  const purchasePrestigeUpgrade = useCallback((upgradeId: string) => {
    dispatch({ type: 'PURCHASE_PRESTIGE_UPGRADE', payload: upgradeId });
  }, [dispatch]);

  const claimAchievement = useCallback((achievementId: string) => {
    dispatch({ type: 'CLAIM_ACHIEVEMENT', payload: achievementId });
  }, [dispatch]);

  const prestige = useCallback(() => {
    dispatch({ type: 'PRESTIGE' });
  }, [dispatch]);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, [dispatch]);

  const saveGame = useCallback(() => {
    try {
      const saveData = { ...gameState, lastSave: Date.now() };
      localStorage.setItem('silicon-fab-empire-save', JSON.stringify(saveData));
      console.log('Game saved successfully!');
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }, [gameState]);

  const loadGame = useCallback(() => {
    try {
      const savedData = localStorage.getItem('silicon-fab-empire-save');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_GAME', payload: parsedData });
        console.log('Game loaded successfully!');
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  }, [dispatch]);

  const resetGame = useCallback(() => {
    localStorage.removeItem('silicon-fab-empire-save');
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  const exportSave = useCallback(() => {
    const saveData = { ...gameState, lastSave: Date.now() };
    return JSON.stringify(saveData, null, 2);
  }, [gameState]);

  const importSave = useCallback((saveDataString: string) => {
    try {
      const saveData = JSON.parse(saveDataString);
      dispatch({ type: 'LOAD_GAME', payload: saveData });
      localStorage.setItem('silicon-fab-empire-save', saveDataString);
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  }, [dispatch]);

  const getVisibleUpgrades = useCallback(() => {
    const unlockedAchievements = gameState.achievements.filter(a => a.unlocked).length;
    const totalSpent = gameState.totalSpent;
    
    return gameState.upgrades.filter(upgrade => {
      if (upgrade.unlockCondition) {
        if (upgrade.unlockCondition.type === 'achievements') {
          return unlockedAchievements >= upgrade.unlockCondition.value;
        }
        if (upgrade.unlockCondition.type === 'spent') {
          return totalSpent >= upgrade.unlockCondition.value;
        }
        if (upgrade.unlockCondition.type === 'prestige') {
          return gameState.prestigeLevel >= upgrade.unlockCondition.value;
        }
      }
      return true;
    });
  }, [gameState.achievements, gameState.totalSpent, gameState.prestigeLevel, gameState.upgrades]);

  const getVisibleAchievements = useCallback(() => {
    const unlockedCount = gameState.achievements.filter(a => a.unlocked).length;
    
    return gameState.achievements.filter((achievement, index) => {
      if (index === 0) return true; // Always show first achievement
      if (achievement.unlocked) return true; // Always show unlocked achievements
      
      // Show next achievement if previous one is unlocked
      const prevAchievement = gameState.achievements[index - 1];
      return prevAchievement && prevAchievement.unlocked;
    });
  }, [gameState.achievements]);

  const contextValue: GameContextType = {
    gameState,
    purchaseUpgrade,
    purchaseProductionLine,
    purchasePrestigeUpgrade,
    claimAchievement,
    prestige,
    updateSettings,
    saveGame,
    loadGame,
    resetGame,
    exportSave,
    importSave,
    getVisibleUpgrades,
    getVisibleAchievements
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
