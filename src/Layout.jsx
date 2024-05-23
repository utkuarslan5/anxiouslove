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

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.async = true;
  //   script.innerHTML = `
  //     window.$sleek=[];
  //     window.SLEEK_PRODUCT_ID=291162644;
  //     (function(){
  //       d=document;
  //       s=d.createElement("script");
  //       s.src="https://client.sleekplan.com/sdk/e.js";
  //       s.async=1;
  //       d.getElementsByTagName("head")[0].appendChild(s);
  //     })();
  //   `;
  //   document.head.appendChild(script);
  // }, []);

  return (
    <ChakraProvider>
     
      <Box>
        {children}
      </Box>
      
    </ChakraProvider>
  );
};

export default Layout;
