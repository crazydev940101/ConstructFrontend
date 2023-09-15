import React from 'react';

interface BodyType {
  [key: string]: any;
}

interface HeaderItem {
  label: string | JSX.Element;
  align: string
}

interface PropsType {
  data: {
    header: string[];
    body: BodyType[];
  };
}

const InfoTable = (props: PropsType) => {
  const headData: HeaderItem[] | string[] = props.data.header;
  const bodyData = props.data.body;

  return (
    <table className="w-full text-left text-sm font-light text-[14px]">
      <thead className="border-b-[2px] border-[#b5b7b9] font-medium dark:border-neutral-500 text-left">
        <tr>
          {headData.map((ele: HeaderItem | string, ind) => (
            <th key={ind} className={`${typeof ele === 'object' && ele.align === 'right' ? "text-right" : "text-left"} whitespace-nowrap py-[3px] px-[5px]`}>
              {typeof ele === 'object' ? ele.label : ele}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyData.map((body, index) => (
          <tr key={index} className='border-b hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600 text-left'>
            {Object.keys(body).map((key, ind) => (
              <td key={ind} className={`${typeof headData[ind] === 'object' && (headData[ind] as unknown as HeaderItem).align === 'right' ? "text-right" : "text-left"} px-[6px] py-[4px]`}>
                {body[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InfoTable;
