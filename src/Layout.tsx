import { useEffect, ReactNode } from "react";
import {
  ChakraProvider,
  Flex,
  Box,
  Container,
} from "@chakra-ui/react";
import "./Main.css";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    // Register the service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          },
          (err) => {
            console.log("ServiceWorker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return (
    <ChakraProvider>
          {children}
    </ChakraProvider>
  );
};

export default Layout;
