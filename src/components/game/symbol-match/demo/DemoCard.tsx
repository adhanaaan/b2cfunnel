import { twMerge } from "tailwind-merge";
import { useDemoContext } from "./DemoContext";
import { BackIcon } from "./icons";

export interface DemoCardProps {
  instruction?: string;
  instructionClassName?: string;
  showActions?: boolean;
  showNextBtn?: boolean;
  showPreviousBtn?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  texts?: Record<string, string>;
}

export function DemoCard({
  instruction,
  instructionClassName,
  showActions = true,
  showNextBtn,
  showPreviousBtn,
  onNext,
  onPrevious,
  texts = {},
}: DemoCardProps) {
  const { colors } = useDemoContext().data;
  const showAnyAction = showActions || showNextBtn || showPreviousBtn;

  return (
    <div
      className={twMerge(
        "mx-auto overflow-hidden w-72 rounded-3xl text-base font-medium c-shadow",
        instructionClassName,
      )}
    >
      <div
        className="px-4 py-6 font-bold text-center whitespace-pre-line"
        style={{
          color: "#3A3A3A",
          background: "linear-gradient(180deg, #FDFDFD 0%, #DBDBDB 100%)",
        }}
      >
        {instruction}
      </div>
      {showAnyAction && (
        <div className="f">
          {(showPreviousBtn ?? onPrevious) && (
            <button
              className="flex-1 px-4 py-2 font-bold c"
              style={{
                color: colors.color,
                backgroundImage: `linear-gradient(180deg, ${colors.previousBtn1} 0%, ${colors.previousBtn2} 100%)`,
              }}
              onClick={() => onPrevious?.()}
            >
              <BackIcon className="w-4 mr-1 -ml-1" /> {texts.previous ?? "Back"}
            </button>
          )}
          {(showNextBtn ?? onNext) && (
            <button
              className="flex-1 px-4 py-2 font-bold c"
              onClick={() => onNext?.()}
              style={{
                color: "white",
                backgroundImage: `linear-gradient(180deg, ${colors.secondaryColor} 1%, ${colors.color} 99%)`,
              }}
            >
              <span className="f items-center">
                {texts.next ?? "Next"}{" "}
                <BackIcon className="w-4 ml-1 -mr-1 rotate-180" />
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
