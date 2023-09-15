/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import {useAuth} from '../../store/auth';
import userService from '../../service/auth';
import { axiosRequest } from '../../service/axios';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import './index.scss';

const DeleteAccount = () => {
  const { update } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');

  const onSubmit = async () => {
    try {
      update({ loading: true });
      const result = await axiosRequest('DELETE', '/api/v1/user/', true);
      toast.success(result.data.message);
      userService.logout();
      update({ isAuth: false });
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to delete account');
    }
    update({ loading: false });
    setShowModal(false);
  }

  return (
    <div className="main-board pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] pb-[60px] pr-[20px]">
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-[20px] font-bold mb-[10px]">Delete Account</h1>
          <p className="text-[18px] font-normal mb-[30px] leading-[24px] text-neutral-500 max-[360px]:text-[14px]">
            To delete the account click the Delete Account button
          </p>
        </div>
        <div className='max-[659px]:m-[auto]'>
          <button
            className="text-white bg-blue hover:bg-hoverblue border-[1px] border-blue rounded px-[50px] py-[10px] text-[14px] "
            onClick={() => {
              setShowModal(true);
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div
            className={classNames(
              'modal max-w-[500px] w-[95%] bg-white p-[30px] absolute left-[50%] translate-x-[-50%] translate-y-[-50%]',
              { 'top-[50%]': showModal, 'top-[-100%]': !showModal }
            )}
          >
            <h1 className="text-[16px] font-medium mb-[40px]">Delete your account and data?</h1>
            <p className="text-[16px] font-normal mb-[10px] leading-[24px] text-neutral-500">
              All your models and data will be deleted permanently. This cannot be undone. Are you sure you want to
              proceed?
            </p>
            <p className="text-[16px] font-normal mb-[30px] leading-[24px] text-neutral-500">
              Please Type <b className="text-black">"Yes Delete Everything"</b> below to proceed
            </p>
            <div className="flex justify-center gap-[20px]">
              <input
                placeholder="Yes Delete Everything"
                type="email"
                className="w-[100%] sm:w-[100%] border-[2px] px-[15px] py-[10px] text-[14px] rounded"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                }}
              />
            </div>
            <div className="w-[100%] sm:w-[90%] flex justify-end py-[10px] gap-[20px] mt-[20px] xs:mt-[40px] mx-auto">
              <button className="hover:bg-grey bg-lightgrey rounded px-[10px] xs:px-[30px] py-[10px] text-[14px] max-[462px]:w-[100%]" onClick={() => { setShowModal(false); setInviteEmail('') }}>
                Cancel
              </button>
              <button disabled={inviteEmail !== 'Yes Delete Everything'} className={classNames("text-white border-[1px] border-lightblue rounded px-[10px] xs:px-[30px] py-[10px] text-[14px] max-[462px]:w-[100%]", {
                "bg-lightblue": inviteEmail !== 'Yes Delete Everything',
                "bg-blue hover:bg-hoverblue": inviteEmail === 'Yes Delete Everything'
              })} onClick={() => (onSubmit())}>
                Yes <span className='max-[462px]:hidden'>Delete my account and data</span>
              </button>
            </div>
          </div>
        </Modal>
      )
      }
    </div >
  );
};

export default DeleteAccount;
