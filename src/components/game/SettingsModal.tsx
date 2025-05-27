
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { X, Volume2, VolumeX, Bell, BellOff, Save, RotateCcw, Download, Upload, Copy, Clipboard } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { gameState, updateSettings, saveGame, resetGame, exportSave, importSave } = useGame();
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your game? This cannot be undone!')) {
      resetGame();
      onClose();
    }
  };

  const handleCopyExport = async () => {
    try {
      const saveData = exportSave();
      await navigator.clipboard.writeText(saveData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: create a text area and select the text
      const textArea = document.createElement('textarea');
      textArea.value = exportSave();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handlePasteImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setImportText(text);
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
    }
  };

  const handleImport = () => {
    if (importText.trim()) {
      const success = importSave(importText.trim());
      if (success) {
        setImportText('');
        setShowImport(false);
        onClose();
      } else {
        alert('Invalid save data. Please check your input and try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-4 sm:p-6 lg:p-8 max-w-md w-full mx-4 border border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
              <span className="text-white text-sm sm:text-base">Sound Effects</span>
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
              <span className="text-white text-sm sm:text-base">Notifications</span>
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
              <span className="text-white text-sm sm:text-base">Auto Save</span>
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
              className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Save Game</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyExport}
                className="bg-green-500 hover:bg-green-600 py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                {copySuccess ? (
                  <>
                    <Clipboard className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Save</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowImport(!showImport)}
                className="bg-purple-500 hover:bg-purple-600 py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
            </div>

            {showImport && (
              <div className="space-y-3 p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Paste your save data:</label>
                  <button
                    onClick={handlePasteImport}
                    className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded transition-colors"
                  >
                    Paste
                  </button>
                </div>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full h-32 bg-slate-800 border border-gray-600 rounded p-2 text-sm text-white resize-none"
                  placeholder="Paste your save data here..."
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleImport}
                    disabled={!importText.trim()}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 py-2 rounded font-bold transition-colors text-sm"
                  >
                    Import Save
                  </button>
                  <button
                    onClick={() => {
                      setShowImport(false);
                      setImportText('');
                    }}
                    className="px-4 bg-gray-600 hover:bg-gray-700 py-2 rounded transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
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
