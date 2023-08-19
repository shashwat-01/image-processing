import { useState, useEffect, useRef } from "react";
import LandingPageQuotes from "../components/LandingPageQuotes";
import MessageInput from "../components/MessageInput";

//image urls
// const userdp = require("./assets/user-dp.png");
// const chatdp = require("./assets/ziggy-bot.png");

export default function Landing() {
  const [isFieldEmpty, setIsFieldEmpty] = useState(true);
  //To store chat history
  const [chatHistory, setChatHistory] = useState([]);
  //Toggle user
  const [currentUser, setCurrentUser] = useState("user");

  const [message, setMessage] = useState("");

  const chatContainerRef = useRef(null);

  console.log(chatHistory);

  const sendMessage = () => {
    if (message.trim() !== "") {
      //if the input is not empty, append the current input to the chat history along with the user and message
      setChatHistory([...chatHistory, { user: currentUser, message }]);

      // Reset the input and switch users
      setMessage("");
      setCurrentUser(currentUser === "user" ? "bot" : "user"); // Switch users
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  //scroll down to the bottom of the chat container when the chat history changes
  useEffect(() => {
    if (chatHistory.length > 0)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  return (
    <div className='flex flex-row h-screen'>
      {isFieldEmpty && chatHistory.length === 0 && (
        <div div className='relative w-1/3 h-full'>
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
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`message rounded-md ${
                  chat.user === "user" ? "user" : "bot"
                }`}>
                <img
                  className='rounded-sm h-8'
                  src={
                    chat.user === "user"
                      ? "../src/assets/user-dp.png"
                      : "../src/assets/ziggy-bot.png"
                  }
                  alt=''
                />
                <div>{chat.message}</div>
              </div>
            ))}
          </div>
        )}
        <MessageInput
          textsize={isFieldEmpty && chatHistory.length === 0 ? "30px" : "20px"}
          setIsFieldEmpty={setIsFieldEmpty}
          handleKeyPress={handleKeyPress}
          message={message}
          setMessage={setMessage}
        />
        {isFieldEmpty && chatHistory.length === 0 && <LandingPageQuotes />}
      </div>
    </div>
  );
}
