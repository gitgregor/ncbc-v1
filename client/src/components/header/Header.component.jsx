
import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './header.styles.scss';

const Header = () => (
    <div className='header'>

        <Link className='logo-container' to='/'>
            <Logo />
        </Link>

        <div className='options'>

            <Link className='option' to='/mainapp'>
                LOGOWANIE
            </Link>

            <Link className='option' to='/logout'>
                WYLOGUJ
            </Link>


            <Link className='option' to='/contact'>
                KONTAKT
            </Link>

        </div>


    </div>
);
export default Header;
