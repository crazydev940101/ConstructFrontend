import { SyntheticEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supportList } from '../../pages/Support';
import { toast } from 'react-toastify';
import { validateEmail } from '../../utils';
import { axiosRequest } from '../../service/axios';
import Loading from '../Loading/PageLoading';

interface IProps {
  isContactSale?: boolean;
  supportType?: string;
}
interface IState {
  name?: string;
  email?: string;
  company?: string;
  supportType?: string;
  summary?: string;
  description?: string;
}
const Contact = (props: IProps) => {
  const [data, setData] = useState<IState>({});
  const [loading, setLoading] = useState(false);
  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!data.name) {
      toast.error('Name is required');
      return;
    }
    if (!data.email) {
      toast.error('Email is required');
      return;
    }
    if (!validateEmail(data.email)) {
      toast.error('Email is not valid');
      return;
    }
    if (!data.company) {
      toast.error('Company Name is required');
      return;
    }
    if (props.supportType) {
      if (!data.supportType) {
        toast.error('Support Type is required');
        return;
      }
      if (!data.summary) {
        toast.error('Summary is required');
        return;
      }
    }
    if (!data.description) {
      toast.error('Description is required');
      return;
    }
    setLoading(true);
    try {
      if (props.isContactSale) {
        // contact sale
        const result = await axiosRequest('POST', '/api/v1/sale-request', true, data);
        toast.info(result.message);
        setLoading(false);
        return;
      }
      if (props.supportType) {
        // contact support
        const result = await axiosRequest('POST', '/api/v1/support-request', true, data);
        toast.info(result.message);
        setLoading(false);
        return;
      }
      // contact form
      const result = await axiosRequest('POST', '/api/v1/contact-request', false, data)
      toast.info(result.message)
      setLoading(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.message);
      setLoading(false);
    }
  };
  const onChange = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const getProfile = async () => {
    try {
      return await axiosRequest('GET', '/api/v1/user/profile', true, null);
    } catch (err: any) {
      toast.error(err.response.data.error.message);
    }
  };
  const presetData = async () => {
    let d: IState = {};
    if (props.supportType) {
      d = {
        ...d,
        supportType: props.supportType,
      };
    }
    if (props.isContactSale) {
      setData({
        ...data,
        email: 'Loading ...',
      });
      const result: any = await getProfile();
      d = {
        ...d,
        name: `${result.data?.firstname || ''} ${result.data?.lastname || ''}`,
        email: result.data?.email || '',
        company: result.data?.company?.name || '',
      };
    }
    setData(d);
  };
  useEffect(() => {
    presetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  return (
    <div className="bg-[#F5F7FA] p-[30px] max-[360px]:px-[10px]" id="contact">
      <div className="flex min-h-full flex-1 flex-col justify-center pt-[40px] m-[auto] max-w-[580px] max-[1150px]:max-w-[450px] max-[1150px]:pt-[0px]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="section-title">
            Contact {props.isContactSale ? 'Sale' : props.supportType ? 'Support' : 'Us'}
          </h1>
          {!props.supportType ? (
            <>
              <h2 className="text-[28px] mt-[80px] max-[950px]:mt-[60px]">Ready to start?</h2>
              <p className="mt-[20px] mb-[20px]">Lets start automating your data extraction today!</p>
            </>
          ) : (
            <div className="h-[70px]"></div>
          )}
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm pb-[50px]">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="mb-[30px]">
              <label htmlFor="name" className="block text-sm font-medium leading-8 text-gray-500">
                Name{' '}
                <small>
                  (You can update your name in{' '}
                  <Link to={'/app/profile'} className="text-blue">
                    Profile
                  </Link>
                  )
                </small>
              </label>
              <div className="">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="block h-[43px] pl-[10px] w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"
                  value={data.name || ''}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="mb-[30px]">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500">
                Email
              </label>
              <div className="">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  className="block w-full h-[43px] pl-[10px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"
                  value={data.email || ''}
                  onChange={onChange}
                  disabled={!!props.isContactSale}
                />
              </div>
            </div>
            <div className="mb-[30px]">
              <label htmlFor="company" className="block text-sm font-medium leading-8 text-gray-500">
                Company name
              </label>
              <div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="block h-[43px] pl-[10px] w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"
                  value={data.company || ''}
                  onChange={onChange}
                />
              </div>
            </div>
            {props.supportType ? (
              <>
                <div className="mb-[30px]">
                  <label htmlFor="supportType" className="block text-sm font-medium leading-8 text-gray-500">
                    Support Type
                  </label>
                  <div>
                    <select
                      id="supportType"
                      name="supportType"
                      className="block h-[43px] pl-[10px] w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"
                      value={data.supportType}
                      onChange={onChange}
                    >
                      {supportList.map((supportItem) => (
                        <option key={supportItem.title} value={supportItem.title}>
                          {supportItem.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-[30px]">
                  <label htmlFor="summary" className="block text-sm font-medium leading-8 text-gray-500">
                    Summary
                  </label>
                  <div>
                    <input
                      id="summary"
                      name="summary"
                      type="text"
                      className="block h-[43px] pl-[10px] w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"
                      value={data.summary || ''}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="mb-[30px]">
              <label htmlFor="description" className="block text-sm font-medium leading-8 text-gray-500">
                {props.supportType ? 'Description' : 'Are you looking to use Airdoc.Pro in your company?'}
                {props.isContactSale ? (
                  <>
                    <br />
                    Please share a bit more context on what you would like to discuss with our sales team.
                  </>
                ) : (
                  ''
                )}
              </label>
              <div>
                <textarea
                  id="description"
                  name="description"
                  className="block h-[95px] p-[10px] w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"
                  value={data.description || ''}
                  onChange={onChange}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full h-[55px] justify-center text-[20px] items-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? <Loading color="white" /> : 'Submit'}
              </button>
            </div>
            <p className="text-[14px] mt-[20px] text-gray-400 mb-[20px]">
              Never share sensitive information (credit card numbers, social security numbers, passwords) through this
              form.
            </p>
            {props.isContactSale ? (
              <p className="text-[14px] mt-[20px] text-blue mb-[20px] text-center">
                <Link to="/">Go to Home</Link>
              </p>
            ) : props.supportType ? (
              <p className="text-[14px] mt-[20px] text-blue mb-[20px] text-center">
                <Link to="/app/support">Go to Support</Link>
              </p>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
