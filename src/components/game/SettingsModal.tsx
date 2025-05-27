
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { X, Volume2, VolumeX, Bell, BellOff, Save, RotateCcw, Download } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { gameState, updateSettings, saveGame, resetGame } = useGame();

  if (!isOpen) return null;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your game? This cannot be undone!')) {
      resetGame();
      onClose();
    }
  };

  const exportSave = () => {
    const saveData = JSON.stringify(gameState, null, 2);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'silicon-fab-empire-save.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {gameState.settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-white">Sound Effects</span>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !gameState.settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors ${
                gameState.settings.soundEnabled ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  gameState.settings.soundEnabled ? 'transform translate-x-6' : 'transform translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Notifications Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {gameState.settings.notificationsEnabled ? (
                <Bell className="w-5 h-5 text-green-400" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-white">Notifications</span>
            </div>
            <button
              onClick={() => updateSettings({ notificationsEnabled: !gameState.settings.notificationsEnabled })}
              className={`w-12 h-6 rounded-full transition-colors ${
                gameState.settings.notificationsEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  gameState.settings.notificationsEnabled ? 'transform translate-x-6' : 'transform translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Auto-save Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Save className="w-5 h-5 text-yellow-400" />
              <span className="text-white">Auto Save</span>
            </div>
            <button
              onClick={() => updateSettings({ autoSave: !gameState.settings.autoSave })}
              className={`w-12 h-6 rounded-full transition-colors ${
                gameState.settings.autoSave ? 'bg-yellow-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  gameState.settings.autoSave ? 'transform translate-x-6' : 'transform translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Game Actions */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            <button
              onClick={saveGame}
              className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Game</span>
            </button>

            <button
              onClick={exportSave}
              className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export Save</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset Game</span>
            </button>
          </div>

          {/* Game Stats */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-bold mb-3 text-gray-300">Game Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Prestige Level:</span>
                <span className="text-white">{gameState.prestigeLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Earned:</span>
                <span className="text-white">${gameState.totalEarned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Spent:</span>
                <span className="text-white">${gameState.totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Save:</span>
                <span className="text-white">
                  {new Date(gameState.lastSave).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
