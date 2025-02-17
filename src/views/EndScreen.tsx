// src/views/EndScreen.tsx
import { FC, useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Image 
} from "@chakra-ui/react";
import { Button } from "../components/Button";
import { LastVoiceMessage } from "../components/LastVoiceMessage";
import { Backdrop } from "../components/WebGLBackdrop";
import { VoiceAnimationState } from "../components/VoiceAnimation";
import { calculateAverageEmotionMessage, calculateCallDuration  } from "../utils/emotionUtils";
import { motion } from "framer-motion";
import { cn } from "../utils";
import EmotionPlot from "../components/EmotionPlot";
import html2canvas from "html2canvas";
import imageCompression from 'browser-image-compression'; // Import the image compression library
import { sendEmailWithImage } from "wasp/client/operations";
import useMessagesStore from "../store/messagesStore";
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from "@humeai/voice";
import { ThumbsUp } from "lucide-react";
import stripe2Image from "/stripe2.png";
import { blobToFile } from "../utils/blobToFile"; // Import the blobToFile utility function

export const EndScreen: FC<{
  onTryAgain: () => void;
}> = ({ onTryAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messages = useMessagesStore((state) => state.messages);

  const userMessages = messages.filter(
    (message): message is UserTranscriptMessage =>
      message.type === "user_message"
  );
  const averageEmotionMessage = calculateAverageEmotionMessage(userMessages);

  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const hiddenPlotRef = useRef<HTMLDivElement>(null);
  const [cost, setCost] = useState("");

  useEffect(() => {
    // Calculate the call duration and cost
    const durationInMs = calculateCallDuration(messages);
    const minutes = durationInMs / 60000;
    const calculatedCost = (minutes * 0.35).toFixed(2);
    setCost(calculatedCost);
  }, [messages]);
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsError(false);
  };

  const handleSubmit = async () => {
    if (!email) {
      setIsError(true);
      return;
    }

    if (hiddenPlotRef.current) {
      const canvas = await html2canvas(hiddenPlotRef.current, {
        // width: 1280, // A4 width in pixels at 96 DPI
        // height: 1280, // A4 height in pixels at 96 DPI
      });
      const imageData = canvas.toDataURL("image/png");

      // Compress the image data
      const compressedImageData = await compressImage(imageData);

      try {
        await sendEmailWithImage({ email, imageData: compressedImageData });
        setIsSuccess(true); // Set success state to true
        onClose();
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }
  };

  const compressImage = async (base64Image: string): Promise<string> => {
    const imageBlob = await fetch(base64Image).then(res => res.blob());
    const imageFile = blobToFile(imageBlob, 'image.png'); // Convert Blob to File
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true
    };
    const compressedFile = await imageCompression(imageFile, options);
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handlePledgeNowClick = () => {
    window.open("https://buy.stripe.com/4gwaFhf3Hc3T1he3cc", "_blank");
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center h-screen px-12 gap-4"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, translateY: -4 }}
      transition={{ duration: 2 }}
    >
      {!isSuccess ? (
        <>
          <Box>
            <VStack pt={0} spacing={2} align="center">
              <h2 className="text-center text-2xl">
                <span>Top Averages:</span>
              </h2>
              <Box>
                <LastVoiceMessage
                  lastVoiceMessage={averageEmotionMessage}
                  position="top"
                />
              </Box>
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
                <Button onClick={onTryAgain} className="mx-auto">
                  Try again
                </Button>
              </motion.div>
            </VStack>
            <Backdrop
              prosody={averageEmotionMessage?.models.prosody?.scores ?? {}}
              activeView={VoiceAnimationState.IDLE}
            />
          </Box>

          <Modal isOpen={isOpen} onClose={onClose} isCentered size={["sm", "md"]}>
            <ModalOverlay />
            <ModalContent mx={4}>
              <ModalHeader>Call Summary</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isInvalid={isError}>
                  {/* <FormLabel>We send it as an email to prevent abuse</FormLabel> */}
                  <Input
                    type="email"
                    id="email"
                    color="blackAlpha"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Your preferred email"
                    isRequired
                    variant={"flushed"}
                  />
                  {isError ? (
                    <FormErrorMessage>Email is required.</FormErrorMessage>
                  ) : null}
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleSubmit} className="mt-8 mx-auto">
                  Send me
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        // Success component
        <Box className="flex flex-col items-center justify-center mb-32 mt-32 animate-slideUpAndFade">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 45, 0] }}
            transition={{ duration: 1 }}
          >
            <ThumbsUp size={48} color="gray" />
          </motion.div>
          <motion.p
            className="text-left text-2xl mt-16 font-bold text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            We are on a mission to eradicate anxiety through technology.
          </motion.p>
          <motion.p
            className="text-left text-lg mt-4 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Pledge today for a future living free from anxiety.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Image pt={2} pb={2} src="/stripe1.png" alt="Stripe 1" />
            <Button
              onClick={handlePledgeNowClick}
              className="mt-4 mx-auto"
            >
              Pledge now
            </Button>
            <Image pt={4} pb={8} src="/stripe2.png" alt="Stripe 2" />
          </motion.div>

          <motion.p
            className="text-center text-md mt-2 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {/* We all deserve to feel. */}
          </motion.p>
        </Box>
      )}

      {/* Hidden container for EmotionPlot */}
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          // width: "1280x", // Fixed width
          // height: "1280px", // Fixed height
          overflow: "hidden", // Ensure nothing spills over the container size
          padding: "10px 30px", // Reduced padding or margin here
        }}
      >
        <div ref={hiddenPlotRef} style={{ width: "100%", height: "100%" }}>
          <EmotionPlot />
        </div>
      </div>
    </motion.div>
  );
};
