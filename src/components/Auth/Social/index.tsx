import React from 'react';

import { urlRequest } from '../../../service/axios';

import { Microsoft, Google } from '../../../assets';

interface PropsType {
  isLogin?: boolean;
}

const Social = ({ isLogin }: PropsType) => {
  const onSocialAuth = async (endpoint: string) => {
    urlRequest(`/api/v1/auth/user/${endpoint}`);
  };

  return (
    <div className="w-full flex flex-col gap-[25px] py-[10px]">
      <button className="social-auth-btn" onClick={() => onSocialAuth('google')}>
        <img src={Google} alt="google" width={225} height={225} />
        {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
      </button>
      <button className="social-auth-btn" onClick={() => onSocialAuth('azure')}>
        <img src={Microsoft} alt="microsoft" width={225} height={225} />
        {isLogin ? 'Sign in with Microsoft' : 'Sign up with Microsoft'}
      </button>
    </div>
  );
};

export { Social };
