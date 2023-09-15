import React from 'react';

import './index.scss';

import DocImg from '../../../assets/img/docs.jpg';

const Jumbotron = () => {
  return (
    <div className="jumbotron">
      <div className="container flex flex-col md:flex-row items-center justify-center min-h-[900px] py-[65px]">
        <div className="w-[95%] md:w-[58%] my-[30px] md:mt-0 mr-0 md:mr-[30px] text-center md:text-left text-white max-[1210px]:px-[30px] max-[360px]:px-[0px]">
          <h1 className="text-[28px] sm:text-[33px] xl:text-[40px] text-center md:text-left leading-[40px] sm:leading-[44px] font-extra mb-[25px]">
            In just a few minutes you can produce site inventories, site registers, bill of quantities and get detailed
            supplier insights using AI.
          </h1>
          <p className="text-[18px] font-normal mb-[50px] text-center md:text-left">
            Scans, Photos or PDFs can all be processed, all you need to do is Drag & Drop
          </p>
          <a href="#price" className="start-btn smart-transition">Get A Free 7 Days Trial</a>
        </div>
        <div className="w-[95%] sm:w-[70%] md:w-[42%] hidden md:block px-0 max-[1210px]:px-[30px] max-[360px]:px-[0px]">
          <img src={DocImg} alt="doc" width={978} height={1280} className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Jumbotron;
