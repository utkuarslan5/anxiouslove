import {
  Button,
  useToast,
  Box,
  Text,
  VStack,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useBreakpointValue,
  HStack,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { CircledText } from "../components/CircledText";
import { cn } from "../utils";
import React, { useEffect } from "react";
import { useAuth, logout } from "wasp/client/auth";
import { LogIn, LogOut, Play } from "lucide-react";
import { LoginPage } from "../auth/LoginPage"; // Import the LoginPage
import AnimatedBackdrop  from "../components/WebGLBackdrop/AnimatedBackdrop";

export const IntroScreen = ({
  onConnect,
  isConnecting,
}: {
  onConnect: () => void;
  isConnecting: boolean;
}) => {
  const { data: user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hook to manage modal state

  return (
    <>
      <AnimatedBackdrop />
      <VStack spacing={8}>
        <Box position="absolute" top={4} right={4}>
          {user ? (
            <IconButton
              onClick={logout}
              variant="ghost"
              aria-label="Log out"
              icon={<LogOut color="gray" size={24} />}
            />
          ) : (
            <>
              <IconButton
                onClick={onOpen}
                variant="ghost"
                aria-label="Log in"
                icon={<LogIn color="gray" size={24} />}
              />
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <LoginPage />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          )}
        </Box>

        <Stack
          direction={["row"]}
          spacing={4}
          align="center"
          position="absolute"
          bottom="33%"
        >
          <Button
            onClick={onConnect}
            isLoading={isConnecting}
            // loadingText={"Connecting..."}
            colorScheme="blackAlpha"
            variant="solid"
            width="50px"
            height="50px"
            borderRadius="full"
            bg="black"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.15)"
          >
            <Play color="white" size={24} />
          </Button>
        </Stack>
      </VStack>
    </>
  );
};
