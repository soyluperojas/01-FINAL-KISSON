
import { useState, useRef, useEffect } from "react";

type TransitionState = "idle" | "enter-forward" | "exit-forward" | "enter-backward" | "exit-backward";
type Direction = "forward" | "backward";

export const useStepTransitions = () => {
  const [transition, setTransition] = useState<TransitionState>("idle");
  const [direction, setDirection] = useState<Direction>("forward");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Enhanced animation helper for step transitions
  const animateStepChange = (callback: () => void) => {
    const exitDirection = direction === "forward" ? "exit-forward" : "exit-backward";
    const enterDirection = direction === "forward" ? "enter-forward" : "enter-backward";
    setTransition(exitDirection);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
      setTransition(enterDirection);
      timeoutRef.current = setTimeout(() => {
        setTransition("idle");
      }, 400);
    }, 400);
  };

  const getTransitionClass = () => {
    switch (transition) {
      case "enter-forward":
        return "page-enter-forward";
      case "exit-forward":
        return "page-exit-forward";
      case "enter-backward":
        return "page-enter-backward";
      case "exit-backward":
        return "page-exit-backward";
      default:
        return "";
    }
  };

  return {
    transition,
    direction,
    setDirection,
    animateStepChange,
    getTransitionClass
  };
};
