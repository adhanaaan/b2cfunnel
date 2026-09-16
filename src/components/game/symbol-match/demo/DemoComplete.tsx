import { createPortal } from "react-dom";
import { DemoCard } from "./DemoCard";
import { useDemoContext } from "./DemoContext";

/** Final demo card: start the real test, or try the tour again. */
export function DemoComplete() {
  const {
    data: { onComplete, texts },
  } = useDemoContext();

  return createPortal(
    <div className="fixed inset-0 z-[998] cc gap-y-8 bg-black/75 font-medium">
      <DemoCard
        instruction={texts.completeHeading}
        onNext={onComplete}
        onPrevious={() => window.dispatchEvent(new Event("demo.reset"))}
        texts={{ next: texts.completeStart, previous: texts.completeRetry }}
      />
    </div>,
    document.body,
  );
}
