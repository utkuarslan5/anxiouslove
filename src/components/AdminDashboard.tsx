// src/components/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { getChatGroups, useQuery } from "wasp/client/operations";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Flex,
} from "@chakra-ui/react";
import Chat from "./Chat";

const AdminDashboard: React.FC = () => {
  const { data: chatGroupsData, isLoading: chatGroupsLoading } = useQuery(getChatGroups);
  const [chatGroups, setChatGroups] = useState<any[]>([]);
  const [selectedChatGroupId, setSelectedChatGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (chatGroupsData) {
      setChatGroups(chatGroupsData.chat_groups_page);
    }
  }, [chatGroupsData]);

  return (
    <Flex height="100vh">
      <Box width="300px" p={5} borderRight="1px solid #e2e8f0">
        <Heading size="lg" mb={5}>
          Admin Dashboard
        </Heading>
        {chatGroupsLoading ? (
          <Spinner />
        ) : (
          <Box>
            <Heading size="md" mb={3}>
              Chat Groups
            </Heading>
            <Accordion allowMultiple>
              {chatGroups.map((group) => (
                <AccordionItem key={group.id}>
                  <AccordionButton onClick={() => setSelectedChatGroupId(group.id)}>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">{group.id}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        )}
      </Box>
      <Box flex="1" p={5}>
        {selectedChatGroupId ? (
          <Chat chatGroupId={selectedChatGroupId} />
        ) : (
          <Text>Select a chat group to view its events.</Text>
        )}
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
