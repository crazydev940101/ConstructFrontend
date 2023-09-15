import React from 'react';
import classNames from 'classnames';

import { Help1, Help2, Help3, Help4, Help5, Help6 } from '../../../assets';

import './index.scss';

interface HelpType {
  img: string;
  imgName: string;
  title: string;
  content: string;
  isMax?: boolean;
}

const Help = () => {
  const helps = [
    {
      img: Help1,
      imgName: 'help1',
      title: 'POWERFUL AI SITE REGISTER',
      content: 'Filed, sorted, categorized, - organised in seconds and available to everyone.',
    },
    {
      img: Help2,
      imgName: 'help2',
      title: 'SITE INVENTORIES CREATED IN MINUTES',
      content: 'Searchable - find every single item that ever entered any of your sites with a simple search.',
    },
    {
      img: Help3,
      imgName: 'help3',
      title: 'DOCUMENT INTELLIGENCE',
      content: 'Filter materials, plant, tools and consumables',
      isMax: true,
    },
    {
      img: Help4,
      imgName: 'help4',
      title: "MEASURE KPI's",
      content: 'Delivery data can give unique insights to measure material and supplier performance.',
    },
    {
      img: Help5,
      imgName: 'help5',
      title: 'REPORTS, AUDITS & & DUE DILIGENCE',
      content: 'Delivery, site and material audits created in a few clicks.',
    },
    {
      img: Help6,
      imgName: 'help6',
      title: 'EXPORT',
      content: 'Export your complete, organised site data into business analytics tools like Power BI',
    },
  ] as HelpType[];

  return (
    <div className="bg-[#F5F7FA]">
      <div className="container py-[50px]">
        <h1 className="section-title">How AirDoc.Pro Helps You</h1>
        <p className="max-w-[780px] text-home-text text-center text-[16px] my-[10px] px-[30px] mx-auto tracking-[0.5px]">
          AI that helps you slash turn around times by extracting and organising data from delivery documents
        </p>
        <div className="help-grid w-full grid grid-cols-1 sm:grid-cols-2 slg:grid-cols-3 gap-[30px] my-[60px] max-[1210px]:px-[30px] max-[360px]:px-[10px]">
          {helps.map((ele) => (
            <div key={ele.imgName}>
              <div>
                <img src={ele.img} alt={ele.imgName} />
                <h3 className={classNames({ 'max-w-[200px]': ele.isMax })}>{ele.title}</h3>
              </div>
              <p>{ele.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
