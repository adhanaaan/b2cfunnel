import { useDemoContext } from "./DemoContext";

export function DemoArrow(props: React.SVGProps<SVGSVGElement>) {
  const { colors } = useDemoContext().data;
  return (
    <svg width="64" height="64" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M39.1799 9.84924C38.3361 9.00654 37.1924 8.5332 35.9999 8.5332C34.8074 8.5332 33.6636 9.00654 32.8199 9.84924L15.8429 26.8172C14.9987 27.6614 14.5244 28.8064 14.5244 30.0002C14.5244 31.1941 14.9987 32.3391 15.8429 33.1832C16.687 34.0274 17.832 34.5017 19.0259 34.5017C20.2197 34.5017 21.3647 34.0274 22.2089 33.1832L31.4999 23.8952V58.5002C31.4999 59.6937 31.974 60.8383 32.8179 61.6822C33.6618 62.5261 34.8064 63.0002 35.9999 63.0002C37.1933 63.0002 38.3379 62.5261 39.1818 61.6822C40.0258 60.8383 40.4999 59.6937 40.4999 58.5002V23.8952L49.7879 33.1832C50.6321 34.0274 51.7771 34.5017 52.9709 34.5017C54.1648 34.5017 55.3098 34.0274 56.1539 33.1832C56.9981 32.3391 57.4724 31.1941 57.4724 30.0002C57.4724 28.8064 56.9981 27.6614 56.1539 26.8172L39.1799 9.84924Z"
        fill="url(#demoArrowGrad)"
      />
      <defs>
        <linearGradient id="demoArrowGrad" x1="36" y1="8.5" x2="36" y2="63" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDFDFD" />
          <stop offset="1" stopColor={colors.arrow2 ?? "#E0D0E7"} />
        </linearGradient>
      </defs>
    </svg>
  );
}
