import React from 'react';
import Logo from '../assets/Logo.svg'
import User from '../assets/button_ic_profile.png'
import {Link} from "react-router-dom";

const Header = () => {
  return (
    <div className='flex justify-between m-3 border-b-2 border-gray mt-6 pb-6'>
      <div>
        <img src={Logo} alt=""/>
      </div>
      <div className='flex justify-between w-6/12'>
        <Link to={'/'}>
          <span className='cursor-pointer'>Динамическая аналитика</span>
        </Link>
        <Link to={'/work'}>
          <span className='cursor-pointer'>Работа с карточками</span>
        </Link>
        <Link to={'/history'}>
          <span className='cursor-pointer'>История с графиками</span>
        </Link>
        <img className='h-7' src={User} alt=""/>
      </div>
    </div>
  );
};

export default Header;
