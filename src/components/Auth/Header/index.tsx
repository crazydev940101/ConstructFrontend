import React from 'react';
import { Link } from 'react-router-dom';

import { LogoDark } from '../../../assets';

const Header = () => {
  return (
    <div className="absolute top-[15px] slg:top-[30px] left-[20px]">
      <Link to="/">
        <img src={LogoDark} alt="logo" width={1904} height={386} className="h-[30px] w-auto" />
      </Link>
    </div>
  );
};

export { Header };
