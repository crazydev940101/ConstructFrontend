import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { axiosRequest } from '../../service/axios';
export const Newsletter = () => {
  const [data, setData] = useState({});
	const [loading, setLoading] = useState<boolean>(false)
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value
		})
	}
	const submit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setLoading(true)
		try {
			const result = await axiosRequest('POST', '/api/v1/newsletter', false, data)
			toast.info(result.message)
		} catch(err: any) {
			toast.error(err.response?.data?.error?.message || err.message)
		}
		setLoading(false)
	}
  return (
    <div className="footer-section w-[100%] xs:w-[70%] sm:w-[50%] md:w-[30%] max-[876px]:m-[auto] max-[360px]:px-[10px]">
      <h3>Get the News!</h3>
      <form onSubmit={submit}>
        <ul>
          <li>
            <input
              type="text"
              name="firstname"
              required
							onChange={onChange}
              placeholder="First Name"
              className="w-full text-[14px] px-[12px] py-[6px] my-[5px] text-[#555] outline-none rounded"
            />
          </li>
          <li>
            <input
              type="text"
              name="lastname"
              required
							onChange={onChange}
              placeholder="Last Name"
              className="w-full text-[14px] px-[12px] py-[6px] my-[5px] text-[#555] outline-none rounded"
            />
          </li>
          <li>
            <input
              type="text"
              name="company"
              required
							onChange={onChange}
              placeholder="Company"
              className="w-full text-[14px] px-[12px] py-[6px] my-[5px] text-[#555] outline-none rounded"
            />
          </li>
          <li>
            <input
              type="email"
              name="email"
              required
							onChange={onChange}
              placeholder="Email"
              className="w-full text-[14px] px-[12px] py-[6px] my-[5px] text-[#555] outline-none rounded"
            />
          </li>
          <li className="max-[876px]:text-center">
            <button
              type="submit"
              className="text-white bg-lightblue text-[12px] hover:bg-white hover:text-black px-[30px] py-[15px] rounded my-[5px]"
            >
              {
								loading ? 'Loading ...' : 'Subscribe'
							}
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
};
