import React from 'react';

import './index.scss';

const DataLoading = ({ color }: { color?: string }) => {
  return <span className={`loader ${color ? color : 'text-[#888]'}`}></span>;
};

export default DataLoading;
