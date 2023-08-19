export default function MessageInput({
  textsize,
  setIsFieldEmpty,
  handleKeyPress,
  message,
  setMessage, // Add this prop
}) {
  const sendMessage = () => {
    if (message.trim() !== "") {
      // You can handle the logic to send the message here

      // Reset the input
      setMessage("");
    }
  };

  return (
    <div className='w-full'>
      <form>
        <div className='flex border-b-2 border-gray-600 border-solid py-2'>
          <textarea
            name='prompt'
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsFieldEmpty(e.target.value === "");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleKeyPress(e);
              }
            }}
            id=''
            cols='1'
            rows='1'
            className='w-full whitespace-nowrap overflow-x-auto focus:outline-none resize-none'
            style={{
              fontFamily: "Colfax",
              fontSize: `${textsize}`,
            }}
            placeholder='What vibe are you feeling today?'></textarea>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}>
            <img src='../src/assets/submit-arrow.svg' alt='' />
          </button>
        </div>
      </form>
    </div>
  );
}
