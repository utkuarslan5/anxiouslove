import {
  Button,
  Link as ChakraLink,
  useToast,
  Box,
  Text,
  VStack,
  Center,
} from "@chakra-ui/react";
import { CircledText } from "../components/CircledText";
import { cn } from "../utils";
import React, { useEffect } from "react";
import { useAuth, logout } from "wasp/client/auth";
import { LogIn, LogOut, ChevronRight } from "lucide-react";

export const IntroScreen = ({
  onConnect,
  isConnecting,
}: {
  onConnect: () => void;
  isConnecting: boolean;
}) => {
  const { data: user } = useAuth();

  return (
    <Center height="100vh">
      <VStack spacing={8} align="center" justify="center">
        <Text as="h2" textAlign="center" fontSize="3xl">
          <CircledText>Lorem</CircledText>
          <span> Ipsum Dolor</span>
        </Text>
        <Text textAlign="center" fontSize="xl" color="gray.500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>

        <VStack spacing={4} align="center">
          <Button
            onClick={onConnect}
            isLoading={isConnecting}
            loadingText={"Connecting..."}
            rightIcon={<ChevronRight />}
            colorScheme="teal"
            width="200px"
            height="50px"
          >
            Start Demo
          </Button>

          {user ? (
            <Button
              onClick={logout}
              variant="link"
              size="lg"
              width="200px"
              height="50px"
            >
              <LogOut />
            </Button>
          ) : (
            <ChakraLink href="/login">
              <Button
                variant="outline"
                size="lg"
                rightIcon={<LogIn />}
                width="200px"
                height="50px"
              >
                Log In
              </Button>
            </ChakraLink>
          )}
        </VStack>
      </VStack>
    </Center>
  );
};
