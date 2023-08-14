export default function MessageInput() {
  return (
    <div className='w-full'>
      <form>
        <div className='flex border-b-2 border-gray-600 border-solid py-2'>
          <textarea
            name='prompt'
            id=''
            cols='1'
            rows='1'
            className='w-full whitespace-nowrap overflow-x-auto focus:outline-none resize-none'
            style={{
              fontFamily: "Colfax",
              fontSize: "30px",
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
