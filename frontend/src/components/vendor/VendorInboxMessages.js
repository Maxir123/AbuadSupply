import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search,
  Send,
  AttachFile,
  MoreVert,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";

// Sample conversation data
const conversations = [
  {
    id: 1,
    name: "Jane Cooper",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Thanks for the fast delivery!",
    timestamp: "2 min ago",
    unread: true,
    online: true,
    messages: [
      { id: 1, sender: "customer", text: "Hi, I received my order today!", timestamp: "10:30 AM" },
      { id: 2, sender: "vendor", text: "Great! Is everything okay with the products?", timestamp: "10:32 AM" },
      { id: 3, sender: "customer", text: "Yes, perfect. Thanks for the fast delivery!", timestamp: "10:35 AM" },
    ],
  },
  {
    id: 2,
    name: "Esther Howard",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Can I change the shipping address?",
    timestamp: "1 hour ago",
    unread: false,
    online: false,
    messages: [
      { id: 1, sender: "customer", text: "Hello, I need to update my shipping address.", timestamp: "9:15 AM" },
      { id: 2, sender: "vendor", text: "Sure, I'll help with that. Can you send the new address?", timestamp: "9:20 AM" },
      { id: 3, sender: "customer", text: "Yes, it's 123 New Street, Lagos.", timestamp: "9:22 AM" },
    ],
  },
  {
    id: 3,
    name: "Cameron Williamson",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Do you have this in blue?",
    timestamp: "3 hours ago",
    unread: false,
    online: true,
    messages: [
      { id: 1, sender: "customer", text: "Do you have the red dress in blue?", timestamp: "8:00 AM" },
      { id: 2, sender: "vendor", text: "Let me check stock. I'll get back to you.", timestamp: "8:05 AM" },
    ],
  },
  {
    id: 4,
    name: "Wade Warren",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Order #12345 status?",
    timestamp: "Yesterday",
    unread: false,
    online: false,
    messages: [
      { id: 1, sender: "customer", text: "Hi, can I track my order?", timestamp: "Yesterday, 5:30 PM" },
      { id: 2, sender: "vendor", text: "Sure, it's out for delivery.", timestamp: "Yesterday, 5:45 PM" },
    ],
  },
];

const VendorInboxMessages = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, you would dispatch an action to send the message
    // For now, just clear the input
    setNewMessage("");
    // Simulate adding a new message (optional)
    console.log("Sending message:", newMessage);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: { xs: "auto", md: "calc(100vh - 64px)" },
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        {/* Conversation List */}
        <Box
          sx={{
            width: { xs: "100%", md: 320 },
            borderRight: { md: "1px solid", borderColor: "grey.200" },
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "grey.100" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Messages
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Conversation List */}
          <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
            {filteredConversations.map((conv) => (
              <ListItemButton
                key={conv.id}
                selected={selectedConversation?.id === conv.id}
                onClick={() => setSelectedConversation(conv)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "grey.100",
                  "&.Mui-selected": {
                    bgcolor: "primary.lighter",
                    borderLeft: "3px solid",
                    borderLeftColor: "primary.main",
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color="success"
                    variant="dot"
                    invisible={!conv.online}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  >
                    <Avatar src={conv.avatar} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body1" fontWeight={conv.unread ? "bold" : "normal"}>
                        {conv.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {conv.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color={conv.unread ? "text.primary" : "text.secondary"}
                      noWrap
                      sx={{ maxWidth: 200 }}
                    >
                      {conv.lastMessage}
                    </Typography>
                  }
                />
                {conv.unread && (
                  <Chip
                    label="New"
                    size="small"
                    color="primary"
                    sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                  />
                )}
              </ListItemButton>
            ))}
            {filteredConversations.length === 0 && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No conversations found.
                </Typography>
              </Box>
            )}
          </List>
        </Box>

        {/* Message Area */}
        {selectedConversation ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fafafa",
            }}
          >
            {/* Chat Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "grey.200",
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "white",
              }}
            >
              <Avatar src={selectedConversation.avatar} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedConversation.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedConversation.online ? "Online" : "Offline"}
                </Typography>
              </Box>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>

            {/* Messages List */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {selectedConversation.messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent: msg.sender === "vendor" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      maxWidth: "70%",
                      borderRadius: 2,
                      bgcolor: msg.sender === "vendor" ? "primary.main" : "white",
                      color: msg.sender === "vendor" ? "white" : "text.primary",
                      border: msg.sender === "vendor" ? "none" : "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        opacity: 0.7,
                      }}
                    >
                      {msg.timestamp}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "grey.200",
                bgcolor: "white",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton size="small">
                <AttachFile />
              </IconButton>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                sx={{ flex: 1 }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Select a conversation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a customer to start messaging
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default VendorInboxMessages;