
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ProductionLine {
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
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  purchased: boolean;
  category: string;
  unlockCondition: {
    type: 'money' | 'owned' | 'achievement' | 'prestige';
    value: number;
    target?: string;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  reward: number;
  type: 'money' | 'owned' | 'manager' | 'upgrade' | 'prestige';
  targetId?: string;
  unlockCondition?: {
    type: 'achievement';
    value: string;
  };
}

interface PrestigeUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  effect: {
    type: 'production' | 'cost' | 'manager' | 'income';
    multiplier: number;
  };
}

interface MarketEvent {
  id: string;
  title: string;
  description: string;
  effect: string;
  duration: number;
  multiplier: number;
  icon: any;
  color: string;
}

interface GameState {
  money: number;
  totalEarned: number;
  totalSpent: number;
  productionLines: ProductionLine[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  prestigeLevel: number;
  prestigeTokens: number;
  prestigeUpgrades: PrestigeUpgrade[];
  currentEvent: MarketEvent | null;
  marketMultiplier: number;
  lastSave: number;
  gameStartTime: number;
  settings: {
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    autoSave: boolean;
  };
}

interface GameContextType {
  gameState: GameState;
  updateMoney: (amount: number) => void;
  buyProductionLine: (id: string) => void;
  hireManager: (id: string) => void;
  buyUpgrade: (id: string) => void;
  buyPrestigeUpgrade: (id: string) => void;
  prestige: () => void;
  clickProduction: (id: string) => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
}

const GameContext = createContext<GameContextType | null>(null);

const initialProductionLines: ProductionLine[] = [
  {
    id: 'silicon-extraction',
    name: 'Silicon Extraction',
    description: 'Extract raw silicon from quartz sand',
    baseProduction: 1,
    baseCost: 10,
    owned: 0,
    managerHired: false,
    managerCost: 1000,
    level: 1,
    icon: '⛏️',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'crystal-growth',
    name: 'Crystal Growth',
    description: 'Grow silicon crystals in specialized furnaces',
    baseProduction: 5,
    baseCost: 100,
    owned: 0,
    managerHired: false,
    managerCost: 5000,
    level: 1,
    icon: '💎',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'wafer-slicing',
    name: 'Wafer Slicing',
    description: 'Slice crystals into thin wafers',
    baseProduction: 25,
    baseCost: 1000,
    owned: 0,
    managerHired: false,
    managerCost: 25000,
    level: 1,
    icon: '🔪',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'lithography',
    name: 'Lithography',
    description: 'Pattern circuits on wafers using advanced lithography',
    baseProduction: 125,
    baseCost: 10000,
    owned: 0,
    managerHired: false,
    managerCost: 125000,
    level: 1,
    icon: '🔬',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'chip-assembly',
    name: 'Chip Assembly',
    description: 'Package and test finished semiconductors',
    baseProduction: 625,
    baseCost: 100000,
    owned: 0,
    managerHired: false,
    managerCost: 625000,
    level: 1,
    icon: '🔧',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'cpu-production',
    name: 'CPU Production',
    description: 'Manufacture high-performance processors',
    baseProduction: 3125,
    baseCost: 1000000,
    owned: 0,
    managerHired: false,
    managerCost: 3125000,
    level: 1,
    icon: '🖥️',
    color: 'from-indigo-500 to-blue-600'
  }
];

const allUpgrades: Upgrade[] = [
  {
    id: 'silicon-efficiency-1',
    name: 'Silicon Efficiency I',
    description: 'Double silicon extraction speed',
    cost: 1000,
    multiplier: 2,
    purchased: false,
    category: 'silicon-extraction',
    unlockCondition: { type: 'owned', value: 5, target: 'silicon-extraction' }
  },
  {
    id: 'silicon-efficiency-2',
    name: 'Silicon Efficiency II',
    description: 'Triple silicon extraction speed',
    cost: 25000,
    multiplier: 3,
    purchased: false,
    category: 'silicon-extraction',
    unlockCondition: { type: 'owned', value: 25, target: 'silicon-extraction' }
  },
  {
    id: 'crystal-purity-1',
    name: 'Crystal Purity I',
    description: 'Triple crystal growth rate',
    cost: 10000,
    multiplier: 3,
    purchased: false,
    category: 'crystal-growth',
    unlockCondition: { type: 'owned', value: 10, target: 'crystal-growth' }
  },
  {
    id: 'crystal-purity-2',
    name: 'Ultra Pure Crystals',
    description: 'Multiply crystal growth by 5x',
    cost: 500000,
    multiplier: 5,
    purchased: false,
    category: 'crystal-growth',
    unlockCondition: { type: 'owned', value: 50, target: 'crystal-growth' }
  },
  {
    id: 'precision-cutting-1',
    name: 'Precision Cutting I',
    description: 'Quadruple wafer slicing speed',
    cost: 100000,
    multiplier: 4,
    purchased: false,
    category: 'wafer-slicing',
    unlockCondition: { type: 'owned', value: 15, target: 'wafer-slicing' }
  },
  {
    id: 'nano-lithography',
    name: 'Nano Lithography',
    description: 'Revolutionary 7nm process - 10x multiplier',
    cost: 50000000,
    multiplier: 10,
    purchased: false,
    category: 'lithography',
    unlockCondition: { type: 'money', value: 10000000 }
  },
  {
    id: 'quantum-assembly',
    name: 'Quantum Assembly',
    description: 'Quantum-enhanced assembly - 15x multiplier',
    cost: 1000000000,
    multiplier: 15,
    purchased: false,
    category: 'chip-assembly',
    unlockCondition: { type: 'prestige', value: 1 }
  },
  {
    id: 'ai-optimization',
    name: 'AI Process Optimization',
    description: 'AI optimizes all production lines - 2x global multiplier',
    cost: 5000000000,
    multiplier: 2,
    purchased: false,
    category: 'global',
    unlockCondition: { type: 'achievement', value: 'automation-master' }
  }
];

const allAchievements: Achievement[] = [
  {
    id: 'first-dollar',
    name: 'First Profit',
    description: 'Earn your first dollar',
    unlocked: false,
    progress: 0,
    target: 1,
    reward: 100,
    type: 'money'
  },
  {
    id: 'silicon-starter',
    name: 'Silicon Starter',
    description: 'Own 10 Silicon Extraction facilities',
    unlocked: false,
    progress: 0,
    target: 10,
    reward: 1000,
    type: 'owned',
    targetId: 'silicon-extraction',
    unlockCondition: { type: 'achievement', value: 'first-dollar' }
  },
  {
    id: 'automation-begins',
    name: 'Automation Begins',
    description: 'Hire your first manager',
    unlocked: false,
    progress: 0,
    target: 1,
    reward: 5000,
    type: 'manager',
    unlockCondition: { type: 'achievement', value: 'silicon-starter' }
  },
  {
    id: 'thousand-club',
    name: 'Thousand Club',
    description: 'Earn $1,000',
    unlocked: false,
    progress: 0,
    target: 1000,
    reward: 2000,
    type: 'money',
    unlockCondition: { type: 'achievement', value: 'automation-begins' }
  },
  {
    id: 'crystal-master',
    name: 'Crystal Master',
    description: 'Own 25 Crystal Growth facilities',
    unlocked: false,
    progress: 0,
    target: 25,
    reward: 25000,
    type: 'owned',
    targetId: 'crystal-growth',
    unlockCondition: { type: 'achievement', value: 'thousand-club' }
  },
  {
    id: 'upgrade-enthusiast',
    name: 'Upgrade Enthusiast',
    description: 'Purchase your first upgrade',
    unlocked: false,
    progress: 0,
    target: 1,
    reward: 10000,
    type: 'upgrade',
    unlockCondition: { type: 'achievement', value: 'crystal-master' }
  },
  {
    id: 'millionaire',
    name: 'Silicon Millionaire',
    description: 'Earn $1 Million',
    unlocked: false,
    progress: 0,
    target: 1000000,
    reward: 500000,
    type: 'money',
    unlockCondition: { type: 'achievement', value: 'upgrade-enthusiast' }
  },
  {
    id: 'automation-master',
    name: 'Automation Master',
    description: 'Hire managers for all production lines',
    unlocked: false,
    progress: 0,
    target: 6,
    reward: 1000000,
    type: 'manager',
    unlockCondition: { type: 'achievement', value: 'millionaire' }
  },
  {
    id: 'prestige-ready',
    name: 'Ready for Prestige',
    description: 'Earn $10 Million (Ready for first prestige)',
    unlocked: false,
    progress: 0,
    target: 10000000,
    reward: 2000000,
    type: 'money',
    unlockCondition: { type: 'achievement', value: 'automation-master' }
  }
];

const prestigeUpgrades: PrestigeUpgrade[] = [
  {
    id: 'global-efficiency',
    name: 'Global Efficiency',
    description: 'Permanent 2x production multiplier',
    cost: 1,
    purchased: false,
    effect: { type: 'production', multiplier: 2 }
  },
  {
    id: 'cost-reduction',
    name: 'Cost Optimization',
    description: 'Reduce all costs by 20%',
    cost: 2,
    purchased: false,
    effect: { type: 'cost', multiplier: 0.8 }
  },
  {
    id: 'manager-discount',
    name: 'HR Excellence',
    description: 'Reduce manager costs by 50%',
    cost: 3,
    purchased: false,
    effect: { type: 'manager', multiplier: 0.5 }
  },
  {
    id: 'income-boost',
    name: 'Market Dominance',
    description: 'Permanent 3x income multiplier',
    cost: 5,
    purchased: false,
    effect: { type: 'income', multiplier: 3 }
  }
];

const marketEvents = [
  {
    id: 'chip-shortage',
    title: 'Global Chip Shortage!',
    description: 'High demand for semiconductors has created a shortage. Production values doubled!',
    effect: 'Production x2',
    duration: 60000,
    multiplier: 2,
    icon: 'TrendingUp',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'market-boom',
    title: 'AI Technology Boom!',
    description: 'Artificial intelligence demand has skyrocketed! All production tripled!',
    effect: 'Production x3',
    duration: 45000,
    multiplier: 3,
    icon: 'Zap',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'supply-disruption',
    title: 'Supply Chain Disruption',
    description: 'Raw material shortages have impacted production. Efficiency reduced by 50%.',
    effect: 'Production x0.5',
    duration: 30000,
    multiplier: 0.5,
    icon: 'TrendingDown',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'crypto-surge',
    title: 'Cryptocurrency Surge!',
    description: 'Mining demand increases chip prices. Income multiplied by 4!',
    effect: 'Income x4',
    duration: 40000,
    multiplier: 4,
    icon: 'DollarSign',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'tech-breakthrough',
    title: 'Quantum Computing Breakthrough!',
    description: 'New quantum tech increases all efficiency by 500%!',
    effect: 'Production x5',
    duration: 90000,
    multiplier: 5,
    icon: 'Cpu',
    color: 'from-blue-500 to-cyan-600'
  }
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    money: 100,
    totalEarned: 0,
    totalSpent: 0,
    productionLines: initialProductionLines,
    upgrades: [],
    achievements: [],
    prestigeLevel: 0,
    prestigeTokens: 0,
    prestigeUpgrades: prestigeUpgrades,
    currentEvent: null,
    marketMultiplier: 1,
    lastSave: Date.now(),
    gameStartTime: Date.now(),
    settings: {
      soundEnabled: true,
      notificationsEnabled: true,
      autoSave: true
    }
  });

  // Load game on mount
  useEffect(() => {
    loadGame();
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (gameState.settings.autoSave) {
      const interval = setInterval(() => {
        saveGame();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [gameState.settings.autoSave]);

  // Market fluctuation system
  useEffect(() => {
    const marketInterval = setInterval(() => {
      setGameState(prev => {
        const baseMultiplier = 1;
        const variation = 0.3; // 30% variation
        const newMultiplier = baseMultiplier + (Math.random() - 0.5) * variation;
        return {
          ...prev,
          marketMultiplier: Math.max(0.7, Math.min(1.3, newMultiplier))
        };
      });
    }, 15000); // Change every 15 seconds

    return () => clearInterval(marketInterval);
  }, []);

  // Random events system
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (!gameState.currentEvent && Math.random() < 0.15) { // 15% chance every 45 seconds
        const randomEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
        setGameState(prev => ({ ...prev, currentEvent: randomEvent }));
      }
    }, 45000);

    return () => clearInterval(eventInterval);
  }, [gameState.currentEvent]);

  // Auto-production loop with prestige bonuses
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newState = { ...prev };
        let totalProduction = 0;

        // Calculate prestige bonuses
        const productionBonus = prev.prestigeUpgrades
          .filter(u => u.purchased && u.effect.type === 'production')
          .reduce((acc, u) => acc * u.effect.multiplier, 1);

        const incomeBonus = prev.prestigeUpgrades
          .filter(u => u.purchased && u.effect.type === 'income')
          .reduce((acc, u) => acc * u.effect.multiplier, 1);

        newState.productionLines = prev.productionLines.map(line => {
          if (line.owned > 0 && line.managerHired) {
            const eventMultiplier = prev.currentEvent?.multiplier || 1;
            const production = line.baseProduction * line.owned * line.level * 
                             prev.marketMultiplier * productionBonus * eventMultiplier * incomeBonus;
            totalProduction += production;
          }
          return line;
        });

        if (totalProduction > 0) {
          newState.money += totalProduction;
          newState.totalEarned += totalProduction;
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update available upgrades and achievements
  useEffect(() => {
    setGameState(prev => {
      const availableUpgrades = allUpgrades.filter(upgrade => {
        if (prev.upgrades.some(u => u.id === upgrade.id)) return false;
        
        const condition = upgrade.unlockCondition;
        switch (condition.type) {
          case 'money':
            return prev.totalEarned >= condition.value;
          case 'owned':
            const line = prev.productionLines.find(l => l.id === condition.target);
            return line && line.owned >= condition.value;
          case 'achievement':
            return prev.achievements.some(a => a.id === condition.value && a.unlocked);
          case 'prestige':
            return prev.prestigeLevel >= condition.value;
          default:
            return true;
        }
      });

      const availableAchievements = allAchievements.filter(achievement => {
        if (prev.achievements.some(a => a.id === achievement.id)) return false;
        
        if (achievement.unlockCondition) {
          const condition = achievement.unlockCondition;
          if (condition.type === 'achievement') {
            return prev.achievements.some(a => a.id === condition.value && a.unlocked);
          }
        }
        return true;
      });

      return {
        ...prev,
        upgrades: [...prev.upgrades, ...availableUpgrades],
        achievements: [...prev.achievements, ...availableAchievements]
      };
    });
  }, [gameState.money, gameState.totalEarned, gameState.prestigeLevel]);

  // Track achievements
  useEffect(() => {
    setGameState(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        let progress = achievement.progress;
        
        switch (achievement.type) {
          case 'money':
            progress = prev.totalEarned;
            break;
          case 'owned':
            if (achievement.targetId) {
              const line = prev.productionLines.find(l => l.id === achievement.targetId);
              progress = line?.owned || 0;
            }
            break;
          case 'manager':
            progress = prev.productionLines.filter(l => l.managerHired).length;
            break;
          case 'upgrade':
            progress = prev.upgrades.filter(u => u.purchased).length;
            break;
          case 'prestige':
            progress = prev.prestigeLevel;
            break;
        }

        const wasUnlocked = achievement.unlocked;
        const isUnlocked = progress >= achievement.target;
        
        if (isUnlocked && !wasUnlocked) {
          // Achievement unlocked! Add reward
          setTimeout(() => {
            setGameState(current => ({
              ...current,
              money: current.money + achievement.reward
            }));
          }, 100);
        }

        return {
          ...achievement,
          progress,
          unlocked: isUnlocked
        };
      });

      return { ...prev, achievements: updatedAchievements };
    });
  }, [gameState.money, gameState.totalEarned, gameState.productionLines, gameState.upgrades, gameState.prestigeLevel]);

  const saveGame = useCallback(() => {
    const saveData = {
      ...gameState,
      lastSave: Date.now()
    };
    localStorage.setItem('siliconFabEmpire', JSON.stringify(saveData));
    console.log('Game saved successfully!');
  }, [gameState]);

  const loadGame = useCallback(() => {
    const savedData = localStorage.getItem('siliconFabEmpire');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setGameState(prev => ({
          ...prev,
          ...parsedData,
          upgrades: parsedData.upgrades || [],
          achievements: parsedData.achievements || [],
          settings: { ...prev.settings, ...parsedData.settings }
        }));
        console.log('Game loaded successfully!');
      } catch (error) {
        console.error('Failed to load game:', error);
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem('siliconFabEmpire');
    setGameState({
      money: 100,
      totalEarned: 0,
      totalSpent: 0,
      productionLines: initialProductionLines,
      upgrades: [],
      achievements: [],
      prestigeLevel: 0,
      prestigeTokens: 0,
      prestigeUpgrades: prestigeUpgrades,
      currentEvent: null,
      marketMultiplier: 1,
      lastSave: Date.now(),
      gameStartTime: Date.now(),
      settings: {
        soundEnabled: true,
        notificationsEnabled: true,
        autoSave: true
      }
    });
  }, []);

  const updateMoney = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      money: prev.money + amount,
      totalEarned: prev.totalEarned + Math.max(0, amount),
      totalSpent: prev.totalSpent + Math.max(0, -amount)
    }));
  }, []);

  const buyProductionLine = useCallback((id: string) => {
    setGameState(prev => {
      const line = prev.productionLines.find(l => l.id === id);
      if (!line) return prev;

      const costReduction = prev.prestigeUpgrades
        .filter(u => u.purchased && u.effect.type === 'cost')
        .reduce((acc, u) => acc * u.effect.multiplier, 1);

      const cost = line.baseCost * Math.pow(1.15, line.owned) * costReduction;
      if (prev.money < cost) return prev;

      return {
        ...prev,
        money: prev.money - cost,
        totalSpent: prev.totalSpent + cost,
        productionLines: prev.productionLines.map(l =>
          l.id === id ? { ...l, owned: l.owned + 1 } : l
        )
      };
    });
  }, []);

  const hireManager = useCallback((id: string) => {
    setGameState(prev => {
      const line = prev.productionLines.find(l => l.id === id);
      if (!line || line.managerHired) return prev;

      const managerDiscount = prev.prestigeUpgrades
        .filter(u => u.purchased && u.effect.type === 'manager')
        .reduce((acc, u) => acc * u.effect.multiplier, 1);

      const cost = line.managerCost * managerDiscount;
      if (prev.money < cost) return prev;

      return {
        ...prev,
        money: prev.money - cost,
        totalSpent: prev.totalSpent + cost,
        productionLines: prev.productionLines.map(l =>
          l.id === id ? { ...l, managerHired: true } : l
        )
      };
    });
  }, []);

  const buyUpgrade = useCallback((id: string) => {
    setGameState(prev => {
      const upgrade = prev.upgrades.find(u => u.id === id);
      if (!upgrade || upgrade.purchased || prev.money < upgrade.cost) return prev;

      return {
        ...prev,
        money: prev.money - upgrade.cost,
        totalSpent: prev.totalSpent + upgrade.cost,
        upgrades: prev.upgrades.map(u =>
          u.id === id ? { ...u, purchased: true } : u
        ),
        productionLines: upgrade.category === 'global' 
          ? prev.productionLines.map(l => ({ ...l, level: l.level * upgrade.multiplier }))
          : prev.productionLines.map(l =>
              l.id === upgrade.category ? { ...l, level: l.level * upgrade.multiplier } : l
            )
      };
    });
  }, []);

  const buyPrestigeUpgrade = useCallback((id: string) => {
    setGameState(prev => {
      const upgrade = prev.prestigeUpgrades.find(u => u.id === id);
      if (!upgrade || upgrade.purchased || prev.prestigeTokens < upgrade.cost) return prev;

      return {
        ...prev,
        prestigeTokens: prev.prestigeTokens - upgrade.cost,
        prestigeUpgrades: prev.prestigeUpgrades.map(u =>
          u.id === id ? { ...u, purchased: true } : u
        )
      };
    });
  }, []);

  const clickProduction = useCallback((id: string) => {
    setGameState(prev => {
      const line = prev.productionLines.find(l => l.id === id);
      if (!line || line.owned === 0) return prev;

      const eventMultiplier = prev.currentEvent?.multiplier || 1;
      const production = line.baseProduction * line.level * prev.marketMultiplier * eventMultiplier;
      
      return {
        ...prev,
        money: prev.money + production,
        totalEarned: prev.totalEarned + production
      };
    });
  }, []);

  const prestige = useCallback(() => {
    setGameState(prev => {
      const prestigeTokens = Math.floor(prev.totalEarned / 10000000); // 10M per token
      if (prestigeTokens === 0) return prev;

      return {
        money: 100,
        totalEarned: 0,
        totalSpent: 0,
        productionLines: initialProductionLines,
        upgrades: [],
        achievements: [],
        prestigeLevel: prev.prestigeLevel + 1,
        prestigeTokens: prev.prestigeTokens + prestigeTokens,
        prestigeUpgrades: prev.prestigeUpgrades,
        currentEvent: null,
        marketMultiplier: 1,
        lastSave: Date.now(),
        gameStartTime: Date.now(),
        settings: prev.settings
      };
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameState['settings']>) => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  const contextValue: GameContextType = {
    gameState,
    updateMoney,
    buyProductionLine,
    hireManager,
    buyUpgrade,
    buyPrestigeUpgrade,
    prestige,
    clickProduction,
    saveGame,
    loadGame,
    resetGame,
    updateSettings
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
