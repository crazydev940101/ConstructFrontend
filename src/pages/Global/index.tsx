import ChatBot from '../../components/ChatBot';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollIntoView from '../../components/Global/ScrollIntoView';

export const Global = () => {
  const location = useLocation();
  return (
    <>
      <ScrollIntoView />
      <Outlet />
      {!location.pathname.includes('chat') ? <ChatBot /> : <></>}
    </>
  );
};
