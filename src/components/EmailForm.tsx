// EmailForm.tsx
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";

interface EmailFormProps {
  onClose: () => void;
}

const EmailForm: FC<EmailFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
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
      className="flex flex-col items-center mt-0"
    >
      <label htmlFor="email" className="block text-md font-medium text-gray-800 mb-2">Where shall we send it?</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email address"
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
      />
      <Button onClick={onClose} className="mt-8">
        Send it
      </Button>
    </motion.div>
  );
};

export default EmailForm;
