export default function MessageInput() {
  return (
    <div className='w-full'>
      <form>
        <textarea
          name='prompt'
          id=''
          cols='1'
          rows='1'
          className='w-full'
          placeholder='Ask Codex...'></textarea>
        <button type='submit'>
          <img src='assets/send.svg' alt='' />
        </button>
      </form>
    </div>
  );
}
