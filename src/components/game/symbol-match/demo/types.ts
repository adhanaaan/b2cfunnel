export type DemoElement = {
  id: string;
  className?: string;
  instructionClassName?: string;
  onClick?: () => void;
  instruction?: string;
  arrow?: boolean;
  arrowStyle?: React.CSSProperties;
  showNextBtn?: boolean;
  showPreviousBtn?: boolean;
  side?: "bottom" | "top";
  style?: React.CSSProperties;
  children?: React.ReactNode;
  texts?: Record<string, string>;
};

export type DemoStep = {
  delay?: number;
  hideOverlay?: boolean;
  elements: DemoElement[];
  interactive?: boolean;
  demoNextEvent?: string;
};

declare global {
  interface Window {
    demoInteractive?: boolean;
    demoCurrentStep?: number;
  }
}

/** Advance the demo (interactive steps listen for this). */
export function demoNextStep(event = "demo-next") {
  window.dispatchEvent(new Event(event));
}
