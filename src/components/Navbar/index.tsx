/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import {useAuth} from '../../store/auth';
import userService from '../../service/auth';
import { axiosRequest } from '../../service/axios';
import { destroyStorage } from '../../store/storage';

import { LogoDark, LogoLight } from '../../assets';

import './index.scss';

const Navbar = () => {
  const { isAuth, updateAuthParams } = useAuth();

  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const logOut = async () => {
    try {
      await axiosRequest('POST', `/api/v1/auth/user/signout`, true);
      if (isAuth) {
        destroyStorage('accessToken');
        destroyStorage('refreshToken');
      }

      updateAuthParams({ isAuth: false });
    } catch (err) {
      console.error(err);
    }
  };

  const stickNavbar = () => {
    if (window !== undefined) {
      let windowHeight = window.scrollY;

      if (windowHeight < 100) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    }
  };

  const getUserInfo = async () => {
    updateAuthParams({ loading: true });
    const res = await userService.getUser();

    if (res.status) {
      updateAuthParams({ isAuth: true, user: { ...res.data.user }, loading: false });
    }
    updateAuthParams({ loading: false });
  };

  useEffect(() => {
    window.addEventListener('scroll', stickNavbar);

    return () => {
      window.removeEventListener('scroll', stickNavbar);
    };
  }, []);

  useEffect(() => {
    getUserInfo().then();
  }, []);

  return (
    <>
      <nav
        className={classNames('w-full h-[70px] fixed top-0 left-0 transition-all duration-200 ease-in-out max-[1210px]:px-[30px] max-[360px]:px-[10px]', {
          'bg-bgheader': isSticky,
          'bg-transparent': !isSticky,
        })}
      >
        <div className="container h-full flex justify-between items-center">
          <a href="/">
            <img
              src={isSticky ? LogoLight : LogoDark}
              alt="logo"
              width={1904}
              height={386}
              className="h-[45px] w-auto"
            />
          </a>
          <div className="hidden md:flex items-center justify-end gap-[20px] text-[13px] font-bold">
            <ul className="flex text-white gap-[30px]">
              {isAuth && (
                <li>
                  <Link
                    to="/app"
                    className="bg-transparent border-[2px] text-white hover:text-flexblue rounded-md py-[8px] px-[16px]"
                  >
                    Launch app
                  </Link>
                </li>
              )}
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <Link to="#blog">Blog</Link>
              </li>
              {!isAuth ? (
                <li>
                  <Link to="/signin">Sign in</Link>
                </li>
              ) : (
                <li>
                  <span className="hover:cursor-pointer" onClick={logOut}>
                    Sign out
                  </span>
                </li>
              )}
            </ul>
            {!isAuth && (
              <Link to="/signup" className="bg-white text-flexblue rounded-md py-[8px] px-[16px] hover:bg-gray-300">
                Get started for free
              </Link>
            )}
          </div>
          <button
            className="text-gray-500 w-[40px] h-[40px] block md:hidden relative focus:outline-none bg-transparent mr-[5px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="block w-[5px] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span
                className={classNames('hamburger-line', { 'rotate-45': isOpen, '-translate-y-[8px]': !isOpen })}
              ></span>
              <span className={classNames('hamburger-line', { 'opacity-0': isOpen })}></span>
              <span
                className={classNames('hamburger-line', { '-rotate-45': isOpen, 'translate-y-[8px]': !isOpen })}
              ></span>
            </div>
          </button>
        </div>
      </nav>
      <div
        className={classNames(
          'mobile-menu fixed w-full flex mt-[70px] overflow-hidden z-10',
          { 'bg-[#222222]': isSticky, 'bg-transparent': !isSticky },
          { 'h-[180px] border-t-[1px] border-black': isOpen, 'h-0 border-transparent': !isOpen }
        )} onMouseLeave={() => setIsOpen(!isOpen)}
      >
        <ul className="w-full text-white" onClick={() => setIsOpen(!isOpen)}>
          {isAuth && (
            <li>
              <Link to="/app">Launch app</Link>
            </li>
          )}
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          {isAuth ? (
            <li>
              <span className="hover:cursor-pointer" onClick={logOut}>
                Log out
              </span>
            </li>
          ) : (
            <>
              <li>
                <Link to="/signin">Sign in</Link>
              </li>
              <li>
                <Link to="/signup">Get started for free</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
