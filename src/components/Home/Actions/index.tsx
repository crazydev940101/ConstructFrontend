import React from 'react';

import { Action1, Action2, Action3 } from '../../../assets';

import './index.scss';

const Actions = () => {
  return (
    <div className="bg-white">
      <div className="container py-[50px]">
        <h1 className="section-title">See It In Action</h1>
        <p className="text-home-text text-center text-[16px] my-[10px]">Extracting data from delivery documents</p>
        <div className="w-full flex flex-wrap justfiy-start md:justify-between items-center lg:items-start my-[60px] px-[10px] md:px-[0]">
          <div className="section-content w-full md:w-[50%] max-[1210px]:px-[30px]">
            <h2>Airdoc.Pro extracts fields and line items from Delivery Tickets</h2>
            <p>
              Slow, late and lost delivery tickets compound problems in an organization's ability to operate sites, pay
              suppliers and respond to client requests.
            </p>
            <p>
              Airdoc.Pro artificial intelligence augments the process and make sure every single delivery is sorted,
              categorised, synced to site and accounted for - never lose another delivery ticket again and no more
              clunky folders.
            </p>
            <p>
              Reduce your delivery ticket processing cost by up to 40% by capturing the delivery tickets once and making
              it visible to all teams who needs access to that data.
            </p>
            <a href="#price">Get Started Free</a>
          </div>
          <div className="w-full md:w-[42%] max-[1210px]:px-[30px]">
            <img src={Action1} alt="action1" width={2580} height={1652} className="mt-[30px] md:mt-0" />
          </div>
        </div>
        <div className="w-full flex flex-wrap-reverse md:flex-wrap justfiy-start md:justify-between items-center lg:items-start my-[60px] max-[1210px]:px-[30px] max-[360px]:px-[10px]">
          <div className="w-full md:w-[42%]">
            <img src={Action2} alt="action2" width={2560} height={1428} className="mt-[30px] md:mt-0" />
          </div>
          <div className="section-content w-full md:w-[50%] ">
            <h2>Easily accessed powerful material and delivery data</h2>
            <p>
              Data captured through the Airdoc.Pro system gives you delivery metrics that can be used to help settle
              final accounts, create cost plans, cost in use studies and speed up evaluation and reporting of tenders.
              All data can be easily exported for your process
            </p>
            <a href="#price">Get Started Free</a>
          </div>
        </div>
        <div className="w-full flex flex-wrap justfiy-start md:justify-between items-center lg:items-start my-[60px] max-[1210px]:px-[30px] max-[360px]:px-[10px]">
          <div className="section-content w-full md:w-[50%]">
            <h2>AI that learns with every new document</h2>
            <p>
              Detailed data insights from material to plant to tools - do you know how many spanners you bought this
              year? Airdoc.Pro saves time by enabling the automatic creation of a general expense book allowing you to
              focus on the more important tasks.
            </p>
            <a href="#price">Get Started Free</a>
          </div>
          <div className="w-full md:w-[42%]">
            <img src={Action3} alt="action3" width={2560} height={1541} className="mt-[30px] md:mt-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;
