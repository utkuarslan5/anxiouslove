// src/components/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { getChatGroups, useQuery } from "wasp/client/operations";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Flex,
  Button,
  List,
  ListItem,
} from "@chakra-ui/react";
import Chat from "./Chat";

const AdminDashboard: React.FC = () => {
  const [page, setPage] = useState(0);
  const { data: chatGroupsData, isLoading: chatGroupsLoading } = useQuery(
    getChatGroups,
    page,
    10
  );
  const [chatGroups, setChatGroups] = useState<any[]>([]);
  const [selectedChatGroupId, setSelectedChatGroupId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (chatGroupsData) {
      // console.log("Retrieved chat groups:", chatGroupsData.chat_groups_page);
      setChatGroups((prevChatGroups) => [
        ...prevChatGroups,
        ...chatGroupsData.chat_groups_page,
      ]);
    }
  }, [chatGroupsData]);

  const loadMoreChatGroups = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <Flex height="100vh">
      <Box width="300px" p={5} borderRight="1px solid #e2e8f0" overflowY="auto">
        {/* <Heading size="lg" mb={5}>
          Admin Dashboard
        </Heading> */}
        {chatGroupsLoading ? (
          <Spinner />
        ) : (
          <Box>
            <Heading size="md" mb={3}>
              Chat Groups
            </Heading>
            <List spacing={3}>
              {chatGroups.map((group, index) => (
                <ListItem
                  key={group.id + index}
                  onClick={() => setSelectedChatGroupId(group.id)}
                  cursor="pointer"
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ bg: "gray.100" }}
                >
                  <Text fontWeight="bold">{group.id}</Text>
                </ListItem>
              ))}
            </List>
            <Button onClick={loadMoreChatGroups} mt={3}>
              Load More
            </Button>
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
