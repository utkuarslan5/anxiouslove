import { Button } from "../components/Button";
import { CircledText } from "../components/CircledText";
import { motion } from "framer-motion";
import { cn } from "../utils";
import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";

export const IntroScreen = ({
  onConnect,
  isConnecting,
}: {
  onConnect: () => void;
  isConnecting: boolean;
}) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center h-screen px-12 gap-8"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, translateY: -4 }}
      transition={{ duration: 2 }}
    >
      {
        <>
          <h2 className="text-center text-3xl">
            
            <CircledText>
              Anxiety
            </CircledText>
            <span> 
              -AI  Companion
            </span>
            <br />
          </h2>
          <p className="text-center text-xl text-gray-500">
            Hi, I'm Eli&mdash;I'm here to listen and soothe to your anxiety.
          </p>

          <div className="w-fit">
            <motion.div
              variants={{
                initial: {
                  y: "100%",
                  opacity: 0,
                },
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    opacity: {
                      duration: 0.7,
                      ease: "easeInOut",
                    },
                    y: {
                      duration: 1.1,
                      ease: "easeInOut",
                    },
                  },
                },
                exit: {
                  opacity: 0,
                },
              }}
            >
              <Button
                onClick={() => {
                  onConnect();
                }}
                isLoading={isConnecting}
                loadingText={"Connecting..."}
              >
                Start Demo
              </Button>
            </motion.div>
          </div>
        </>
      }
    </motion.div>
  );
};
