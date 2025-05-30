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
  purchased: boolean;
  multiplier: number;
  unlockCondition?: {
    type: string;
    value: number;
  };
}

interface ProductionLine {
  id: string;
  name: string;
  description: string;
  baseProduction: number;
  baseCost: number;
  cost: number;
  production: number;
  owned: number;
  managerHired: boolean;
  managerCost: number;
  level: number;
  icon: string;
  color: string;
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
  totalProduced: number;
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
    multiplier: number;
  } | null;
  prestigeLevel: number;
  prestigePoints: number;
  prestigeTokens: number;
  prestigeUpgrades: Upgrade[];
  settings: GameSettings;
  lastSave: number;
  marketMultiplier: number;
  gameStartTime: number;
  clickCount: number;
  totalClicks: number;
  boostActive: boolean;
  boostEndTime: number;
  autoClickerActive: boolean;
  researchPoints: number;
}

interface GameContextType {
  gameState: GameState;
  purchaseUpgrade: (upgradeId: string) => void;
  purchaseProductionLine: (lineId: string) => void;
  buyProductionLine: (lineId: string) => void;
  hireManager: (lineId: string) => void;
  clickProduction: (lineId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  purchasePrestigeUpgrade: (upgradeId: string) => void;
  buyPrestigeUpgrade: (upgradeId: string) => void;
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
  dispatch: React.Dispatch<any>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState: GameState = {
  money: 500,
  totalEarned: 0,
  totalSpent: 0,
  totalProduced: 0,
  productionLines: [
    { 
      id: 'line1', 
      name: 'Silicon Smelters', 
      description: 'Basic silicon processing units',
      baseProduction: 5,
      baseCost: 500,
      cost: 500, 
      production: 5, 
      owned: 0,
      managerHired: false,
      managerCost: 1000,
      level: 1,
      icon: '🔥',
      color: 'from-red-500/30 to-orange-500/30'
    },
    { 
      id: 'line2', 
      name: 'Wafer Fabricators', 
      description: 'Advanced wafer manufacturing',
      baseProduction: 25,
      baseCost: 2500,
      cost: 2500, 
      production: 25, 
      owned: 0,
      managerHired: false,
      managerCost: 5000,
      level: 1,
      icon: '💿',
      color: 'from-blue-500/30 to-cyan-500/30'
    },
    { 
      id: 'line3', 
      name: 'Chip Assemblers', 
      description: 'High-tech chip assembly lines',
      baseProduction: 120,
      baseCost: 10000,
      cost: 10000, 
      production: 120, 
      owned: 0,
      managerHired: false,
      managerCost: 20000,
      level: 1,
      icon: '🔬',
      color: 'from-green-500/30 to-emerald-500/30'
    },
    { 
      id: 'line4', 
      name: 'Quantum Processors', 
      description: 'Cutting-edge quantum computing',
      baseProduction: 700,
      baseCost: 50000,
      cost: 50000, 
      production: 700, 
      owned: 0,
      managerHired: false,
      managerCost: 100000,
      level: 1,
      icon: '⚛️',
      color: 'from-purple-500/30 to-pink-500/30'
    },
    { 
      id: 'line5', 
      name: 'AI Supercomputers', 
      description: 'Revolutionary AI processing units',
      baseProduction: 3500,
      baseCost: 250000,
      cost: 250000, 
      production: 3500, 
      owned: 0,
      managerHired: false,
      managerCost: 500000,
      level: 1,
      icon: '🤖',
      color: 'from-yellow-500/30 to-amber-500/30'
    },
    { 
      id: 'line6', 
      name: 'Neural Networks', 
      description: 'Next-gen neural processing',
      baseProduction: 15000,
      baseCost: 1000000,
      cost: 1000000, 
      production: 15000, 
      owned: 0,
      managerHired: false,
      managerCost: 2000000,
      level: 1,
      icon: '🧠',
      color: 'from-indigo-500/30 to-violet-500/30'
    }
  ],
  upgrades: [
    { id: 'upgrade1', name: 'Efficient Smelting', description: 'Silicon Smelters produce 20% more silicon.', cost: 1000, effect: 0.2, owned: 0, maxLevel: 5, affects: 'line1', purchased: false, multiplier: 1.2 },
    { id: 'upgrade2', name: 'Advanced Fabrication', description: 'Wafer Fabricators produce 30% more wafers.', cost: 5000, effect: 0.3, owned: 0, maxLevel: 5, affects: 'line2', purchased: false, multiplier: 1.3 },
    { id: 'upgrade3', name: 'Optimized Assembly', description: 'Chip Assemblers produce 40% more chips.', cost: 20000, effect: 0.4, owned: 0, maxLevel: 5, affects: 'line3', purchased: false, multiplier: 1.4 },
    { id: 'upgrade4', name: 'Quantum Optimization', description: 'Quantum Processors produce 50% more quantum processors.', cost: 100000, effect: 0.5, owned: 0, maxLevel: 5, affects: 'line4', purchased: false, multiplier: 1.5 },
    { id: 'upgrade5', name: 'AI Enhancement', description: 'AI Supercomputers produce 60% more AI power.', cost: 500000, effect: 0.6, owned: 0, maxLevel: 5, affects: 'line5', purchased: false, multiplier: 1.6 },
    { id: 'upgrade6', name: 'Global Marketing', description: 'Increase all production by 10%', cost: 750000, effect: 0.1, owned: 0, maxLevel: 5, affects: 'all', purchased: false, multiplier: 1.1, unlockCondition: { type: 'spent', value: 500000 } },
    { id: 'upgrade7', name: 'Government Subsidies', description: 'Reduce all production costs by 15%', cost: 1250000, effect: -0.15, owned: 0, maxLevel: 5, affects: 'cost', purchased: false, multiplier: 0.85, unlockCondition: { type: 'achievements', value: 5 } },
    { id: 'upgrade8', name: 'Prestige Production', description: 'Increase all production by 5% per prestige level', cost: 2500000, effect: 0.05, owned: 0, maxLevel: 1, affects: 'prestige', purchased: false, multiplier: 1.05, unlockCondition: { type: 'prestige', value: 1 } },
    { id: 'upgrade9', name: 'Speed Boost', description: 'Production speed increased by 25%', cost: 3000000, effect: 0.25, owned: 0, maxLevel: 3, affects: 'speed', purchased: false, multiplier: 1.25, unlockCondition: { type: 'total_earned', value: 2500000 } },
    { id: 'upgrade10', name: 'Click Power', description: 'Manual clicks produce 10x more', cost: 1500000, effect: 10, owned: 0, maxLevel: 5, affects: 'click', purchased: false, multiplier: 10, unlockCondition: { type: 'achievements', value: 3 } },
    { id: 'upgrade11', name: 'Auto Clicker', description: 'Automatically clicks every 2 seconds', cost: 5000000, effect: 1, owned: 0, maxLevel: 1, affects: 'auto', purchased: false, multiplier: 1, unlockCondition: { type: 'prestige', value: 2 } },
    { id: 'upgrade12', name: 'Research Lab', description: 'Unlocks special research bonuses', cost: 10000000, effect: 0.5, owned: 0, maxLevel: 1, affects: 'research', purchased: false, multiplier: 1.5, unlockCondition: { type: 'total_earned', value: 8000000 } },
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
    { id: 'ach2', name: 'Wafer Novice', description: 'Earn $500.', reward: 5000, target: 500, type: 'total_earned', progress: 0, unlocked: false, claimed: false },
    { id: 'ach3', name: 'Chip Tycoon', description: 'Earn $2,500.', reward: 25000, target: 2500, type: 'total_earned', progress: 0, unlocked: false, claimed: false },
    { id: 'ach4', name: 'Quantum Baron', description: 'Earn $10,000.', reward: 100000, target: 10000, type: 'total_earned', progress: 0, unlocked: false, claimed: false },
    { id: 'ach5', name: 'AI Empire', description: 'Earn $50,000.', reward: 500000, target: 50000, type: 'total_earned', progress: 0, unlocked: false, claimed: false },
    { id: 'ach6', name: 'Money Maker', description: 'Earn $1,000,000.', reward: 1000000, target: 1000000, type: 'money', progress: 0, unlocked: false, claimed: false },
    { id: 'ach7', name: 'Upgrade Master', description: 'Purchase 10 upgrades.', reward: 500000, target: 10, type: 'upgrades', progress: 0, unlocked: false, claimed: false },
    { id: 'ach8', name: 'Prestige Player', description: 'Prestige once.', reward: 1000000, target: 1, type: 'prestige', progress: 0, unlocked: false, claimed: false },
    { id: 'ach9', name: 'Click Master', description: 'Click production 100 times.', reward: 250000, target: 100, type: 'clicks', progress: 0, unlocked: false, claimed: false },
    { id: 'ach10', name: 'Manager Mogul', description: 'Hire 5 managers.', reward: 750000, target: 5, type: 'managers', progress: 0, unlocked: false, claimed: false },
    { id: 'ach11', name: 'Speed Demon', description: 'Reach 1M$/sec production.', reward: 2000000, target: 1000000, type: 'production_rate', progress: 0, unlocked: false, claimed: false },
    { id: 'ach12', name: 'Empire Builder', description: 'Own 100 production units total.', reward: 5000000, target: 100, type: 'total_owned', progress: 0, unlocked: false, claimed: false },
  ],
  currentEvent: null,
  prestigeLevel: 0,
  prestigePoints: 0,
  prestigeTokens: 0,
  prestigeUpgrades: [
    { id: 'prestige1', name: 'Enhanced Automation', description: 'Increase base production by 10% per level', cost: 1, effect: 0.1, owned: 0, maxLevel: 10, affects: 'all', purchased: false, multiplier: 1.1 },
    { id: 'prestige2', name: 'Skilled Workforce', description: 'Reduce production costs by 5% per level', cost: 1, effect: -0.05, owned: 0, maxLevel: 10, affects: 'cost', purchased: false, multiplier: 0.95 },
    { id: 'prestige3', name: 'Market Mastery', description: 'Improve market conditions by 15% per level', cost: 2, effect: 0.15, owned: 0, maxLevel: 5, affects: 'market', purchased: false, multiplier: 1.15 },
    { id: 'prestige4', name: 'Research Efficiency', description: 'Unlock research bonuses 25% faster', cost: 3, effect: 0.25, owned: 0, maxLevel: 5, affects: 'research', purchased: false, multiplier: 1.25 },
    { id: 'prestige5', name: 'Mega Boost', description: 'All income multiplied by 2x per level', cost: 5, effect: 2, owned: 0, maxLevel: 3, affects: 'mega', purchased: false, multiplier: 2 },
    { id: 'prestige6', name: 'Time Warp', description: 'Production speed increased by 50% per level', cost: 4, effect: 0.5, owned: 0, maxLevel: 5, affects: 'speed', purchased: false, multiplier: 1.5 },
    { id: 'prestige7', name: 'Lucky Streak', description: 'Higher chance for beneficial events', cost: 2, effect: 0.2, owned: 0, maxLevel: 3, affects: 'luck', purchased: false, multiplier: 1.2 },
    { id: 'prestige8', name: 'Manager Genius', description: 'Managers work 100% faster per level', cost: 3, effect: 1, owned: 0, maxLevel: 5, affects: 'managers', purchased: false, multiplier: 2 },
    { id: 'prestige9', name: 'Click Overlord', description: 'Manual clicks worth 500% more per level', cost: 2, effect: 5, owned: 0, maxLevel: 5, affects: 'click_power', purchased: false, multiplier: 5 },
    { id: 'prestige10', name: 'Prestige Master', description: 'Gain 50% more prestige tokens', cost: 10, effect: 0.5, owned: 0, maxLevel: 1, affects: 'prestige_gain', purchased: false, multiplier: 1.5 },
  ],
  settings: {
    soundEnabled: true,
    notificationsEnabled: true,
    autoSave: true,
  },
  lastSave: Date.now(),
  marketMultiplier: 1.0,
  gameStartTime: Date.now(),
  clickCount: 0,
  totalClicks: 0,
  boostActive: false,
  boostEndTime: 0,
  autoClickerActive: false,
  researchPoints: 0,
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
          ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.5), purchased: u.owned + 1 >= u.maxLevel }
          : u
      );
      
      return {
        ...state,
        money: state.money - upgrade.cost,
        totalSpent: state.totalSpent + upgrade.cost,
        upgrades: newUpgrades,
        autoClickerActive: upgrade.affects === 'auto' ? true : state.autoClickerActive
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

    case 'HIRE_MANAGER':
      const managerLine = state.productionLines.find(l => l.id === action.payload);
      if (!managerLine || state.money < managerLine.managerCost || managerLine.managerHired) {
        return state;
      }
      
      const updatedLines = state.productionLines.map(l =>
        l.id === action.payload
          ? { ...l, managerHired: true }
          : l
      );
      
      return {
        ...state,
        money: state.money - managerLine.managerCost,
        totalSpent: state.totalSpent + managerLine.managerCost,
        productionLines: updatedLines
      };

    case 'CLICK_PRODUCTION':
      const clickLine = state.productionLines.find(l => l.id === action.payload);
      if (!clickLine || clickLine.owned === 0) {
        return state;
      }
      
      const clickUpgrade = state.upgrades.find(u => u.affects === 'click' && u.owned > 0);
      const clickMultiplier = clickUpgrade ? Math.pow(clickUpgrade.multiplier, clickUpgrade.owned) : 1;
      const prestigeClickBonus = state.prestigeUpgrades.find(u => u.affects === 'click_power' && u.owned > 0);
      const prestigeClickMultiplier = prestigeClickBonus ? Math.pow(prestigeClickBonus.multiplier, prestigeClickBonus.owned) : 1;
      
      const clickProduction = clickLine.baseProduction * clickLine.level * state.marketMultiplier * clickMultiplier * prestigeClickMultiplier;
      
      return {
        ...state,
        money: state.money + clickProduction,
        totalEarned: state.totalEarned + clickProduction,
        totalClicks: state.totalClicks + 1,
        clickCount: state.clickCount + 1
      };
    
    case 'ACTIVATE_BOOST':
      return {
        ...state,
        boostActive: true,
        boostEndTime: Date.now() + 30000 // 30 seconds
      };
    
    case 'DEACTIVATE_BOOST':
      return {
        ...state,
        boostActive: false,
        boostEndTime: 0
      };
    
    case 'UPDATE_PRODUCTION':
      return {
        ...state,
        totalEarned: state.totalEarned + action.payload,
        totalProduced: state.totalProduced + action.payload
      };
    
    case 'UPDATE_MARKET':
      return {
        ...state,
        marketMultiplier: action.payload,
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
      if (state.totalEarned < 10000000) return state;
      
      const newPrestigeTokens = Math.floor(state.totalEarned / 10000000);
      const prestigeGainBonus = state.prestigeUpgrades.find(u => u.affects === 'prestige_gain' && u.owned > 0);
      const adjustedTokens = prestigeGainBonus ? 
        Math.floor(newPrestigeTokens * (1 + prestigeGainBonus.effect * prestigeGainBonus.owned)) : 
        newPrestigeTokens;
      
      return {
        ...initialState,
        prestigeLevel: state.prestigeLevel + 1,
        prestigeTokens: state.prestigeTokens + adjustedTokens,
        prestigeUpgrades: state.prestigeUpgrades,
        settings: state.settings,
        lastSave: state.lastSave,
        gameStartTime: Date.now()
      };
    
    case 'PURCHASE_PRESTIGE_UPGRADE':
      const prestigeUpgrade = state.prestigeUpgrades.find(u => u.id === action.payload);
      if (!prestigeUpgrade || state.prestigeTokens < prestigeUpgrade.cost || prestigeUpgrade.owned >= prestigeUpgrade.maxLevel) {
        return state;
      }
      
      const newPrestigeUpgrades = state.prestigeUpgrades.map(u =>
        u.id === action.payload
          ? { ...u, owned: u.owned + 1, cost: u.cost + 1, purchased: u.owned + 1 >= u.maxLevel }
          : u
      );
      
      return {
        ...state,
        prestigeTokens: state.prestigeTokens - prestigeUpgrade.cost,
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
      return { ...initialState, gameStartTime: Date.now() };
    
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

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
  }, []);

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
      const fluctuation = (Math.random() - 0.5) * 0.3; // ±15% change
      const newMultiplier = Math.max(0.7, Math.min(1.3, gameState.marketMultiplier + fluctuation));
      
      dispatch({
        type: 'UPDATE_MARKET',
        payload: newMultiplier
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(marketInterval);
  }, [gameState.marketMultiplier]);

  // Random events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (!gameState.currentEvent && Math.random() < 0.1) { // 10% chance every interval
        const events = [
          { id: 1, title: "Tech Breakthrough!", description: "Production efficiency increased by 20% for 60 seconds!", effect: "production", value: 1.2, duration: 60000, multiplier: 1.2 },
          { id: 2, title: "Market Boom!", description: "All markets are performing at 150% for 45 seconds!", effect: "market", value: 1.5, duration: 45000, multiplier: 1.5 },
          { id: 3, title: "Investment Opportunity", description: "Get 50% more money from sales for 30 seconds!", effect: "income", value: 1.5, duration: 30000, multiplier: 1.5 },
          { id: 4, title: "Supply Chain Issues", description: "Production costs increased by 30% for 90 seconds.", effect: "cost", value: 1.3, duration: 90000, multiplier: 0.7 },
        ];
        
        // Apply luck bonus from prestige upgrades
        const luckUpgrade = gameState.prestigeUpgrades.find(u => u.affects === 'luck' && u.owned > 0);
        if (luckUpgrade && luckUpgrade.owned > 0) {
          // Higher chance for beneficial events
          const badEventIndex = events.findIndex(e => e.effect === "cost");
          if (badEventIndex > -1 && Math.random() < luckUpgrade.effect * luckUpgrade.owned) {
            events.splice(badEventIndex, 1); // Remove bad event
          }
        }
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        dispatch({ type: 'TRIGGER_EVENT', payload: randomEvent });
        
        setTimeout(() => {
          dispatch({ type: 'CLEAR_EVENT' });
        }, randomEvent.duration);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(eventInterval);
  }, [gameState.currentEvent, gameState.prestigeUpgrades]);

  // Production loop
  useEffect(() => {
    const productionInterval = setInterval(() => {
      let totalIncome = 0;
      
      // Apply speed boost from upgrades
      const speedUpgrade = gameState.upgrades.find(u => u.affects === 'speed' && u.owned > 0);
      const prestigeSpeedBoost = gameState.prestigeUpgrades.find(u => u.affects === 'speed' && u.owned > 0);
      
      // Calculate manager efficiency
      const managerBoost = gameState.prestigeUpgrades.find(u => u.affects === 'managers' && u.owned > 0);
      const managerEfficiency = managerBoost ? Math.pow(managerBoost.multiplier, managerBoost.owned) : 1;
      
      gameState.productionLines.forEach(line => {
        if (line.owned > 0 && line.managerHired) {
          const eventMultiplier = gameState.currentEvent?.effect === 'production' ? gameState.currentEvent.multiplier : 1;
          const boostMultiplier = gameState.boostActive ? 3 : 1;
          const megaBoost = gameState.prestigeUpgrades.find(u => u.affects === 'mega' && u.owned > 0);
          const megaMultiplier = megaBoost ? Math.pow(megaBoost.multiplier, megaBoost.owned) : 1;
          
          const income = line.owned * line.baseProduction * line.level * 
                        gameState.marketMultiplier * eventMultiplier * 
                        boostMultiplier * managerEfficiency * megaMultiplier;
          
          totalIncome += income;
        }
      });
      
      if (totalIncome > 0) {
        dispatch({ type: 'UPDATE_MONEY', payload: gameState.money + totalIncome });
        dispatch({ type: 'UPDATE_PRODUCTION', payload: totalIncome });
      }
    }, 1000);

    return () => clearInterval(productionInterval);
  }, [gameState.money, gameState.productionLines, gameState.marketMultiplier, gameState.currentEvent, gameState.boostActive, gameState.prestigeUpgrades]);

  // Auto-clicker functionality
  useEffect(() => {
    if (gameState.autoClickerActive) {
      const autoClickInterval = setInterval(() => {
        // Find the most profitable line to click
        const profitableLines = gameState.productionLines
          .filter(line => line.owned > 0)
          .sort((a, b) => (b.baseProduction * b.level) - (a.baseProduction * a.level));
        
        if (profitableLines.length > 0) {
          dispatch({ type: 'CLICK_PRODUCTION', payload: profitableLines[0].id });
        }
      }, 2000); // Click every 2 seconds
      
      return () => clearInterval(autoClickInterval);
    }
  }, [gameState.autoClickerActive, gameState.productionLines]);

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
        case 'clicks':
          progress = gameState.totalClicks;
          break;
        case 'managers':
          progress = gameState.productionLines.filter(line => line.managerHired).length;
          break;
        case 'production_rate':
          // Calculate current production rate per second
          const totalRate = gameState.productionLines.reduce((total, line) => {
            if (line.owned > 0 && line.managerHired) {
              return total + (line.owned * line.baseProduction * line.level);
            }
            return total;
          }, 0);
          progress = totalRate;
          break;
        case 'total_owned':
          progress = gameState.productionLines.reduce((total, line) => total + line.owned, 0);
          break;
      }

      if (progress >= achievement.target && !unlocked) {
        unlocked = true;
      }

      return { ...achievement, progress, unlocked };
    });

    dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: updatedAchievements });
  }, [
    gameState.money, 
    gameState.totalEarned, 
    gameState.productionLines, 
    gameState.upgrades, 
    gameState.prestigeLevel,
    gameState.totalClicks
  ]);

  const purchaseUpgrade = useCallback((upgradeId: string) => {
    dispatch({ type: 'PURCHASE_UPGRADE', payload: upgradeId });
  }, []);

  const purchaseProductionLine = useCallback((lineId: string) => {
    dispatch({ type: 'PURCHASE_PRODUCTION_LINE', payload: lineId });
  }, []);

  const buyProductionLine = useCallback((lineId: string) => {
    dispatch({ type: 'PURCHASE_PRODUCTION_LINE', payload: lineId });
  }, []);

  const hireManager = useCallback((lineId: string) => {
    dispatch({ type: 'HIRE_MANAGER', payload: lineId });
  }, []);

  const clickProduction = useCallback((lineId: string) => {
    dispatch({ type: 'CLICK_PRODUCTION', payload: lineId });
  }, []);

  const buyUpgrade = useCallback((upgradeId: string) => {
    dispatch({ type: 'PURCHASE_UPGRADE', payload: upgradeId });
  }, []);

  const purchasePrestigeUpgrade = useCallback((upgradeId: string) => {
    dispatch({ type: 'PURCHASE_PRESTIGE_UPGRADE', payload: upgradeId });
  }, []);

  const buyPrestigeUpgrade = useCallback((upgradeId: string) => {
    dispatch({ type: 'PURCHASE_PRESTIGE_UPGRADE', payload: upgradeId });
  }, []);

  const claimAchievement = useCallback((achievementId: string) => {
    dispatch({ type: 'CLAIM_ACHIEVEMENT', payload: achievementId });
  }, []);

  const prestige = useCallback(() => {
    dispatch({ type: 'PRESTIGE' });
  }, []);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem('silicon-fab-empire-save');
    dispatch({ type: 'RESET_GAME' });
  }, []);

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
  }, []);

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
        if (upgrade.unlockCondition.type === 'total_earned') {
          return gameState.totalEarned >= upgrade.unlockCondition.value;
        }
      }
      return true;
    });
  }, [gameState.achievements, gameState.totalSpent, gameState.prestigeLevel, gameState.upgrades, gameState.totalEarned]);

  const getVisibleAchievements = useCallback(() => {
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
    buyProductionLine,
    hireManager,
    clickProduction,
    buyUpgrade,
    purchasePrestigeUpgrade,
    buyPrestigeUpgrade,
    claimAchievement,
    prestige,
    updateSettings,
    saveGame,
    loadGame,
    resetGame,
    exportSave,
    importSave,
    getVisibleUpgrades,
    getVisibleAchievements,
    dispatch
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
