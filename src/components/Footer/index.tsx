import React from 'react';

import './index.scss';
import { Newsletter } from '../Newsletter';

const Footer = () => {
  return (
    <div className="w-full bg-bgfooter pt-[40px]">
      <div className="container flex flex-wrap justify-start md:justify-center items-start text-white max-[1210px]:px-[30px] max-[360px]:px-[10px]">
        <div className="footer-section w-[100%] sm:w-[50%] md:w-[25%] max-[360px]:px-[10px]">
          <h3>Contact us</h3>
          <ul>
            <li className='pb-[20px]'>
              <a href="#contact">Contact Form</a>
            </li>
            <li>Email:</li>
            <li  className='pb-[20px]'>
              <a href="mailto:hello@hypervine.io">hello@hypervine.io</a>
            </li>
            <li>Address:</li>
            <li className='pb-[20px] w-[250px]'>Codebase 3 Argyle House, Lady Lawson St, Edinburgh, EH3 9DR, 100 Queen Street Glasgow, G1 3DN</li>
          </ul>
        </div>
        <div className="footer-section w-[100%] xs:w-[60%] sm:w-[25%] px-[5px] max-[360px]:px-[10px]">
          <h3>Support</h3>
          <ul>
            <li>
              <a href="mailto:support@hypervine.io">support@hypervine.io</a>
            </li>
            <li>
              <a href="#privacy-policy">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-section  w-[100%] xs:w-[40%] sm:w-[20%] px-[5px] max-[360px]:px-[10px]">
          <h3>Company</h3>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#team">Team</a>
            </li>
            <li>
              <a href="#blog">Blog</a>
            </li>
          </ul>
        </div>
        <Newsletter />
        <div className="w-full border-t-[1px] border-t-[#ddd] mt-[20px] pt-[30px] pb-[15px]">
          <p className="text-center text-[15px]">
            © 2022. <strong>AirDoc.pro.</strong> All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
