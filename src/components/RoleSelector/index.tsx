import React from 'react';
import Popup from 'reactjs-popup';
import { FaCaretDown } from 'react-icons/fa';
import classNames from 'classnames';

interface RoleType {
  id: string;
  title: string;
  content: string;
}

export type TUserRole = 'superAdmin' | 'admin' | 'contributor' | 'viewer';

interface IProps {
  value: TUserRole;
  onChange: Function;
  disabled?: boolean;
  canDelete: boolean;
  roleSet?: string;
}

export const roles = [
  {
    id: 'superAdmin',
    title: 'Super Admin',
    content: 'Can view and edit all information',
  },
  {
    id: 'admin',
    title: 'Admin',
    content: 'Can do everything except see billing information and delete an Account',
  },
  {
    id: 'contributor',
    title: 'Contributor',
    content: 'Can view and edit project',
  },
  {
    id: 'viewer',
    title: 'Viewer',
    content: 'Can only view information',
  },
] as RoleType[];

const RoleSelector = (props: IProps) => {
  return (
    <Popup
      position="bottom right"
      className="team-popup"
      offsetY={-7}
      disabled={props.disabled}
      trigger={
        <button className={classNames("items-center gap-[5px] border-[2px] border-lightgrey rounded pl-[8px] pr-[4px] py-[9px] w-[120px] text-[90%] text-right flex justify-between", { "cursor-not-allowed": props.disabled })}>
          <span>{`${roles.filter((role) => role.id === props.value)[0]?.title || ''}`}</span> <FaCaretDown />
        </button>
      }
    >
      {(close: Function) => {
        return (
          <>
            {roles.map((role, index) => {
              return (
                ('superAdmin' === role.id && props.roleSet === 'admin') ? (<React.Fragment key={index}></React.Fragment>) : role.id === props.value ? (
                  <div
                    key={index}
                    className="text-[14px] text-zinc-800 border-b-[1px] !p-[10px] border-lightgrey hover:cursor-pointer hover:bg-lightgrey"
                  >
                    <p className="font-medium leading-[20px]">{role.title}</p>
                    <p className="font-normal leading-[20px] text-zinc-600">{role.content}</p>
                  </div>
                ) : (
                  <div
                    key={index}
                    onClick={() => {
                      props.onChange(role);
                      close();
                    }}
                    className="text-[14px] text-zinc-800 border-b-[1px] !p-[10px] border-lightgrey hover:cursor-pointer hover:bg-lightgrey"
                  >
                    <p className="font-medium leading-[20px]">{role.title}</p>
                    <p className="font-normal leading-[20px] text-zinc-600">{role.content}</p>
                  </div>
                )
              )
            })}
            {props.canDelete === true ?
              (<div onClick={() => {
                props.onChange({
                  id: 'delete'
                });
                close();
              }} className="text-red-600 font-medium text-[14px] hover:!text-red-600 hover:cursor-pointer hover:bg-lightgrey px-[10px] py-[15px]">
                Delete User
              </div>) : (<></>)
            }
          </>
        );
      }}
    </Popup>
  );
};

export default RoleSelector;
