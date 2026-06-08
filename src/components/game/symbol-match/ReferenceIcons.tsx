import { motion } from "framer-motion";
import { IconList } from "./utils";

const lightGlass =
  "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.435111) 50.99%, rgba(255, 255, 255, 0.415625) 87.11%, rgba(255, 255, 255, 0.0510417) 132.43%, rgba(255, 255, 255, 0) 147.3%)";

export function ReferenceIcons({ randomList }: { randomList: number[] }) {
  return (
    <div
      id="sb-reference-icons"
      className="grid grid-cols-5 c-shadow w-full rounded-[40px] gap-1 tall:gap-2 px-4 py-1 tall:py-3"
      style={{ background: lightGlass }}
    >
      {[...Array(10)].map((_, idx) => (
        <div key={idx} id={`sb-reference-icon-${idx}`} className="w-fit">
          <h5
            className="text-lg font-bold text-center"
            style={{ fontSize: 16, lineHeight: "22px" }}
          >
            {idx}
          </h5>
          <motion.img
            key={IconList[randomList[idx]]}
            layoutId={IconList[randomList[idx]]}
            className="size-8 tall:size-10"
            src={`/images/task-2/${IconList[randomList[idx]]}`}
            alt=""
          />
        </div>
      ))}
    </div>
  );
}
