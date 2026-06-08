"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { twJoin } from "tailwind-merge";
import type { DemoElement } from "./types";
import { DemoComplete } from "./DemoComplete";
import { useDemoContext } from "./DemoContext";
import { DemoHighlight } from "./DemoHighlight";

function getStyles(show: boolean, elements?: DemoElement[]) {
  if (!show || !elements || typeof document === "undefined") return [];
  return elements
    .map((x) => ({ node: document.getElementById(x.id)!, ...x }))
    .filter((x) => !!x.node)
    .map(({ node, ...x }) => {
      const c = node.getBoundingClientRect();
      return {
        ...x,
        style: {
          height: c.height,
          width: c.width,
          left: c.x,
          top: c.y,
          ...x.style,
        } as { height: number; width: number; left: number; top: number },
      };
    });
}

export function Demo() {
  const {
    data: { steps },
    state: { currentStep, previousStep, step, hasMounted },
    actions: { setHasMounted, moveToNextStep, moveToPreviousStep },
  } = useDemoContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const {
    interactive,
    delay,
    elements,
    hideOverlay,
    demoNextEvent = "demo-next",
  } = step ?? {};

  const nodes = useMemo(
    () => getStyles(hasMounted, elements),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasMounted, currentStep],
  );

  useEffect(() => {
    if (currentStep <= previousStep) {
      setHasMounted(true);
      return;
    }
    const timeout = setTimeout(() => setHasMounted(true), delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const showOverlay = hideOverlay === undefined ? nodes.length : !hideOverlay;
  const isTriggered = interactive || !showOverlay;
  const isDemoCompleted = currentStep === steps.length;

  useEffect(() => {
    if (!step || !hasMounted || !isTriggered) return;
    window.demoInteractive = true;
    window.demoCurrentStep = currentStep;
    window.addEventListener(demoNextEvent, moveToNextStep);
    return () => {
      window.demoInteractive = undefined;
      window.demoCurrentStep = undefined;
      window.removeEventListener(demoNextEvent, moveToNextStep);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, currentStep, hasMounted, isTriggered]);

  if (!mounted) return null;

  return createPortal(
    isDemoCompleted ? (
      <DemoComplete />
    ) : (
      <Fragment>
        <div
          className={twJoin(
            "fixed inset-0 z-[998] w-full h-full bg-black/70",
            isTriggered && "pointer-events-none",
          )}
          style={{ display: showOverlay ? undefined : "none" }}
        >
          {nodes.map((x, idx) => (
            <DemoHighlight
              key={idx}
              onNext={moveToNextStep}
              onPrevious={currentStep === 0 ? undefined : moveToPreviousStep}
              showActions={!isTriggered}
              {...x}
            />
          ))}
        </div>
      </Fragment>
    ),
    document.body,
  );
}
