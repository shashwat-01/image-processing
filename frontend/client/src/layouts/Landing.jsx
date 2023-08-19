import { useState, useEffect, useRef } from "react";
import LandingPageQuotes from "../components/LandingPageQuotes";
import MessageInput from "../components/MessageInput";

export default function Landing() {
  const [isFieldEmpty, setIsFieldEmpty] = useState(true);
  //To store chat history
  // const [chatHistory, setChatHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  //Toggle user
  const [currentUser, setCurrentUser] = useState("user");

  const [message, setMessage] = useState("");

  const chatContainerRef = useRef(null);

  const sendMessage = () => {
    if (message.trim() !== "") {
      //if the input is not empty, append the current input to the chat history along with the user and message
      setChatHistory([
        ...chatHistory,
        {
          user: currentUser,
          message: {
            dumms: "Hi",
            message: message,
          },
        },
      ]);
      // Reset the input and switch users
      setMessage("");
      setCurrentUser(currentUser === "user" ? "bot" : "user"); // Switch users
    }
  };

  console.log(chatHistory);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSendBtnPress = (event) => {
    event.preventDefault();
    sendMessage();
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
                <div>{chat.message.message}</div>
              </div>
            ))}
          </div>
        )}
        <MessageInput
          textsize={isFieldEmpty && chatHistory.length === 0 ? "30px" : "20px"}
          setIsFieldEmpty={setIsFieldEmpty}
          handleKeyPress={handleKeyPress}
          handleSendBtnPress={handleSendBtnPress}
          message={message}
          setMessage={setMessage}
        />
        {isFieldEmpty && chatHistory.length === 0 && <LandingPageQuotes />}
      </div>
    </div>
  );
}
