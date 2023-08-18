import { useState } from "react";
import LandingPageQuotes from "../components/LandingPageQuotes";
import MessageInput from "../components/MessageInput";

export default function Landing() {
  const [isFieldEmpty, setIsFieldEmpty] = useState(true);

  return (
    <div className='flex flex-row h-screen'>
      {isFieldEmpty && (
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
      <div className='w-2/3 flex flex-col p-20 justify-between'>
        <div>
          <img className='h-14' src='../src/assets/ziggy-logo.png' alt='' />
        </div>
        <MessageInput textsize='30px' setIsFieldEmpty={setIsFieldEmpty} />
        {isFieldEmpty && <LandingPageQuotes />}
      </div>
    </div>
  );
}
