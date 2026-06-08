"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { DemoStep } from "./types";

export type DemoContextDataType = {
  title: string;
  steps: DemoStep[];
  colors: Record<string, string>;
  texts: Record<string, string>;
  onComplete: () => void; // called when the tour finishes (advance the funnel)
};

export type DemoContextType = {
  data: DemoContextDataType;
  state: {
    currentStep: number;
    previousStep: number;
    hasMounted: boolean;
    step?: DemoStep;
  };
  actions: {
    setCurrentStep: (step: number) => void;
    setHasMounted: (mounted: boolean) => void;
    moveToNextStep: () => void;
    moveToPreviousStep: () => void;
  };
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({
  value,
  children,
}: {
  value: DemoContextDataType;
  children: ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(-1);
  const [hasMounted, setHasMounted] = useState(false);

  const moveToNextStep = useCallback(() => {
    setHasMounted(false);
    setCurrentStep((x) => {
      setPreviousStep(x);
      return x + 1;
    });
  }, []);

  const moveToPreviousStep = useCallback(() => {
    setHasMounted(false);
    setCurrentStep((x) => {
      setPreviousStep(x);
      return x - 1;
    });
  }, []);

  return (
    <DemoContext.Provider
      value={{
        data: value,
        state: {
          currentStep,
          hasMounted,
          step: value.steps[currentStep],
          previousStep,
        },
        actions: {
          setCurrentStep,
          setHasMounted,
          moveToNextStep,
          moveToPreviousStep,
        },
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemoContext must be used within a DemoProvider");
  return value;
}
