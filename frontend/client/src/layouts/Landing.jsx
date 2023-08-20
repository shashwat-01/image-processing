import { useState, useEffect, useRef } from "react";
import LandingPageQuotes from "../components/LandingPageQuotes";
import MessageInput from "../components/MessageInput";
import axios from "axios";
import Outfit from "./Outfit";

export default function Landing() {
  const botResponses = [
    "Hello! How may I help you?",
    "Sure thing! What can I assist you with?",
    "Hi there! Feel free to ask me anything.",
    "Greetings! What's on your mind?",
  ];

  // const getBotResponse = () => {
  //   const randomIndex = Math.floor(Math.random() * botResponses.length);
  //   return botResponses[randomIndex];
  // };

  const getBotResponse = async (userMessage) => {
    const response = await fetch("/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.message; // Assuming your API sends back a response message
  };

  const [isFieldEmpty, setIsFieldEmpty] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isWaitingForBot, setIsWaitingForBot] = useState(false);

  const chatContainerRef = useRef(null);

  const addMessageToHistory = (text, user) => {
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      {
        user,
        message: text,
      },
    ]);
  };

  // const handleUserMessage = (text) => {
  //   sendMessage(text, "user");
  //   setTimeout(() => {
  //     const botMessage = getBotResponse();
  //     sendMessage(botMessage, "bot");
  //   }, 500); // Simulating a bot response after a short delay
  // };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (message.trim() !== "") {
        console.log(message);
        addMessageToHistory(message, "user");
        setMessage("");
        setIsWaitingForBot(true); // Activate waiting for bot

        const res = await axios.post(
          "http://127.0.0.1:5000/query",
          { query: message },
          {
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
            },
          }
        );
        sendMessage(res.data, "bot"); // Send bot response to chatHistory
        setIsWaitingForBot(false); // Deactivate waiting for bot

        // Simulate bot response after a delay
        // setTimeout(() => {
        //   const botMessage = getBotResponse();
        //   console.log(botMessage);
        //   sendMessage(botMessage, "bot"); // Send bot response to chatHistory
        //   setIsWaitingForBot(false);
        // }, 1000); // Adjust the delay as needed
      }
    }
  };

  const handleSendBtnPress = async (event) => {
    event.preventDefault();
    if (message.trim() !== "") {
      console.log(message);
      addMessageToHistory(message, "user");
      setMessage("");

      try {
        const botMessage = await getBotResponse(message);
        console.log(botMessage);
        addMessageToHistory(botMessage, "bot");
      } catch (error) {
        console.error("Error fetching bot response:", error);
        addMessageToHistory("Something went wrong", "bot");
      }
    }
  };

  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //     if (message.trim() !== "") {
  //       console.log(message);
  //       addMessageToHistory(message, "user"); // Send user message to chatHistory
  //       setMessage("");
  //       setIsWaitingForBot(true); // Activate waiting for bot

  //       // Simulate bot response after a delay
  //       setTimeout(() => {
  //         const botMessage = getBotResponse();
  //         console.log(botMessage);
  //         addMessageToHistory(botMessage, "bot"); // Send bot response to chatHistory
  //         setIsWaitingForBot(false);
  //       }, 1000); // Adjust the delay as needed
  //     }
  //   }
  // };

  // const handleSendBtnPress = (event) => {
  //   event.preventDefault();
  //   if (message.trim() !== "") {
  //     console.log(message);
  //     addMessageToHistory(message, "user"); // Send user message to chatHistory
  //     setMessage("");

  //     // Simulate bot response after a delay
  //     setTimeout(() => {
  //       const botMessage = getBotResponse();
  //       console.log(botMessage);
  //       addMessageToHistory(botMessage, "bot"); // Send bot response to chatHistory
  //     }, 9000); // Adjust the delay as needed
  //   }
  // };

  useEffect(() => {
    if (chatHistory.length > 0)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  return (
    <div className='flex flex-row h-screen'>
      {isFieldEmpty && chatHistory.length === 0 && (
        <div className='relative w-1/3 h-full'>
          <img
            className='w-full h-full object-cover'
            src='../src/assets/landing-left-1.jpg'
            alt=''
          />
          <div
            className='absolute inset-0'
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
            }}></div>
          <div className='absolute bottom-5 right-8 flex gap-2 items-center border-2 border-transparent border-opacity-50 text-white font-semibold cursor-pointer hover:border-b-2 hover:border-b-white transition duration-200'>
            <button>Try this look</button>
            <img
              src='../src/assets/external_link.png'
              alt=''
              className='h-3 w-3'
            />
          </div>
        </div>
      )}
      <div
        className={
          isFieldEmpty && chatHistory.length === 0
            ? "w-full flex flex-col p-20 justify-between"
            : "w-full flex flex-col p-10 justify-between"
        }>
        <div>
          <img
            className={
              isFieldEmpty && chatHistory.length === 0 ? "h-14" : "h-10"
            }
            src='../src/assets/ziggy-logo.png'
            alt=''
          />
        </div>
        {/* showing chatcontainer only if the chatHistory is not empty */}
        {chatHistory.length > 0 && (
          <div ref={chatContainerRef} className='chat-container'>
            {chatHistory.map((chat, index) => {
              return chat.user === "user" ? (
                <div key={index} className='message rounded-md user'>
                  <img
                    className='rounded-sm h-8'
                    src='../src/assets/user-dp.png'
                    alt=''
                  />
                  <div>{chat.message}</div>
                </div>
              ) : (
                <div key={index} className='message rounded-md bot'>
                  <img
                    className='rounded-sm h-8'
                    src='../src/assets/ziggy-bot.png'
                    alt=''
                  />
                  <div>{chat.message.message}</div>
                  {chat.message.outfits.map((outfit, index) => (
                    <Outfit outfit={outfit} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
        <MessageInput
          textsize={isFieldEmpty && chatHistory.length === 0 ? "30px" : "20px"}
          setIsFieldEmpty={setIsFieldEmpty}
          handleKeyPress={handleKeyPress}
          handleSendBtnPress={handleSendBtnPress}
          message={message}
          setMessage={setMessage}
          disableInput={isWaitingForBot}
        />
        {isFieldEmpty && chatHistory.length === 0 && <LandingPageQuotes />}
      </div>
    </div>
  );
}
