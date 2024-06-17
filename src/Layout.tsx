import { Link } from "wasp/client/router";
import { useAuth, logout } from "wasp/client/auth";
import { getUsername } from "wasp/auth";
import { useState, useRef, useEffect, ReactNode } from "react";
import {
  ChakraProvider,
  Box,
} from "@chakra-ui/react";
import "./Main.css";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <ChakraProvider>
      <Box>{children}</Box>
    </ChakraProvider>
  );
};

export default Layout;
