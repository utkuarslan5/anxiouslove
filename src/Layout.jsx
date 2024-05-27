import { Link } from "wasp/client/router";
import { useAuth, logout } from "wasp/client/auth";
import { getUsername } from "wasp/auth";
import { useState, useRef, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Image,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import "./Main.css";

export const Layout = ({ children }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = "demo.anxiouslove.me";
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }, []);

  return (
    <ChakraProvider>
      <Box>{children}</Box>
    </ChakraProvider>
  );
};

export default Layout;
