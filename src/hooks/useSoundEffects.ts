
import { useRef, useCallback } from 'react';

interface SoundEffects {
  playClick: () => void;
  playPurchase: () => void;
  playPrestige: () => void;
  playAchievement: () => void;
  playProduction: () => void;
}

export const useSoundEffects = (): SoundEffects => {
  const audioContext = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    try {
      const ctx = initAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      // Silently handle audio errors
      console.warn('Audio playback failed:', error);
    }
  }, [initAudioContext]);

  const playClick = useCallback(() => {
    playTone(800, 0.1, 'square', 0.05);
  }, [playTone]);

  const playPurchase = useCallback(() => {
    playTone(523, 0.2, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.2, 'sine', 0.1), 100);
  }, [playTone]);

  const playPrestige = useCallback(() => {
    playTone(523, 0.3, 'sine', 0.15);
    setTimeout(() => playTone(659, 0.3, 'sine', 0.15), 150);
    setTimeout(() => playTone(784, 0.4, 'sine', 0.15), 300);
  }, [playTone]);

  const playAchievement = useCallback(() => {
    playTone(440, 0.2, 'sine', 0.1);
    setTimeout(() => playTone(554, 0.2, 'sine', 0.1), 100);
    setTimeout(() => playTone(659, 0.3, 'sine', 0.1), 200);
  }, [playTone]);

  const playProduction = useCallback(() => {
    playTone(200, 0.1, 'square', 0.03);
  }, [playTone]);

  return {
    playClick,
    playPurchase,
    playPrestige,
    playAchievement,
    playProduction,
  };
};
