
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Zap, DollarSign, Cpu } from 'lucide-react';

const iconMap = {
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Cpu
};

const events = [
  {
    id: 'chip-shortage',
    title: 'Global Chip Shortage!',
    description: 'High demand for semiconductors has created a shortage. Production values doubled for the next 60 seconds!',
    effect: 'Production x2',
    duration: 60000,
    multiplier: 2,
    icon: 'TrendingUp',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'market-boom',
    title: 'AI Technology Boom!',
    description: 'Artificial intelligence demand has skyrocketed! All production tripled for the next 45 seconds!',
    effect: 'Production x3',
    duration: 45000,
    multiplier: 3,
    icon: 'Zap',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'supply-disruption',
    title: 'Supply Chain Disruption',
    description: 'Raw material shortages have impacted production. Efficiency reduced by 50% for 30 seconds.',
    effect: 'Production x0.5',
    duration: 30000,
    multiplier: 0.5,
    icon: 'TrendingDown',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'crypto-surge',
    title: 'Cryptocurrency Surge!',
    description: 'Mining demand increases chip prices. Income multiplied by 4 for 40 seconds!',
    effect: 'Income x4',
    duration: 40000,
    multiplier: 4,
    icon: 'DollarSign',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'tech-breakthrough',
    title: 'Quantum Computing Breakthrough!',
    description: 'New quantum tech increases all efficiency by 500% for 90 seconds!',
    effect: 'Production x5',
    duration: 90000,
    multiplier: 5,
    icon: 'Cpu',
    color: 'from-blue-500 to-cyan-600'
  }
];

const EventModal = () => {
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (!currentEvent && Math.random() < 0.12) { // 12% chance every 30 seconds
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setCurrentEvent(randomEvent);
        setTimeRemaining(randomEvent.duration);
      }
    }, 30000);

    return () => clearInterval(eventInterval);
  }, [currentEvent]);

  useEffect(() => {
    if (currentEvent && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            setCurrentEvent(null);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentEvent, timeRemaining]);

  const closeEvent = () => {
    setCurrentEvent(null);
    setTimeRemaining(0);
  };

  if (!currentEvent) return null;

  const IconComponent = iconMap[currentEvent.icon as keyof typeof iconMap];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-gradient-to-r ${currentEvent.color} p-1 rounded-xl shadow-2xl animate-scale-in`}>
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg p-6 max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <IconComponent className="w-8 h-8 text-white" />
              <h3 className="font-bold text-white text-lg">{currentEvent.title}</h3>
            </div>
            <button
              onClick={closeEvent}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-200 text-sm mb-4">{currentEvent.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="bg-black/30 px-3 py-1 rounded-full text-sm font-semibold">
              {currentEvent.effect}
            </span>
            <span className="text-sm text-gray-300">
              {Math.ceil(timeRemaining / 1000)}s remaining
            </span>
          </div>
          
          <div className="bg-black/20 rounded-full h-2">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{
                width: `${(timeRemaining / currentEvent.duration) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
