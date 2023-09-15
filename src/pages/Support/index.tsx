/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { FaSearch, FaImage } from 'react-icons/fa';

import './index.scss';
import { Link } from 'react-router-dom';

export const supportList = [
  {
    title: 'IT Support',
    content: 'Secondary text',
  },
  {
    title: 'Getting Started',
    content: 'Secondary text',
  },
  {
    title: 'Billing',
    content: 'Secondary text',
  },
  {
    title: 'Accuracy',
    content: 'Secondary text',
  },
  {
    title: 'Request Suppliers',
    content: 'Secondary text',
  },
];

const Support = () => {
  const [searchText, setSearchText] = useState<string>('');

  return (
    <div className="main-board min-h-[100vh] flex justify-center items-center pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] pb-[60px] pr-[20px]">
      <div className="w-full max-w-[800px] flex flex-col justify-between items-center mx-auto">
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full border-[2px] pl-[40px] pr-[15px] py-[10px] text-[14px] rounded"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <FaSearch className="absolute left-[10px] top-[10px] text-[25px] text-zinc-800 max-[360px]:text-[18px] max-[360px]:top-[14px]" />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-[40px] gap-y-[20px] mt-[30px]">
          {supportList.map((ele, ind) => (
            <Link key={ind} to={`/contact-support?title=${ele.title}`}>
              <div className="flex border-[2px] border-zinc-300 rounded-sm">
              <div className="flex justify-center items-center w-[80px] bg-[#ccd9f3] text-blue border-r-[2px] border-r-zinc-300">
                <FaImage className="text-[32px] max-[360px]:text-[26px]" />
              </div>
              <div className="px-[10px] py-[20px]">
                <h1 className="text-[22px] font-medium leading-[24px] max-[360px]:text-[18px]">{ele.title}</h1>
                <p className="text-[16px] leading-[16px] max-[360px]:text-[13px] mt-[5px]">{ele.content}</p>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
