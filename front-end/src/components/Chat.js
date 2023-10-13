import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { getLastNMessages } from "../utils/api";

const messages = [
  { id: 1, text: "Hi there!", sender: "bot" },
  { id: 2, text: "Hello!", sender: "test" },
  { id: 3, text: "How can I assist you today?", sender: "bot" },
  { id: 4, text: "I'd like to know more about your products", sender: "bot" },
];

const Chat = ({ currentChat }) => {
  const localStorage = window.localStorage;

  const [input, setInput] = React.useState("");
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  React.useEffect(() => {
    currentChat &&
    getLastNMessages(currentChat.id, JSON.parse(localStorage.getItem('userdata')).id, 10).then((res) => {
      console.log(res);
    });
  }, [currentChat]);

  const handleSend = () => {
    if (input.trim() !== "") {
      console.log(input);
      setInput("");
    }
  };



  return (
    <React.Fragment>
      {!currentChat ? (
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Select a chat to start messaging
        </Typography>
      ) : (
        <React.Fragment>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Chatting with {currentChat.name}
          </Typography>
          <Box
            sx={{ height: "95vh", display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
              {messages.map((message) => {
                return (
                  <>
                    {/* <Avatar>message.id</Avatar> */}
                    <Message key={message.id * message.id} message={message} />
                  </>
                );
              })}
            </Box>
            <Box sx={{ p: 1, backgroundColor: "background.default" }}>
              <Grid container spacing={2}>
                <Grid item xs={11}>
                  <TextField
                    style={{ height: "10px" }}
                    fullWidth
                    placeholder="Type a message"
                    value={input}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    fullWidth
                    style={{ height: "50px" }}
                    size="large"
                    color="primary"
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSend}
                  ></Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const Message = ({ message }) => {
  const isNotUser = message.sender !== window.localStorage.getItem("user");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isNotUser ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Avatar sx={{ m: 1 }}>{message.sender[0].toUpperCase()}</Avatar>
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          backgroundColor: isNotUser ? "#F1EFEF" : "primary.main",
          color: isNotUser ? "#000" : "#fff",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "black", textAlign: "left" }}
        >
          {message.sender}
        </Typography>
        <Typography variant="body1">{message.text}</Typography>
      </Paper>
    </Box>
  );
};

export default Chat;
