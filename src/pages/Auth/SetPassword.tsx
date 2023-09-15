import React, { useState, ChangeEvent } from 'react';

import { Header as AuthHeader } from '../../components/Auth/Header';
import { axiosRequest } from '../../service/axios';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const SetPassword = () => {
  const [password, setPassword] = useState<string>('');
  const [cpassword, setCPassword] = useState<string>(''); // confirm password
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams, ] = useSearchParams();
  const onSubmit = async () => {
    setErrorMessage('');
    if (!password) {
      setErrorMessage('Please enter password');
      return;
    }
    if (!cpassword) {
      setErrorMessage('Please enter confirm password');
      return;
    }
    if (password !== cpassword) {
      setErrorMessage('Password is not matched');
      return;
    }
    const token = searchParams.get('token');
    if(!token) {
      setErrorMessage('Something went wrong');
      return
    }
    try {
      const result = await axiosRequest('POST', '/api/v1/auth/user/set-password', true, {password}, token)
      toast.info(result.message)
    } catch(err) {
      toast.error((err as any).response?.data?.error?.message || 'Something went wrong!');
    }
  };
  return (
    <div className="relative w-full min-h-[100vh] flex items-center justify-center px-[30px]">
      <AuthHeader />
      <div className="w-full max-w-[500px] border-0 xs:border-[8px] bg-white mt-[60px] sm:mt-[80px] mb-[50px] px-[10px] sm:px-[30px] pt-[25px] sm:pt-[60px] pb-0 xs:pb-[80px]">
        <h1 className="text-black text-[24px] xs:text-[28px] font-bold mb-[5px] text-center">Enter your password</h1>
        <div className="auth-form flex flex-col items-center justify-start gap-[20px] mt-[20px] sm:mt-[30px] px-0 xs:px-[30px]">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Confirm Password"
            value={cpassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSubmit();
              }
            }}
          />
          <p className="error-text">{errorMessage}</p>
          <button className="social-auth-btn" onClick={onSubmit}>
            Set Password
          </button>
          <p className="text-center text-[16px] mt-[10px]">
            <span className="text-lightblue hover:underline"><Link to="/signin">Sign in</Link></span> | <span className="text-lightblue hover:underline"><Link to="/signup">Sign up</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
