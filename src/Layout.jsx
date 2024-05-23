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
  const { data: user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      setIsMenuOpen(true);
      setTimeout(() => {
        setIsMenuOpen(false);
      }, 2000);
    }, 500);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <Box bg="black" color="white" p={4}>
        <Flex justify="space-between">
          <Link to="/">
            <Image
              src="/logo.png"
              alt="Anxious Love Logo"
              width={12}
              height={12}
              rounded="full"
            />
          </Link>
          <Flex align="center">
            {user && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="User Options"
                  icon={<HamburgerIcon />}
                  size="lg"
                  colorScheme="white"
                />
                <MenuList>
                  <MenuGroup title={`Hi, ${getUsername(user)}`}>
                    <MenuItem
                      icon={<ArrowForwardIcon />}
                      onClick={() => {
                        logout();
                      }}
                    >
                      Log out
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
            )}

            {!user && (
              <Flex>
                <Link to="/login">
                  <Button
                    mr={4}
                    colorScheme="white"
                    _hover={{ bg: "gray.200" }}
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    mr={4}
                    variant="outline"
                    colorScheme="white"
                    _hover={{ bg: "gray.200" }}
                  >
                    Sign up
                  </Button>
                </Link>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>
      <Box flexGrow={1} maxWidth="container.lg" mx="auto">
        {children}
      </Box>
      <Box position="fixed" bottom={0} left={0} right={0}>
        <Box maxWidth="container.lg" mx="auto" p={4}>
          <Box textAlign="center" color="gray.500" fontSize="sm">
            <Text>Anxious Love 2024. All rights reserved.</Text>️
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Layout;
