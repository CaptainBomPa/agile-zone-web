import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  ListItemButton,
  Typography,
  Avatar,
} from "@mui/material";
import { getAllUsers } from "../service/UserStoryEdit";
import { format } from "date-fns";

export default function Chat(props) {
  const { token, currentUser } = props;
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = React.useRef(null);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async (selectedUserId) => {
    if (selectedUserId && currentUser) {
      try {
        const response = await fetch(
          "http://10.0.1.64:8080/api/user/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user1Id: currentUser.id,
              user2Id: selectedUserId,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
      }
    }
  };

  const handleUserClick = (userId) => {
    console.log("wybrano: ", userId);
    setSelectedUserId(userId);
    fetchMessages(userId);
  };

  useEffect(() => {
    fetchUsers();
    const socket = new SockJS("http://10.0.1.64:8080/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      beforeConnect: () => {
        if (token) {
          client.connectHeaders = {
            Authorization: `Bearer ${token}`,
          };
        }
      },
    });
    

    client.onConnect = () => {
      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log(receivedMessage);
        console.log(currentUser);
        console.log(selectedUserId);
        if (
          (receivedMessage.sender.id === currentUser.id &&
            receivedMessage.receiver.id === selectedUserId) ||
          (receivedMessage.receiver.id === currentUser.id &&
            receivedMessage.sender.id === selectedUserId)
        ) {
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        }
      });
      setStompClient(client);
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [token, selectedUserId, currentUser]);

  const sendMessage = () => {
    if (stompClient && stompClient.active) {
      const currentUserCopy = { ...currentUser };
      currentUserCopy.avatar = null;
      const receiver = users.find((user) => user.id === selectedUserId);
      const receiverCopy = { ...receiver };
      receiverCopy.avatar = null;

      const chatMessage = {
        sender: currentUser,
        receiver: receiverCopy,
        content: message,
      };

      stompClient.publish({
        destination: "/app/send",
        body: JSON.stringify(chatMessage),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("");
    }
  };

  const dateStyle = (isCurrentUser) => ({
    fontSize: "0.8rem",
    color: isCurrentUser ? "#bfbfbf" : "#757575",
    textAlign:
      currentUser && message.sender
        ? message.sender.id === currentUser.id
          ? "right"
          : "left"
        : "left",
  });

  const messageStyle = (isCurrentUser) => ({
    backgroundColor: isCurrentUser ? "#9723ef" : "#f5f5f5",
    color: isCurrentUser ? "white" : "black",
    borderRadius: "10px",
    padding: "10px",
    maxWidth: "75%",
    wordWrap: "break-word",
    textAlign: "left",
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
    marginTop: "10px",
  });

  const chatBoxStyle = {
    height: "78vh",
    overflowY: "auto",
    paddingRight: "16px",
    marginBottom: "10px",
  };

  const userListStyle = {
    height: "88vh",
    overflowY: "auto",
    paddingRight: "16px",
    marginBottom: "10px",
  };

  const inputAreaStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Odstęp między elementami
  };

  const selectedUserStyle = {
    backgroundColor: "#9723ef", // Domyślny kolor Material UI dla fioletowego, dostosuj według potrzeb
    borderRadius: "10px",
    color: "white",
  };

  const userItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Odstęp między avatar a tekst
  };

  return (
    <Box sx={{ width: "100% - 64px", marginLeft: "64px", marginTop: "64px" }}>
      <Box sx={{ flexGrow: 1, m: 2 }}>
        <Grid container spacing={2}>
          {/* Lista użytkowników */}
          <Grid item xs={4}>
            <List style={userListStyle} className="custom-scrollbar">
              {users.map(
                (user, index) =>
                  user.id !== currentUser.id && (
                    <ListItemButton
                      key={index}
                      selected={user.id === selectedUserId}
                      onClick={() => handleUserClick(user.id)}
                      style={
                        user.id === selectedUserId ? selectedUserStyle : null
                      }
                    >
                      <ListItemText
                        primary={
                          <div style={userItemStyle}>
                            {user?.avatar ? (
                              <Avatar
                                sx={{ bgcolor: "gray" }}
                                src={`data:image/png;base64,${user.avatar}`}
                              />
                            ) : (
                              <Avatar sx={{ bgcolor: "gray" }}>
                                {user.firstName.charAt(0).toUpperCase() +
                                  user.lastName.charAt(0).toUpperCase()}
                              </Avatar>
                            )}
                            <span>{user.firstName + " " + user.lastName}</span>
                          </div>
                        }
                      />
                    </ListItemButton>
                  )
              )}
            </List>
          </Grid>

          {/* Chat */}
          <Grid item xs={8}>
            <List style={chatBoxStyle} className="custom-scrollbar">
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  ref={index === messages.length - 1 ? messagesEndRef : null}
                  style={{
                    flexDirection: "column",
                    alignItems:
                      message.sender.id === currentUser.id
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Box
                    style={messageStyle(message.sender.id === currentUser.id)}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                    <Typography
                      style={dateStyle(message.sender.id === currentUser.id)}
                    >
                      {format(
                        new Date(message.timestamp),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ mb: 2 }} style={inputAreaStyle}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                color="pmLoginTheme"
                multiline
                rows={1}
                style={{ flexGrow: 1 }}
                disabled={selectedUserId !== null ? false : true}
              />
              <Button
                variant="contained"
                color="pmLoginTheme"
                onClick={sendMessage}
                disabled={selectedUserId !== null ? false : true}
              >
                SEND MESSAGE
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
