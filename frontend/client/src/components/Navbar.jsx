import BurgerMenu from "./BurgerMenu";
export default function Navbar() {
  return (
    <div className='flex items-center gap-4 px-7 py-7'>
      <BurgerMenu />
      <img className='h-10' src='../src/assets/ziggy-logo.png' alt='' />
    </div>
  );
}
