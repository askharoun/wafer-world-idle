
import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to SiliconFab Empire!",
    content: "Build and manage your semiconductor manufacturing empire. Start by extracting silicon and work your way up to producing cutting-edge CPUs and GPUs!",
    image: "🏭"
  },
  {
    title: "Production Lines",
    content: "Click on production line icons to manually produce items. Buy more facilities to increase your production capacity. Each line represents a different stage of semiconductor manufacturing.",
    image: "⛏️"
  },
  {
    title: "Hire Managers",
    content: "Hire managers to automate your production lines. Once hired, managers will continuously produce items without manual clicking, allowing you to focus on expansion.",
    image: "👨‍💼"
  },
  {
    title: "Upgrades & Growth",
    content: "Purchase upgrades to multiply your production efficiency. Invest in research and development to unlock advanced manufacturing techniques and increase profitability.",
    image: "🔬"
  },
  {
    title: "Prestige System",
    content: "When you've earned enough money, you can prestige to restart with powerful bonuses. This allows for exponential growth and unlocks new content!",
    image: "⭐"
  }
];

const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tutorial
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">{step.image}</div>
          <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
          <p className="text-gray-300 text-lg leading-relaxed">{step.content}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              currentStep === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <span>{currentStep === tutorialSteps.length - 1 ? 'Start Playing' : 'Next'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
