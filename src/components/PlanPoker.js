import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import axios from "axios";

export default function PlanPoker(props) {
  const { token, currentUser } = props;
  const [stompClient, setStompClient] = useState(null);
  const [userStoryName, setUserStoryName] = useState("");
  const [lobbyOpened, setLobbyOpened] = useState(false);
  const [lobbyStarted, setLobbyStarted] = useState(false);
  const [votes, setVotes] = useState([]);
  const [selectedVote, setSelectedVote] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34];

  const selectVote = (vote) => {
    setSelectedVote(vote);
    putVote(vote);
  };

  useEffect(() => {
    refreshData();
    lastResultInfo();
  }, []);

  const refreshData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
      const response = await axios.get(`${apiUrl}/ppoker-info`);
      const data = response.data;
      setLobbyOpened(data.opened);
      setLobbyStarted(data.started);
      setUserStoryName(data.storyName);
      setVotes(data.votes);
    } catch (error) {
      console.error(
        "Błąd podczas pobierania informacji o pokerze planowania:",
        error
      );
    }
  };

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
    const socket = new SockJS(apiUrl + "/ppoker");
    const client = new Client({
      webSocketFactory: () => socket,
      beforeConnect: () => {
        if (token) {
          client.connectHeaders = {
            Authorization: `Bearer ${token}`,
          };
        }
      },
      onConnect: () => {
        setStompClient(client);
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.onConnect = () => {
      client.subscribe("/topic/ppoker-open", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setLobbyOpened(receivedMessage.lobbyOpened);
        setLobbyStarted(receivedMessage.lobbyStarted);
        if (receivedMessage.userStoryName) {
          setUserStoryName(receivedMessage.userStoryName);
        } 
        if (!receivedMessage.lobbyOpened) {
            setLobbyStarted(false);
            setUserStoryName("");
            setVotes([]);
        }
        lastResultInfo();
      });
      client.subscribe("/topic/ppoker-start", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setLobbyStarted(receivedMessage.lobbyStarted);
      });
      client.subscribe("/topic/ppoker-join", (message) => {
        refreshData();
      });
      client.subscribe("/topic/ppoker-vote", (message) => {
        console.log("there is a new vote");
        refreshData();
      });
      setStompClient(client);
    };

    client.activate();
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [token]);

  const openLobby = () => {
    console.log("storyname: " + userStoryName);
    if (stompClient && stompClient.active) {
      const lobbyMessage = {
        lobbyOpened: true,
        userStoryName: userStoryName,
      };

      stompClient.publish({
        destination: "/app/ppoker-open",
        body: JSON.stringify(lobbyMessage),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  const closeLobby = () => {
    if (stompClient && stompClient.active) {
      const lobbyMessage = {
        lobbyOpened: false,
        userStoryName,
      };

      stompClient.publish({
        destination: "/app/ppoker-open",
        body: JSON.stringify(lobbyMessage),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    refreshData();
    lastResultInfo();
  };

  const joinLobby = () => {
    if (stompClient && stompClient.active) {
      const lobbyMessage = {
        user: currentUser,
      };

      stompClient.publish({
        destination: "/app/ppoker-join",
        body: JSON.stringify(lobbyMessage),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  const startLobby = () => {
    if (stompClient && stompClient.active) {
      const lobbyMessage = {
        lobbyStarted: true,
      };

      stompClient.publish({
        destination: "/app/ppoker-start",
        body: JSON.stringify(lobbyMessage),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  const putVote = (vote) => {
    if (stompClient && stompClient.active) {
      const lobbyMessage = {
        user: currentUser,
        vote: vote,
      };

      stompClient.publish({
        destination: "/app/ppoker-vote",
        body: JSON.stringify(lobbyMessage),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  const lastResultInfo = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
      const response = await axios.get(`${apiUrl}/ppoker-result`);
      const data = response.data;
      if (data.userStoryName) {
        setLastResult(data);
      }
    } catch (error) {
      console.error(
        "Błąd podczas pobierania informacji o pokerze planowania:",
        error
      );
    }
  };

  const renderVotesList = () => {
    return (
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {votes.map((entry, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider />}
            <ListItem>
              <ListItemText
                primary={`${entry.user.firstName} ${entry.user.lastName}`}
                secondary={
                  entry.vote > 0 ? `Voted - ${lobbyStarted ? "?" : entry.vote}` : "Not voted yet"
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    );
  };

  const renderLatestVotesList = () => {
    return (
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {lastResult.votes.map((entry, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider />}
            <ListItem>
              <ListItemText
                primary={`${entry.user.firstName} ${entry.user.lastName}`}
                secondary={
                  entry.vote > 0 ? `Voted - ${entry.vote}` : "Not voted yet"
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    );
  };

  const renderFibonacciTiles = () => {
    return (
      <Grid container spacing={1}>
        {fibonacciSequence.map((number) => (
          <Grid item key={number}>
            <Paper
              sx={{
                mb: 2,
                height: 60,
                width: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  selectedVote === number ? "#9723ef" : "#5b5b5b",
                "&:hover": {
                  backgroundColor: "#be85ea",
                  cursor: "pointer",
                },
              }}
              onClick={() => selectVote(number)}
            >
              {number}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ width: "100% - 64px", marginLeft: "64px", marginTop: "74px" }}>
      <Box sx={{ flexGrow: 1, m: 2 }}>
        {!lobbyOpened && (
          <div>
            <TextField
              color="pmLoginTheme"
              fullWidth
              label="User Story Name"
              variant="outlined"
              value={userStoryName}
              onChange={(e) => setUserStoryName(e.target.value)}
              sx={{mb: 2}}
            />
            <Button
              variant="contained"
              color="pmLoginTheme"
              onClick={openLobby}
              disabled={!userStoryName}
            >
              Open Lobby
            </Button>
            <h2>
              Last result <br></br>
              User Story Name: <span style={{color: "#9723ef"}}> {lastResult ? lastResult.userStoryName : "No result"} <br></br></span>
              Average: <span style={{color: "#9723ef"}}>{lastResult ? lastResult.summary : "No result"} <br></br></span>
              Votes list: <span style={{color: "#9723ef"}}>{lastResult ? renderLatestVotesList() : "No result"}</span>
            </h2>
          </div>
        )}
        {lobbyOpened && !lobbyStarted && (
          <div>
            <Typography variant="h6">Lobby Opened - {userStoryName}</Typography>
            <Button
              sx={{ backgroundColor: "green", mt: 1, mb: 2, mr: 2 }}
              variant="contained"
              onClick={startLobby}
              disabled={votes.length === 0}
            >
              Start Lobby
            </Button>
            <Button
              variant="contained"
              color="pmLoginTheme"
              onClick={joinLobby}
              sx={{ mt: 1, mb: 2, mr: 2  }}
            >
              Join Lobby
            </Button>
            <Button
              sx={{ backgroundColor: "red", mt: 1, mb: 2, mr: 2  }}
              variant="contained"
              color="pmLoginTheme"
              onClick={closeLobby}
            >
              Close Lobby
            </Button>
            <span style={{color: "#9723ef"}}>{renderVotesList()}</span>
          </div>
        )}
        {lobbyStarted && (
          <div>
            <Typography variant="h6">Voting in progress</Typography>
            <Button
              sx={{ backgroundColor: "red", mt: 1, mb: 2, mr: 2 }}
              variant="contained"
              color="pmLoginTheme"
              onClick={closeLobby}
            >
              Close Lobby
            </Button>
            {renderFibonacciTiles()}
            <span style={{color: "#9723ef"}}>{renderVotesList()}</span>
          </div>
        )}
      </Box>
    </Box>
  );
}
