import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';

import Loading from '../../Loading/PageLoading';

import { axiosRequest } from '../../../service/axios';
import { validateEmail } from '../../../utils';
import { setLocalStorage } from '../../../store/storage';

interface PropsType {
  isLogin?: boolean;
}

interface FormType {
  email: string;
  password: string;
  role?: string;
}

type FormElement = 'email' | 'password';

const Form = ({ isLogin }: PropsType) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormType>({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
  });

  const updateForm = (key: FormElement, value: string) => {
    setFormData({ ...formData, [key]: value });
    updateErrorMessage(key, '');
  };

  const updateErrorMessage = (key: FormElement, value: string) => {
    setErrorMessage((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const onSubmit = async () => {
    if (!formData.email) {
      updateErrorMessage('email', 'Required field');
    }

    if (!formData.password) {
      updateErrorMessage('password', 'Required field');
    }

    if (!formData.email || !formData.password || loading) return;

    if (!validateEmail(formData.email)) {
      updateErrorMessage('email', 'Invalid email');
      return;
    }

    const url = `/api/v1/auth/user/${isLogin ? 'signin' : 'signup'}`;
    let reqData = {
      email: formData.email,
      password: formData.password,
    } as FormType;

    if (!isLogin) reqData = { ...reqData, role: 'superAdmin' };

    try {
      setLoading(true);
      const res = await axiosRequest('POST', url, false, reqData);
      toast.info(res.message);

      setTimeout(() => {
        if (!isLogin) {
          navigate('/signin');
        } else {
          setLocalStorage('accessToken', res.data.accessToken);
          setLocalStorage('refreshToken', res.data.refreshToken);

          window.location.href = '/app';
        }
      }, 500);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-form w-full">
      <p className="text-gray-700 text-[15px] mt-[15px]">Work email</p>
      <input
        type="email"
        name="email"
        placeholder="email@your company"
        value={formData.email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          updateForm('email', e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit();
          }
        }}
      />
      <p className="error-text">{errorMessage.email}</p>
      <div className="text-gray-700 text-[15px] mt-[15px] flex justify-between">
        Password
        {isLogin && (
          <Link to="/forgot-password" className="text-lightblue">
            Forgot Password
          </Link>
        )}
      </div>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          updateForm('password', e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit();
          }
        }}
      />
      <p className="error-text">{errorMessage.password}</p>
      {!isLogin && (
        <p className="text-[14px] font-normal text-gray-700 mt-[40px]">
          By signing up, you agree to Airdoc.Pros <a href="#terms">Terms of Service</a> and{' '}
          <a href="#privacy">Privacy Policy</a>
        </p>
      )}
      <button
        className={classNames('social-auth-btn', { 'mt-[40px] sm:mt-[50px]': isLogin, 'mt-[20px]': !isLogin })}
        onClick={onSubmit}
      >
        {loading ? <Loading size={30} color={'text-white'} /> : isLogin ? 'Log in' : 'Create a free account'}
      </button>
    </div>
  );
};

export { Form };
