import { useState, useCallback } from 'react';

export type InitializationState = 'initializing' | 'ready' | 'error' | 'recording';

interface InitializationError {
  type: 'canvas' | 'image' | 'animation';
  message: string;
}

export const useHologramInitialization = () => {
  const [state, setState] = useState<InitializationState>('initializing');
  const [error, setError] = useState<InitializationError | null>(null);
  const [progress, setProgress] = useState(0);

  const setCanvasError = useCallback((message: string) => {
    setError({ type: 'canvas', message });
    setState('error');
  }, []);

  const setImageError = useCallback((message: string) => {
    setError({ type: 'image', message });
    setState('error');
  }, []);

  const setAnimationError = useCallback((message: string) => {
    setError({ type: 'animation', message });
    setState('error');
  }, []);

  const setReady = useCallback(() => {
    setError(null);
    setState('ready');
    setProgress(100);
  }, []);

  const setRecording = useCallback(() => {
    setState('recording');
  }, []);

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(newProgress);
  }, []);

  const reset = useCallback(() => {
    setState('initializing');
    setError(null);
    setProgress(0);
  }, []);

  return {
    state,
    error,
    progress,
    setCanvasError,
    setImageError,
    setAnimationError,
    setReady,
    setRecording,
    updateProgress,
    reset
  };
};
