import React from 'react';
import { Link } from 'react-router-dom';

import { Header as AuthHeader } from '../../components/Auth/Header';
import { Social as AuthSocial } from '../../components/Auth/Social';
import { Form as AuthForm } from '../../components/Auth/Form';

import './index.scss';

const Signin = () => {
  return (
    <div className="relative w-full min-h-[100vh] flex items-center justify-center px-[30px]">
      <AuthHeader />
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] 2xl:w-[50%] border-0 xs:border-[8px] bg-white mt-[60px] sm:mt-[80px] mb-[50px] px-0 xs:px-[30px] sm:px-[80px] pt-[25px] sm:pt-[60px] pb-0 xs:pb-[80px]">
        <h2 className="text-left text-black text-[36px] xs:text-[40px] font-bold mb-[15px]">Welcome Back!</h2>
        <div className="max-w-[500px] mx-auto mt-[20px] sm:mt-[40px]">
          <AuthSocial isLogin={true} />
          <div className="relative w-full h-[6px] mt-[20px] mb-[40px]">
            <p className="absolute-center w-max bg-white text-center text-gray-700 text-[14px] px-[20px]">
              Or, login with your email
            </p>
          </div>
          <AuthForm isLogin />
          <p className="mt-[30px] sm:mt-[40px] text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-lightblue">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
