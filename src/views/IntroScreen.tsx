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
  const isMobile =/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const toast = useToast();

  useEffect(() => {
    if (isMobile) {
      toast({
        icon: "🎉",
        title: "Our mobile demo is still experimental",
        description: "Please let us know how it goes via utkuvonarslan@gmail.com",
        status: "warning",
        duration: 8000,
        isClosable: true,
      });
    }
  }, [isMobile, toast]);

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
            <span>
              Hi, I'm Eliza-
              <br className="sm:hidden" />
            </span>
            <span> </span>
            <br />
            <CircledText> Emotional</CircledText>
            <span> AI.</span>
          </h2>
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
                Start Call
              </Button>
            </motion.div>
          </div>
        </>
      }
    </motion.div>
  );
};
