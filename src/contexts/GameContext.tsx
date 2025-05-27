
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
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  reward: number;
}

interface GameState {
  money: number;
  totalEarned: number;
  productionLines: ProductionLine[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  prestigeLevel: number;
  prestigeTokens: number;
  currentEvent: any;
  marketMultiplier: number;
}

interface GameContextType {
  gameState: GameState;
  updateMoney: (amount: number) => void;
  buyProductionLine: (id: string) => void;
  hireManager: (id: string) => void;
  buyUpgrade: (id: string) => void;
  prestige: () => void;
  clickProduction: (id: string) => void;
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

const initialUpgrades: Upgrade[] = [
  {
    id: 'silicon-efficiency-1',
    name: 'Silicon Efficiency I',
    description: 'Double silicon extraction speed',
    cost: 1000,
    multiplier: 2,
    purchased: false,
    category: 'silicon-extraction'
  },
  {
    id: 'crystal-purity-1',
    name: 'Crystal Purity I',
    description: 'Triple crystal growth rate',
    cost: 10000,
    multiplier: 3,
    purchased: false,
    category: 'crystal-growth'
  },
  {
    id: 'precision-cutting-1',
    name: 'Precision Cutting I',
    description: 'Quadruple wafer slicing speed',
    cost: 100000,
    multiplier: 4,
    purchased: false,
    category: 'wafer-slicing'
  }
];

const initialAchievements: Achievement[] = [
  {
    id: 'first-dollar',
    name: 'First Profit',
    description: 'Earn your first dollar',
    unlocked: false,
    progress: 0,
    target: 1,
    reward: 100
  },
  {
    id: 'automation-begins',
    name: 'Automation Begins',
    description: 'Hire your first manager',
    unlocked: false,
    progress: 0,
    target: 1,
    reward: 1000
  },
  {
    id: 'silicon-mogul',
    name: 'Silicon Mogul',
    description: 'Earn $1 Million',
    unlocked: false,
    progress: 0,
    target: 1000000,
    reward: 100000
  }
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    money: 100,
    totalEarned: 0,
    productionLines: initialProductionLines,
    upgrades: initialUpgrades,
    achievements: initialAchievements,
    prestigeLevel: 0,
    prestigeTokens: 0,
    currentEvent: null,
    marketMultiplier: 1
  });

  // Auto-production loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newState = { ...prev };
        let totalProduction = 0;

        newState.productionLines = prev.productionLines.map(line => {
          if (line.owned > 0 && line.managerHired) {
            const production = line.baseProduction * line.owned * line.level * prev.marketMultiplier;
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

  const updateMoney = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      money: prev.money + amount,
      totalEarned: prev.totalEarned + Math.max(0, amount)
    }));
  }, []);

  const buyProductionLine = useCallback((id: string) => {
    setGameState(prev => {
      const line = prev.productionLines.find(l => l.id === id);
      if (!line) return prev;

      const cost = line.baseCost * Math.pow(1.15, line.owned);
      if (prev.money < cost) return prev;

      return {
        ...prev,
        money: prev.money - cost,
        productionLines: prev.productionLines.map(l =>
          l.id === id ? { ...l, owned: l.owned + 1 } : l
        )
      };
    });
  }, []);

  const hireManager = useCallback((id: string) => {
    setGameState(prev => {
      const line = prev.productionLines.find(l => l.id === id);
      if (!line || line.managerHired || prev.money < line.managerCost) return prev;

      return {
        ...prev,
        money: prev.money - line.managerCost,
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
        upgrades: prev.upgrades.map(u =>
          u.id === id ? { ...u, purchased: true } : u
        ),
        productionLines: prev.productionLines.map(l =>
          l.id === upgrade.category ? { ...l, level: l.level * upgrade.multiplier } : l
        )
      };
    });
  }, []);

  const clickProduction = useCallback((id: string) => {
    setGameState(prev => {
      const line = prev.productionLines.find(l => l.id === id);
      if (!line || line.owned === 0) return prev;

      const production = line.baseProduction * line.level * prev.marketMultiplier;
      return {
        ...prev,
        money: prev.money + production,
        totalEarned: prev.totalEarned + production
      };
    });
  }, []);

  const prestige = useCallback(() => {
    setGameState(prev => {
      const prestigeTokens = Math.floor(prev.totalEarned / 1000000);
      if (prestigeTokens === 0) return prev;

      return {
        ...prev,
        money: 100,
        totalEarned: 0,
        prestigeLevel: prev.prestigeLevel + 1,
        prestigeTokens: prev.prestigeTokens + prestigeTokens,
        productionLines: initialProductionLines,
        upgrades: initialUpgrades.map(u => ({ ...u, purchased: false }))
      };
    });
  }, []);

  const contextValue: GameContextType = {
    gameState,
    updateMoney,
    buyProductionLine,
    hireManager,
    buyUpgrade,
    prestige,
    clickProduction
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
