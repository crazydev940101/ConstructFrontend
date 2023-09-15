/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Modal from '../../components/Modal';
import {useAuth} from '../../store/auth';
import { axiosRequest } from '../../service/axios';
import Badge from '../../components/Utils/Badge';
import RoleSelector, { TUserRole } from '../../components/RoleSelector';
import userService from '../../service/auth';
import './index.scss';
import { toast } from 'react-toastify';
import { validateEmail } from '../../utils';

interface UserType {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  role: 'superAdmin' | 'admin' | 'contributor' | 'viewer';
}

const Team = () => {
  const { user: authUser, update } = useAuth();
  const [members, setMembers] = useState<UserType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [changeinfo, setChangeinfo] = useState<{
    id?: number;
    role?: 'superAdmin' | 'admin' | 'contributor' | 'viewer' | 'delete';
  }>({});
  const [changevalue, setChangevalue] = useState<number>();
  const [newUser, setNewUser] = useState<{
    email?: string;
    role?: 'superAdmin' | 'admin' | 'contributor' | 'viewer';
  }>({});
  const handleMouseOver = (e: any) => {
    setChangevalue(e);
  };

  const handleMouseLeave = (e: any) => {
    setChangevalue(e);
  };

  const fetchTeamMembers = async () => {
    try {
      update({ loading: true });
      const result = await axiosRequest('GET', '/api/v1/user/team-members', true, null);
      setMembers(result.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to fetch team members');
    }
    update({ loading: false });
  };

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

  const submit = async () => {
    if (!newUser.email) {
      toast.error('Please enter email');
      return;
    }
    if (!validateEmail(newUser.email)) {
      toast.error('Invalid email');
      return
    }
    try {
      update({ loading: true });
      setShowModal(false);
      const result = await axiosRequest('POST', '/api/v1/user', true, newUser);
      toast.success(result.data.message);
      fetchTeamMembers();
    } catch (err: any) {
      toast.error(err.response.data.error.message);
    }
    update({ loading: false });
  };

  const resendSubmit = async (id: number) => {
    try {
      update({ loading: true });
      const result = await axiosRequest('POST', `/api/v1/user/${id}`, true);
      toast.success(result.data.message);
    } catch (err: any) {
      toast.error(err.response.data.error.message);
    }
    update({ loading: false });
  }

  const onsubmit = async () => {
    if (changeinfo.role === 'delete') {
      try {
        update({ loading: true });
        const result = await axiosRequest('DELETE', `/api/v1/user/${changeinfo.id}`, true);
        toast.success(result.data.message);
        fetchTeamMembers();
      } catch (err: any) {
        toast.error(err.response.data.error.message);
      }
      update({ loading: false });
      setDeleteModal(false);
    } else {
      try {
        update({ loading: true });
        const result = await axiosRequest('PUT', `/api/v1/user/role/${changeinfo.id}`, true, changeinfo);
        toast.success(result.data.message);
        fetchTeamMembers();
      } catch (err: any) {
        toast.error(err.response.data.error.message);
      }
      update({ loading: false });
      setDeleteModal(false);
    }
  }

  useEffect(() => {
    fetchTeamMembers();
    getUserInfo();
  }, []);

  return (
    <div className="main-board pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] pb-[30px] pr-[20px] max-w-4xl relative">
      <div className="flex flex-wrap justify-between items-center px-[50px] max-[768px]:px-[20px] max-[360px]:px-[0px]">
        <div className="relative">
          <h1 className="text-[20px] font-bold mb-[10px]">Team</h1>
          <p className="text-[18px] font-normal mb-[30px] leading-[24px] text-neutral-500">
            Change permissions level or invite new users
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-center w-full">
          <button
            className="text-white bg-blue hover:bg-hoverblue border-[1px] border-blue rounded px-[50px] py-[10px] text-[14px]"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Invite User
          </button>
        </div>
      </div>
      <div className="w-full flex-col flex-wrap 2xl:flex-nowrap gap-[30px] mt-[30px] text-gray-800 px-[50px] max-[768px]:px-[20px] max-[360px]:px-[0px]">
        {members.map((user, index) => (
          <div
            key={index}
            className="w-full flex flex-col sm:flex-row gap-[20px] justify-between border-b-[3px] border-b-lightgrey py-[10px]"
          >
            <div>
              <h3 className={classNames('font-medium', { 'text-green-600': user.id === authUser.id })}>{`${user.firstname || ''} ${user.lastname || ''}`}</h3>
              <p className={classNames('', { 'pt-[30px]': !(user.firstname && user.lastname), 'text-green-600': user.id === authUser.id })}>{user.email}</p>
            </div>
            <div className="justify-end flex items-end sm:items-center">
              {user.status === 'active' ? (<Badge type='success' className="mr-[15px] disabled">Activated</Badge>) :
                (
                  <Badge type={changevalue === index ? 'grey' : 'indigo'} className="mr-[15px] cursor-pointer" onClick={() => resendSubmit(user.id)}>
                    <span onMouseOver={() => handleMouseOver(index)} onMouseLeave={() => handleMouseLeave(-1)}>{changevalue === index ? ('Resend') : ('Pending')}</span>
                  </Badge>
                )
              }
              <RoleSelector
                onChange={(e: any) => {
                  setChangeinfo({
                    ...changeinfo,
                    id: user.id,
                    role: e.id,
                  });
                  setDeleteModal(true);
                }}
                disabled={user.id === authUser.id || (authUser.role === 'admin' && user.role === 'superAdmin')}
                roleSet={authUser.role}
                value={user.role}
                canDelete={true}
              />
            </div>
          </div>
        ))}

      </div>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div
            className={classNames(
              'modal max-w-[600px] w-[95%] bg-white p-[30px] absolute left-[50%] translate-x-[-50%] translate-y-[-50%]',
              { 'top-[50%]': showModal, 'top-[-100%]': !showModal }
            )}
          >
            <h1 className="text-[18px] font-medium mb-0">Invite User to Airdoc.Pro</h1>
            <p className="text-[16px] font-normal mb-[30px] leading-[24px] text-neutral-500">
              Enter users email address and select permission level
            </p>
            <div className="flex justify-between gap-[20px] max-[360px]:block">
              <input
                placeholder="Enter email address"
                type="email"
                className="w-full border-[2px] px-[15px] py-[10px] text-[16px] rounded mb-[20px]"
                value={newUser?.email || ''}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  });
                }}
              />
              <div>
                <RoleSelector
                  onChange={(e: any) => {
                    setNewUser({
                      ...newUser,
                      role: e.id
                    })
                  }}
                  value={newUser?.role || authUser.role as TUserRole}
                  roleSet={authUser.role}
                  canDelete={false}
                />
              </div>
            </div>
            <div className="w-full flex justify-end py-[10px] gap-[20px] mt-[30px]">
              <button
                className="w-[150px] bg-lightgrey hover:bg-grey rounded px-[30px] py-[10px] text-[14px]"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="w-[150px] text-white bg-blue hover:bg-hoverblue border-[1px] border-blue rounded px-[30px] py-[10px] text-[14px]"
              >
                Send
              </button>
            </div>
          </div>
        </Modal>
      )}
      {deleteModal && (
        <Modal
          onClose={() => {
            setDeleteModal(false);
          }}
        >
          <div
            className={classNames(
              'modal max-w-[450px] w-[95%] bg-white p-[30px] absolute left-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%]'
            )}
          >
            <h1 className="text-[16px] font-medium mt-[20px] text-zinc-800">Warning!</h1>
            <p className="text-[16px] mt-[10px] mb-[30px] text-zinc-700">Do you want to {changeinfo.role === 'delete' ? 'delete this member?' : 'change role of this member?'}</p>
            <div className="flex justify-end gap-[20px]">
              <button
                className="w-[80px] h-[30px] rounded bg-blue text-white hover:bg-hoverblue"
                onClick={() => { onsubmit() }}
              >
                Yes
              </button>
              <button
                className="w-[80px] h-[30px] rounded text-dark bg-lightgrey hover:bg-grey"
                onClick={() => {
                  setDeleteModal(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Team;
