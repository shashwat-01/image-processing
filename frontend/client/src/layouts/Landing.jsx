import { useState, useEffect, useRef } from "react";
import LandingPageQuotes from "../components/LandingPageQuotes";
import MessageInput from "../components/MessageInput";
import axios from "axios";
import Outfit from "./Outfit";
import LoadingComponent from "./LoadingComponent";

export default function Landing() {
  const botResponses = [
    "Hello! How may I help you?",
    "Sure thing! What can I assist you with?",
    "Hi there! Feel free to ask me anything.",
    "Greetings! What's on your mind?",
  ];

  //users: Harry, Ginny, Ron, Hermione
  const [selectedUserProfile, setSelectedUserProfile] = useState("Harry"); // Set default value to "yellow"

  const handleColorChange = (event) => {
    setSelectedUserProfile(event.target.value); // Update the selected color when the user selects an option
  };

  // const getBotResponse = () => {
  //   const randomIndex = Math.floor(Math.random() * botResponses.length);
  //   return botResponses[randomIndex];
  // };

  const sendMessage = (text, user) => {
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      {
        user,
        message: text,
      },
    ]);
  };

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
          { query: message, profile: selectedUserProfile },
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

  // return (
  //   <div className="flex flex-row h-screen">
  //     {isFieldEmpty && chatHistory.length === 0 && (
  //       <div className="relative w-1/3 h-full">
  //         <img
  //           className="w-full h-full object-cover"
  //           src="../src/assets/landing-left-1.jpg"
  //           alt=""
  //         />
  //         <div
  //           className="absolute inset-0"
  //           style={{
  //             background:
  //               "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
  //           }}
  //         ></div>
  //         <div className="absolute bottom-5 right-8 flex gap-2 items-center border-2 border-transparent border-opacity-50 text-white font-semibold cursor-pointer hover:border-b-2 hover:border-b-white transition duration-200">
  //           <button>Try this look</button>
  //           <img
  //             src="../src/assets/external_link.png"
  //             alt=""
  //             className="h-3 w-3"
  //           />
  //         </div>
  //       </div>
  //     )}
  //     <div
  //       className={
  //         isFieldEmpty && chatHistory.length === 0
  //           ? "w-full flex flex-col p-20 justify-between relative"
  //           : "w-full flex flex-col p-10 justify-between"
  //       }
  //     >
  //       {isFieldEmpty && chatHistory.length === 0 && (
  //         <div className="text-xl absolute top-10 right-10">
  //           Hi
  //           <select
  //             value={selectedUserProfile}
  //             onChange={handleColorChange}
  //             className="font-bold focus:outline-none cursor-pointer rounded-none px-1 py-2 transition duration-300 ease-in-out transform hover:bg-white hover:text-black"
  //           >
  //             <option value="Harry">Henry</option>
  //             <option value="Hermione">Hermione</option>
  //             <option value="Ron">Ron</option>
  //             <option value="Ginny">Ginny</option>
  //           </select>
  //         </div>
  //       )}
  //       <div>
  //         <img
  //           className={
  //             isFieldEmpty && chatHistory.length === 0 ? "h-14" : "h-10"
  //           }
  //           src="../src/assets/ziggy-logo.png"
  //           alt=""
  //         />
  //       </div>
  //       {/* showing chatcontainer only if the chatHistory is not empty */}
  //       {chatHistory.length > 0 && (
  //         <div ref={chatContainerRef} className="chat-container">
  //           {chatHistory.map((chat, index) => {
  //             return chat.user === "user" ? (
  //               <div key={index} className="message rounded-md user">
  //                 <img
  //                   className="rounded-sm h-8"
  //                   src="../src/assets/user-dp.png"
  //                   alt=""
  //                 />
  //                 <div>{chat.message}</div>
  //               </div>
  //             ) : (
  //               <div key={index} className="message rounded-md bot">
  //                 <img
  //                   className="rounded-sm h-8"
  //                   src="../src/assets/ziggy-bot.png"
  //                   alt=""
  //                 />
  //                 <div>
  //                   <div>{chat.message.message}</div>
  //                   <div className="flex flex-row gap-8 my-3">
  //                     {chat.message.outfits.map((outfit, index) => (
  //                       <Outfit outfit={outfit} key={index} />
  //                     ))}
  //                   </div>
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}
  //       <div className="flex flex-col items-center gap-3">
  //         {isWaitingForBot && <LoadingComponent />}
  //         <MessageInput
  //           textsize={
  //             isFieldEmpty && chatHistory.length === 0 ? "30px" : "20px"
  //           }
  //           setIsFieldEmpty={setIsFieldEmpty}
  //           handleKeyPress={handleKeyPress}
  //           handleSendBtnPress={handleSendBtnPress}
  //           message={message}
  //           setMessage={setMessage}
  //           disableInput={isWaitingForBot}
  //         />
  //       </div>
  //       {isFieldEmpty && chatHistory.length === 0 && <LandingPageQuotes />}
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex flex-col h-screen bg-emerald-800">
      <div
        className={
          isFieldEmpty && chatHistory.length === 0
            ? "flex flex-col p-10 justify-between relative"
            : "flex flex-col p-4 justify-between"
        }
      >
        {isFieldEmpty && chatHistory.length === 0 && (
          <div className="text-white text-xl absolute right-5">
            Hi{" "}
            <select
              value={selectedUserProfile}
              onChange={handleColorChange}
              className="font-bold bg-emerald-800 focus:outline-none cursor-pointer rounded-lg px-2 py-1 transition duration-300 ease-in-out transform  hover:bg-emerald-900"
            >
              <option value="Harry">Harry</option>
              <option value="Hermione">Hermione</option>
              <option value="Ron">Ron</option>
              <option value="Ginny">Ginny</option>
            </select>
          </div>
        )}
        <div>
          {/* <img
            className={
              isFieldEmpty && chatHistory.length === 0 ? "h-20" : "h-16"
            }
            src="../src/assets/ziggy-logo.png"
            alt=""
          /> */}

          <h1 className="text-5xl text-slate-200">ZIGGY</h1>
        </div>
        {chatHistory.length > 0 && (
          <div ref={chatContainerRef} className="overflow-y-auto">
            {chatHistory.map((chat, index) => {
              return chat.user === "user" ? (
                <div
                  key={index}
                  className="message rounded-md bg-gray-600 text-white p-2 mt-r4  max-w-md"
                >
                  <div>{chat.message}</div>
                </div>
              ) : (
                <div
                  key={index}
                  className="message rounded-md bg-gray-600 text-white p-2 my-2 mr-auto max-w-md"
                >
                  <div>{chat.message.message}</div>
                  <div className="flex flex-row gap-4 my-3">
                    {chat.message.outfits.map((outfit, index) => (
                      <Outfit outfit={outfit} key={index} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Search Bar */}
        <div className="flex flex-col items-center gap-3">
          {isWaitingForBot && <LoadingComponent />}
          <MessageInput
            textsize={
              isFieldEmpty && chatHistory.length === 0 ? "30px" : "20px"
            }
            setIsFieldEmpty={setIsFieldEmpty}
            handleKeyPress={handleKeyPress}
            handleSendBtnPress={handleSendBtnPress}
            message={message}
            setMessage={setMessage}
            disableInput={isWaitingForBot}
          />
        </div>
        {isFieldEmpty && chatHistory.length === 0 && (
          <div className="text-white m-auto my-8">
            <LandingPageQuotes />
          </div>
        )}
      </div>

      {/*IMAGES */}

      <div className="flex flex-row h-screen bg-emerald-800">
        {isFieldEmpty && chatHistory.length === 0 && (
          <div className="flex flex-row w-full">
            <div className="relative w-1/3 h-full z-30 hover:translate-x-1 hover:-translate-y-2 transition duration-200">
              <img
                className="w-full h-full object-cover "
                src="../src/assets/landing-left-1.jpg"
                alt=""
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
                }}
              ></div>
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg p-2 absolute bottom-5 right-8 flex gap-2 items-center border-2 border-transparent border-opacity-50 text-white font-semibold cursor-pointer hover:bg-black hover:bg-opacity-20 hover:backdrop-blur-lg transition duration-200">
                <button>Try this look</button>
                <img
                  src="../src/assets/external_link.png"
                  alt=""
                  className="h-3 w-3"
                />
              </div>
            </div>
            <div className="relative w-1/3 h-full z-20 hover:-translate-y-2 transition duration-200">
              <img
                className="w-full h-full object-cover"
                src="../src/assets/landing-left-2.jpg"
                alt=""
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
                }}
              ></div>
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg p-2 absolute bottom-5 right-8 flex gap-2 items-center border-2 border-transparent border-opacity-50 text-white font-semibold cursor-pointer hover:bg-black hover:bg-opacity-20 hover:backdrop-blur-lg transition duration-200">
                <button>Try this look</button>
                <img
                  src="../src/assets/external_link.png"
                  alt=""
                  className="h-3 w-3"
                />
              </div>
            </div>
            <div className="relative w-1/3 h-full z-30 hover:-translate-x-1 hover:-translate-y-2 transition duration-200">
              <img
                className="w-full h-full object-cover"
                src="../src/assets/landing-left-3.jpg"
                alt=""
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
                }}
              ></div>
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg p-2 absolute bottom-5 right-8 flex gap-2 items-center border-2 border-transparent border-opacity-50 text-white font-semibold cursor-pointer hover:bg-black hover:bg-opacity-20 hover:backdrop-blur-lg transition duration-200">
                <button>Try this look</button>
                <img
                  src="../src/assets/external_link.png"
                  alt=""
                  className="h-3 w-3"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/*IMAGE INPUT */}

      {isFieldEmpty && chatHistory.length === 0 && (
        <div className="flex flex-col h-screen justify-center items-center bg-gray-200">
          <div
            className="bg-cover bg-center w-full h-screen"
            style={{
              backgroundImage: `url('../src/assets/background-image.jpg')`,
            }}
          >
            <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center text-white">
              <h1 className="text-4xl mb-6 text-center font-bold">
                Fashion is visual. You can search your desired style by image
              </h1>
              <form className="flex flex-col items-left bg-black bg-opacity-20 backdrop-blur-md p-12 rounded-lg">
                <label
                  htmlFor="imageInput"
                  className="text-lg mb-4 font-semibold"
                >
                  Upload Your Image
                </label>
                <div className="relative mb-4">
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="p-3 border border-gray-400 rounded-md w-64 appearance-none "
                  />
                  <div className="absolute top-0 right-0 h-full flex items-center pr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer transition duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onClick={() => {
                        document.getElementById("imageInput").value = "";
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 mt-2 text-white px-6 py-3 rounded-md transition duration-200"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
