export default function MessageInput({ textsize, setIsFieldEmpty }) {
  return (
    <div className='w-full'>
      <form>
        <div className='flex border-b-2 border-gray-600 border-solid py-2'>
          <textarea
            name='prompt'
            onChange={(e) => {
              if (e.target.value === "") setIsFieldEmpty(true);
              else setIsFieldEmpty(false);
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
          <button type='submit'>
            <img src='../src/assets/submit-arrow.svg' alt='' />
          </button>
        </div>
      </form>
    </div>
  );
}
