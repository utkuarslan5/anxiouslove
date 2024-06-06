import { FC, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import EmotionPlot from "./EmotionPlot";
import html2canvas from "html2canvas";
import { sendEmailWithImage } from "wasp/client/operations";

interface EmailFormProps {
  onClose: () => void;
}

const EmailForm: FC<EmailFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const hiddenPlotRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (hiddenPlotRef.current) {
      const canvas = await html2canvas(hiddenPlotRef.current, {
        width: 1080, // A4 width in pixels at 96 DPI
        height: 1920, // A4 height in pixels at 96 DPI
      });
      const imageData = canvas.toDataURL("image/png");

      sendEmailWithImage({ email, imageData });
      onClose();
    }
  };

  const sendEmail = async (email: string, imageData: string) => {
    // Implement your email sending logic here
    // For example, you can use an email API like SendGrid, Mailgun, etc.
    console.log(`Sending email to ${email} with image data...`);
  };

  return (
    <>
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
        <label
          htmlFor="email"
          className="block text-md font-medium text-gray-800 mb-2"
        >
          Where shall we send it?
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email address"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
        />
        <Button onClick={handleSubmit} className="mt-8">
          Send it
        </Button>
      </motion.div>

      {/* Hidden container for EmotionPlot */}
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: isMobile ? "375px" : "1080px", // Adjust width as necessary
          height: isMobile ? "667px" : "1440px",
          overflow: "hidden", // Ensure nothing spills over the container size
          padding: "10px 0px", // Reduced padding or margin here
        }}
      >
        <div ref={hiddenPlotRef} style={{ width: "100%", height: "100%" }}>
          <EmotionPlot />
        </div>
      </div>

    </>
  );
};

export default EmailForm;
