// src/components/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { getChatGroups, useQuery } from "wasp/client/operations";
import { Box, Heading, List, ListItem, Spinner, Text } from "@chakra-ui/react";

const AdminDashboard: React.FC = () => {
  const { data: chatGroupsData, isLoading: chatGroupsLoading } =
    useQuery(getChatGroups);

  const [chatGroups, setChatGroups] = useState<any[]>([]);

  useEffect(() => {
    if (chatGroupsData) {
      setChatGroups(chatGroupsData.chat_groups_page);
    }
  }, [chatGroupsData]);

  return (
    <Box p={5}>
      <Heading size="lg" mb={5}>
        Admin Dashboard
      </Heading>
      {chatGroupsLoading ? (
        <Spinner />
      ) : (
        <Box>
          <Heading size="md">Chat Groups</Heading>
          <List spacing={3}>
            {chatGroups.map((group) => (
              <ListItem key={group.id}>
                <Text>{group.id}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
