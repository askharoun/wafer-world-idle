
import React from 'react';
import BoostButton from './BoostButton';
import MegaClickButton from './MegaClickButton';
import { Activity } from 'lucide-react';

const ActionPanel = () => {
  return (
    <div className="w-full bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center space-x-2">
        <Activity className="w-6 h-6 text-cyan-400" />
        <span>Action Center</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BoostButton />
        <MegaClickButton />
      </div>
    </div>
  );
};

export default ActionPanel;
