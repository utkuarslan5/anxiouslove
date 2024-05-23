import { Box } from "@chakra-ui/react";
import { LastVoiceMessage } from "../components/LastVoiceMessage";
import { VoiceAnimationState } from "../components/VoiceAnimation";
import { WaitingPrompt } from "../components/WaitingPrompt";
import { WebGLAvatar } from "../components/WebGLAvatar";
import { Backdrop } from "../components/WebGLBackdrop";
import { useVoice } from "@humeai/voice-react";

export const ConversationScreen = () => {
  const { lastVoiceMessage, isPlaying, micFft, lastUserMessage } = useVoice();

  const maxHeight = 540;
  const height = Math.min(window.innerHeight, maxHeight);

  return (
    <Box>
      <LastVoiceMessage lastVoiceMessage={lastVoiceMessage} />
      {!lastUserMessage ? <WaitingPrompt /> : null}
      <WebGLAvatar
        fft={micFft}
        isPlaying={isPlaying}
        prosody={lastVoiceMessage?.models.prosody?.scores ?? {}}
        width={height * 1.5}
        height={height}
      />
      <Backdrop
        prosody={lastVoiceMessage?.models.prosody?.scores ?? {}}
        activeView={VoiceAnimationState.IDLE}
      />
    </Box>
  );
};
