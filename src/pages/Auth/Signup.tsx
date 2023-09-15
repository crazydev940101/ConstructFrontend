import React from 'react';
import { Link } from 'react-router-dom';

import { Header as AuthHeader } from '../../components/Auth/Header';
import { Social as AuthSocial } from '../../components/Auth/Social';
import { Form as AuthForm } from '../../components/Auth/Form';

import './index.scss';

const Signup = () => {
  return (
    <div className="relative w-full flex justify-center">
      <AuthHeader />
      <div className="flex-center flex w-[100%] slg:w-[60%] min-h-[100vh] bg-white px-[20px] pt-[80px] pb-[50px]">
        <div>
          <h2 className="text-center text-black text-[24px] xs:text-[32px] font-medium mb-[15px]">
            Create your Airdoc.Pro account
          </h2>
          <AuthSocial />
          <div className="relative w-full h-[6px] bg-lightgrey mt-[50px] slg:mt-[70px] mb-[30px] slg:mb-[50px]">
            <p className="absolute-center w-max bg-white text-center text-gray-700 text-[14px] px-[20px]">
              Or, register with your email
            </p>
          </div>
          <AuthForm />
          <p className="mt-[60px]">
            Already have an account?{' '}
            <Link to="/signin" className="text-lightblue">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="flex-center w-[40%] min-h-[100vh] bg-blue px-[20px] hidden slg:flex">
        <h1 className="text-center max-w-[500px] text-white text-[26px] leading-[35px] font-bold">
          Unlock the Power of Automation for Your Construction Company with artificial intelligence - Save Time & Money
        </h1>
      </div>
    </div>
  );
};

export default Signup;
