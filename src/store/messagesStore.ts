// src/store/messagesStore.ts
import { create } from 'zustand';
import {
  UserTranscriptMessage,
  AssistantTranscriptMessage,
} from "@humeai/voice";

type MessageType = UserTranscriptMessage | AssistantTranscriptMessage;

interface MessagesStore {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  clearMessages: () => void;
}

const useMessagesStore = create<MessagesStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));

// Function to add a message to the store
export const addMessageToStore = (message: MessageType) => {
  useMessagesStore.getState().addMessage(message);
};

export default useMessagesStore;
