/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {useAuth} from '../../store/auth';
import { axiosRequest } from '../../service/axios';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'react-toastify';
import userService from '../../service/auth';
import './index.scss';

interface ProfileKeyType {
  firstname: string;
  lastname: string;
  jobTitle: string;
  email: string;
  company: {
    name: string;
  };
}
interface EmailKeyType {
  createdAt: string;
  id: number | null;
  key: string;
  updatedAt: string;
  userId: number | null;
  value: string;
}

interface ProfileType {
  title: string;
  type: ProfileKeyValues;
}

type ProfileKeyValues = 'firstname' | 'lastname' | 'jobTitle' | 'email' | 'company.name';

const Profile = () => {
  const details = [
    {
      title: 'First Name',
      type: 'firstname',
    },
    {
      title: 'Last Name',
      type: 'lastname',
    },
    {
      title: 'Job Title',
      type: 'jobTitle',
    },
    {
      title: 'Email',
      type: 'email',
    },
    {
      title: 'Company',
      type: 'company.name',
    },
  ] as ProfileType[];

  const [profile, setProfile] = useState<ProfileKeyType | any>({
    firstname: '',
    lastname: '',
    jobTitle: '',
    email: '',
    company: { name: '' },
  });

  const [emailSetting, setEmailSetting] = useState<EmailKeyType>({
    createdAt: '',
    id: null,
    key: '',
    updatedAt: '',
    userId: null,
    value: '',
  });
  const debouncedupdate = useDebounce<ProfileKeyType>(profile, 500);
  const { user: authUser, update } = useAuth();

  const getUserInfo = async () => {
    const res = await userService.getUser();
    if (res.status) {
      update({ isAuth: true, user: { ...res.data.user }, loading: false });
    } else {
      update({ isAuth: false });
      toast.error('Please signin');
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    }
  };

  const updateDatail = (key: ProfileKeyValues, value: string) => {
    if (key.includes('.')) {
      let tempObject = {};
      let container: any = tempObject;
      key.split('.').forEach((k: string, i: number, values: string[]) => {
        container = (container[k] = (i === values.length - 1 ? value : {}))
      });
      setProfile((prev: ProfileKeyType) => {
        return { ...prev, ...tempObject };
      });
    } else {
      setProfile((prev: ProfileKeyType) => {
        return { ...prev, [key]: value };
      });
    }
  };

  const updateProfile = async () => {
    try {
      update({ loading: true });
      const data = {
        ...profile
      };
      delete data.email
      if (authUser.role === 'admin')
        delete data.company
      const res = await axiosRequest('PUT', '/api/v1/user/profile', true, data);
      update({ isAuth: true, user: { ...res.data }, loading: false });
    } catch (err: any) {
      toast.error(err.response.data.error.message);
    }
    update({ loading: false });
  };

  const onChangeEmailSetting = async (status: string) => {
    try {
      update({ loading: true });
      await axiosRequest('PUT', `/api/v1/user-setting/email/${status}`, true);
      getEmailSetting();
    } catch (err: any) {
      toast.error(err.response.data.error.message);
    }
    update({ loading: false });
  }

  const getEmailSetting = async () => {
    try {
      const result: any | string = await axiosRequest('GET', '/api/v1/user-setting/email', true, null);
      setEmailSetting(result.data);
    } catch (err: any) {
      toast.error(err.response.data.error.message);
    }
  };

  const getProfile = async () => {
    try {
      const result: any | string = await axiosRequest('GET', '/api/v1/user/profile', true, null);
      setProfile(result.data);
    } catch (err: any) {
      toast.error(err.response.data.error.message);
    }
  };
  useEffect(() => {
    getUserInfo();
    getProfile();
    getEmailSetting();
  }, []);

  useEffect(() => {
    updateProfile();
  }, [debouncedupdate]);

  return (
    <div className="main-board pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] pb-[60px] pr-[20px]">
      <h1 className="text-[22px] font-bold mb-[10px]">Profile Settings</h1>
      <p className="text-[17px] font-normal mb-[30px] leading-[24px] text-neutral-500 max-[360px]:text-[14px]">Adjust profile details here</p>
      <div className="w-full flex-wrap 2xl:flex-nowrap gap-[30px]">
        <div className="detail">
          {details.map((ele, ind) => {
            let values: string | any = '';
            if (ele.type.includes('.')) {
              let keys = ele.type.split('.');
              values = profile;
              for (let key of keys) {
                values = values[key]
              }
            } else {
              values = profile[ele.type];
            }
            return <div key={ind} className='w-[100%]'>
              <p className="w-[120px] xs:w-[150px]">{ele.title}</p>
              <input
                type="text"
                placeholder="Add text"
                value={values ? values : ''}
                onChange={(e) => {
                  updateDatail(ele.type, e.target.value);
                }}
                disabled={ele.type === 'email' || (ele.type === 'company.name' && authUser.role !== 'superAdmin')} />
            </div>
          })}
        </div>
      </div>
      <div className="mt-[100px]"></div>
      <h1 className="text-[18px] font-bold mb-[10px]">Notification Settings</h1>
      <p className="text-[16px] font-normal mb-[30px] leading-[24px] text-neutral-500 max-[360px]:text-[13px]">Adjust email settings here</p>
      <div className="mt-[30px]"></div>
      <h1 className="text-[16px] font-medium:500 mb-[10px] max-[360px]:text-[13px]">Do you want to receive email notifications from Airdoc.Pro?</h1>
      <div className="notification flex flex-col gap-[20px] justify-start items-start pl-[20px] pt-[20px] max-[360px]:pl-[0px]">
        <label className="hover:cursor-pointer max-[360px]:text-[13px]">
          <input type="radio" name="notification" value={'active'} checked={emailSetting.value === 'active'} onChange={(e) => { onChangeEmailSetting(e.target.value) }} />
          <span>Yes</span>
        </label>
        <label className="hover:cursor-pointer max-[360px]:text-[13px]">
          <input type="radio" name="notification" value={'disabled'} checked={emailSetting.value === 'disabled'} onChange={(e) => { onChangeEmailSetting(e.target.value) }} />
          <span>No</span>
        </label>
      </div>
    </div>
  );
};

export default Profile;
