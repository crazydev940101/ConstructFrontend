import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

import { Header as AuthHeader } from '../../components/Auth/Header';
import { axiosRequest } from '../../service/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');

  const submit = async () => {
    try {
      if(!email) {
        toast.error("Please enter your email address");
        return
      }
      const result = await axiosRequest('POST', '/api/v1/auth/user/forgot-password', false, {email})
      toast.info(result.message)
    } catch (err) {
      console.log(err)
      toast.error((err as any).response.data.error.message);
    }
  }

  return (
    <div className="relative w-full min-h-[100vh] flex items-center justify-center px-[30px]">
      <AuthHeader />
      <div className="w-full max-w-[500px] border-0 xs:border-[8px] bg-white mt-[60px] sm:mt-[80px] mb-[50px] px-[10px] sm:px-[30px] pt-[25px] sm:pt-[60px] pb-0 xs:pb-[80px]">
        <h1 className="text-black text-[24px] xs:text-[28px] font-bold mb-[5px] text-center">Reset your password</h1>
        <h2 className="text-grey text-[16px] xs:text-[20px] font-normal mb-[15px] leading-[25px] text-center">
          Enter your email address so we can reset your password.
        </h2>
        <div className="auth-form flex flex-col items-center justify-start gap-[20px] mt-[20px] sm:mt-[30px] px-0 xs:px-[30px]">
          <input
            type="email"
            placeholder="email@your company"
            className="text-[24px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submit();
              }
            }}
          />
          <button className="social-auth-btn" type='button' onClick={submit}>Submit</button>
          <p className="text-center text-[16px] mt-[10px]">
            <span className="text-lightblue hover:underline"><Link to="/signin">Sign in</Link></span> | <span className="text-lightblue hover:underline"><Link to="/signup">Sign up</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
