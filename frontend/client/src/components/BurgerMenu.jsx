import React from "react";
import { slide as Menu } from "react-burger-menu";
import "./BurgerMenu.css"; // Create this CSS file to style the menu

const SideMenu = () => {
  return (
    <Menu
      customBurgerIcon={
        <img
          src='../src/assets/hamburger-menu.svg'
          className='w-20 h-20 object-cover'
          alt='Custom Icon'
        />
      }>
      <a className='menu-item' href='/'>
        Home
      </a>
      <a className='menu-item' href='/about'>
        About
      </a>
      <a className='menu-item' href='/services'>
        Services
      </a>
      <a className='menu-item' href='/contact'>
        Contact
      </a>
    </Menu>
  );
};

export default SideMenu;
