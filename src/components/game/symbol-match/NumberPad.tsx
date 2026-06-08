import { useEffect } from "react";
import { NumberButton } from "./NumberButton";
import type { ResultType } from "./useResult";

function vibrate(duration = 100) {
  try {
    navigator.vibrate?.(duration);
  } catch {}
}

interface Props {
  activeElement: number;
  randomList: number[];
  setResult: (x: ResultType) => void;
}

export function NumberPad({ randomList, activeElement, setResult }: Props) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key;
      if (key < "0" || key > "9") return;
      const idx = parseInt(key, 10);
      document.getElementById(`sb-number-pad-${idx}`)?.click();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      id="sb-number-pad"
      className="c-shadow px-5 py-2 tall:py-3 w-full tall-lg:py-5 mx-auto rounded-[40px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.435111) 50.99%, rgba(255, 255, 255, 0.415625) 87.11%, rgba(255, 255, 255, 0.0510417) 132.43%, rgba(255, 255, 255, 0) 147.3%)",
      }}
    >
      <div className="grid flex-wrap items-start grid-cols-3 gap-2 tall:gap-3 mx-auto w-fit">
        {[...Array(10)].map((_, i) => {
          const idx = (i + 1) % 10;
          const active = randomList[idx] === activeElement;
          return (
            <NumberButton
              key={idx}
              id={`sb-number-pad-${idx}`}
              onClick={() => {
                if (active) {
                  setResult("success");
                  return true;
                }
                vibrate();
                setResult("error");
                return false;
              }}
            >
              {idx}
            </NumberButton>
          );
        })}
      </div>
    </div>
  );
}
