"use client";
import { isExpressionColor } from "../utils/isExpressionColor";
import { expressionColors } from "expression-colors";
import { CSSProperties } from "react";
import { motion } from "framer-motion";
import * as R from "remeda";

export default function Expressions({
  values,
}: {
  values: Record<string, number>;
}) {
  const top3 = R.pipe(
    values,
    R.entries(),
    R.sortBy(R.pathOr([1], 0)),
    R.reverse(),
    R.take(3)
  );

  const getColor = (key: string) => {
    if (isExpressionColor(key)) {
      return expressionColors[key].hex;
    }
    return "#D3D3D3"; // Default color if the key is not found
  };

  return (
    <div
      className={
        "text-xs p-3 w-full border-t border-border flex flex-col md:flex-row gap-3"
      }
    >
      {top3.map(([key, value]) => (
        <div key={key} className={"w-full overflow-hidden"}>
          <div
            className={"flex items-center justify-between gap-1 font-mono pb-1"}
          >
            <div className={"font-medium truncate"}>{key}</div>
            <div className={"tabular-nums opacity-50"}>{value.toFixed(2)}</div>
          </div>
          <div className={"relative h-1"}>
            <div
              className={
                "absolute top-0 left-0 size-full rounded-full opacity-10"
              }
              style={{ backgroundColor: getColor(key) }}
            />
            <motion.div
              className={"absolute top-0 left-0 h-full rounded-full"}
              initial={{ width: 0 }}
              animate={{
                width: `${R.pipe(
                  value,
                  R.clamp({ min: 0, max: 1 }),
                  (value) => `${value * 100}%`
                )}`,
                backgroundColor: getColor(key),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
