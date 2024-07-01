import React from "react";
import { ChatBot } from "./ChatBot"; // Adjust the import path as needed
import "./Main.css"; // Ensure you import your CSS file

export const GFPage: React.FC = () => {
  return (
    <div className="girlfriend-background">
      <ChatBot configId="69f1dcf9-9bdc-4fc5-b6bb-b767305b8ae7" configVersion={37} />
    </div>
  );
};