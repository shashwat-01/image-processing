import Navbar from "../components/Navbar";
import MessageInput from "../components/MessageInput";
export default function Chat() {
  return (
    <div className='flex flex-col justify-between h-full'>
      <div id='chat_container' className='flex flex-col gap-3 pb-5'></div>
      <div className=''>
        <MessageInput textsize='22px' />
      </div>
    </div>
  );
}
