import React, { useRef } from "react";

export default function MessageInput({
  textsize,
  setIsFieldEmpty,
  handleKeyPress,
  handleSendBtnPress,
  message,
  setMessage,
  disableInput,
}) {
  const textareaRef = useRef(null);

  return (
    <div className='w-full'>
      <form>
        <div className='flex border-b-2 border-gray-600 border-solid py-2'>
          <textarea
            ref={textareaRef} // Attach the ref to the textarea
            name='prompt'
            disabled={disableInput}
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
            onClick={handleSendBtnPress}
            disabled={disableInput}>
            <img src='../src/assets/submit-arrow.svg' alt='' />
          </button>
        </div>
      </form>
    </div>
  );
}
