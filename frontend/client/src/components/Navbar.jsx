import BurgerMenu from "./BurgerMenu";
export default function Navbar() {
  return (
    <div>
      <BurgerMenu />
      {/* <div> */}
      <img
        className='h-10 fixed top-4 left-20'
        src='../src/assets/ziggy-logo.png'
        alt=''
      />
      {/* </div> */}
    </div>
  );
}
