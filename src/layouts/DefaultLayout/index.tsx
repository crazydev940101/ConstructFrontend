/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import classNames from 'classnames';
import { BsFillGearFill } from 'react-icons/bs';
import { FaPlus, FaMinus, FaHeadset, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../store/auth';
import userService from '../../service/auth';
import Loading from '../../components/Loading/PageLoading';
import { LogoLight } from '../../assets';
import './index.scss';
import { navigation } from '../../navigation';
import TimeSavingMetrics from '../../components/DefaultLayout/TimeSavingMetrics';

const DefaultLayout = () => {
  const navigate = useNavigate();
  const { isAuth, user, loading, updateAuthParams } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [isSubMenu, setIsSubMenu] = useState(false);
  const logOut = async () => {
    try {
      await userService.logout();
      updateAuthParams({ isAuth: false });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (location.pathname) {
      setIsOpen(false);
    }
  }, [location.pathname]);
  const menu: string = ''; // unnecessary variable
  return (
    <div
      className="w-full h-full flex relative"
      onClick={() => {
        if (isPopup) setIsPopup(false);
      }}
    >
      {!isAuth ? (
        <div className="h-[100vh] w-full">
          <Loading color={'text-blue'} />
        </div>
      ) : (
        <>
          <div className="flex gap-[20px] items-center justify-between fixed top-0 left-0 py-[10px] px-[20px] h-[50px] min-w-[100vw] lg:min-w-[270px] bg-blue z-[200]">
            <Link to="/">
              <img src={LogoLight} alt="logo" width={1904} height={386} className="h-[30px] w-auto" />
            </Link>
            <button
              className="text-gray-500 w-[40px] h-[40px] block lg:hidden relative focus:outline-none bg-transparent mr-[15px]"
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
          <div
            className={classNames('sidebar mt-[40px] z-[200]', {
              'left-[-320px] lg:left-0': !isOpen,
              'left-0': isOpen,
            })}
          >
            <div className="sidebar-menu">
              <div>
                <ul>
                  {navigation.main.map((nav) => {
                    if(nav.blockRoles?.includes(user.role)) return <React.Fragment key={nav.to}></React.Fragment>
                    return (
                      <React.Fragment key={nav.to}>
                        {nav.topDevider ? <div className="h-[5px] opacity-25 bg-white my-[10px]"></div> : <></>}
                        <li>
                          {nav.icon}
                          <Link
                            to={nav.to}
                            className={classNames({
                              'bg-hoverblue': nav.enabled?.includes(location.pathname) || nav.to === location.pathname,
                            })}
                          >
                            {nav.label}
                          </Link>
                        </li>
                      </React.Fragment>
                    );
                  })}
                </ul>
              </div>
              <TimeSavingMetrics />
              <div>
                <ul>
                  <li className="flex-col">
                    <div className="flex w-full items-center">
                      <BsFillGearFill />
                      <span className="flex justify-between items-center" onClick={() => setIsSubMenu(!isSubMenu)}>
                        Settings
                        {!isSubMenu ? <FaPlus /> : <FaMinus />}
                      </span>
                    </div>
                    <ul className={classNames({ 'h-0': !isSubMenu })}>
                      <li className={classNames({ 'bg-hoverblue': menu === 'profile' })}>
                        <Link to="/app/profile">Profile & Notifications</Link>
                      </li>
                      {user.role !== 'contributor' && user.role !== 'viewer' ? (
                        <li className={classNames({ 'bg-hoverblue': menu === 'team' })}>
                          <Link to="/app/team">Team</Link>
                        </li>
                      ) : (
                        <></>
                      )}
                      {user.role === 'systemAdmin' ? (
                        <li className={classNames({ 'bg-hoverblue': menu === 'sale-request' })}>
                          <Link to="/app/sale-request">Sale Request</Link>
                        </li>
                      ) : (
                        <></>
                      )}
                      <li className={classNames({ 'bg-hoverblue': menu === 'billing' })}>
                        <Link to="/app/billing">Billing</Link>
                      </li>
                      <li className={classNames({ 'bg-hoverblue': menu === 'delete-account' })}>
                        <Link to="/app/delete-account">Delete Account</Link>
                      </li>
                    </ul>
                  </li>
                  {/* <li>
                    <FaCalendarCheck />
                    <Link
                      to="/app/supplier-request"
                      className={classNames({ 'bg-hoverblue': menu === 'supplier-request' })}
                    >
                      Supplier Request
                    </Link>
                  </li> */}
                  <li>
                    <FaHeadset />
                    <Link to="/app/support" className={classNames({ 'bg-hoverblue': menu === 'support' })}>
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>            
            <Popup
              position="top right"
              className="logout-popup"
              trigger={
                <div className="w-full flex justify-start items-center gap-[10px] relative">
                  <FaUserCircle className="text-[38px] min-w-[38px]" />
                  <div
                    onClick={() => setIsPopup(!isPopup)}
                    className={classNames(
                      'w-full hover:cursor-pointer hover:bg-hoverblue rounded overflow-hidden pl-[5px]',
                      { 'bg-hoverblue': isPopup, 'bg-blue': !isPopup }
                    )}
                  >
                    <p className="text-[16px] whitespace-nowrap truncate">{`${user.firstname || ''} ${
                      user.lastname || ''
                    }`}</p>
                    <p className="text-[16px]">{user.email}</p>
                  </div>
                </div>
              }
            >
              <div className="h-[40px] pl-[10px] hover:bg-lightgrey flex items-center justify-start" onClick={logOut}>
                <p className="text-zinc-800 hover:cursor-pointer">Logout</p>
              </div>
            </Popup>
          </div>
          <div className="h-screen" onClick={() => setIsOpen(false)}>
            {loading ? (
              <div className="z-10 fixed top-1/2 left-1/2 translate-1/2">
                <Loading size={50} />
              </div>
            ) : (
              <></>
            )}
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default DefaultLayout;
