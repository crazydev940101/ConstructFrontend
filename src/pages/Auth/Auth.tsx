import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { setLocalStorage } from '../../store/storage';

import Loading from '../../components/Loading/PageLoading';

const Auth = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      // TODO: Alert auth error

      setTimeout(() => {
        window.location.href = '/signin';
      }, 700);
    } else {
      // TODO Alert google auth success

      setLocalStorage('accessToken', accessToken);
      setLocalStorage('refreshToken', refreshToken);

      setTimeout(() => {
        window.location.href = '/app';
      }, 700);
    }
  }, [searchParams]);

  return (
    <div className="w-full h-[90vh] m-auto">
      <Loading size={60} />
    </div>
  );
};

export default Auth;
