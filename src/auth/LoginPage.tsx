import { LoginForm } from "wasp/client/auth";
// Wasp's type-safe Link component
import { Link } from "wasp/client/router";
import { Box, Flex, Text } from "@chakra-ui/react";

export function LoginPage() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      // minH="100vh"
      p={4}
      // bg="gray.50"
    >
      <Box
        w={{ base: "90%", md: "400px" }}
        p={6}
        boxShadow="lg"
        bg="white"
        borderRadius="md"
      >
        {/** Wasp has built-in auth forms & flows, which you can customize or opt-out of, if you wish :)
         * https://wasp-lang.dev/docs/guides/auth-ui
         */}
        <LoginForm />
        <Text mt={4} textAlign="center">
          I don't have an account yet (
          <Link
            to="/signup"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            go to signup
          </Link>
          ).
        </Text>
      </Box>
    </Flex>
  );
}
