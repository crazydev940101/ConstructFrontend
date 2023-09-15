/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { axiosRequest } from '../../service/axios';
import Loading from '../../components/Loading/PageLoading';
import { toast } from 'react-toastify';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { FaCopy } from 'react-icons/fa';

export interface ISaleRequest {
  id: number;
  description: string;
  status: 'pending' | 'completed' | 'declined';
  company: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
}

export const SaleRequestDetail = () => {
  const params = useParams();
  const [request, setRequest] = useState<ISaleRequest | null>(null);
  const [formData, setFormData] = useState<{
    price?: number;
    amount?: number;
  } | null>(null);
  // const [copy, setCopy] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const getSaleRequest = async () => {
    setLoading(true);
    try {
      if (params.id) {
        const result = await axiosRequest('GET', `/api/v1/sale-request/${params.id}`, true);
        setRequest(result.data);
        const price = result.data?.price && (result.data.price / 100);
        const amount = result.data?.company?.resources.length && result.data?.company?.resources?.filter((r: any) => r.key === 'max-number-of-documents')[0]?.value
        setFormData({price, amount})
      }
    } catch (err) {}
    setLoading(false);
  };
  useEffect(() => {
    getSaleRequest();
  }, [params]);
  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!formData?.price) {
      toast.error('Please enter price.');
      return;
    }
    if (!formData.amount) {
      toast.error('Please enter amount.');
      return;
    }
    try {
        const result = await axiosRequest('POST', `/api/v1/sale-request/${params.id}`, true, formData);
        toast.info(`${result.data.message || 'Subscription was created and user got the link successfully.'}`)
    } catch (err: any) {
        toast.error(`${err.response?.data?.error?.message || err.message}`)
        getSaleRequest()
    }
  };
  return (
    <div className="main-board pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] pb-[60px] pr-[20px] overflow-auto h-full">
      {loading ? (
        <Loading size={40} />
      ) : (
        <form className="flex-wrap justify-between items-center inline-block max-w-[900px]" onSubmit={onSubmit}>
          <div>
            <h1 className="text-[22px] font-bold mb-[10px]">Sale Request Detail</h1>
            <p className="text-[18px] font-normal mb-[30px] leading-[24px] text-neutral-500 max-[360px]:text-[14px]">
              Request from{' '}
              <a className="text-blue" href={`mailto:${request?.user.email}`}>
                {request?.user.email}
              </a>
            </p>
          </div>
          <div className="w-full flex-wrap 2xl:flex-nowrap gap-[30px]">
            <div className="detail">
              <div className="text-[15px] gap-[15px] mt-[15px]" style={{ display: 'inline' }}>
                <p className="w-[100px] xs:w-[120px] float-left max-[460px]:float-none max-[460px]:mb-[10px]">
                  <b>Name:</b>
                </p>
                <span className="max-w-[800px] text-justify">
                  {request?.user.firstname} {request?.user.lastname}
                </span>
              </div>
              <div className="text-[15px] gap-[15px] mt-[15px]" style={{ display: 'inline' }}>
                <p className="w-[100px] xs:w-[120px] float-left max-[460px]:float-none max-[460px]:mb-[10px]">
                  <b>Email:</b>
                </p>
                <span className="max-w-[800px] text-justify">{request?.user.email}</span>
              </div>
              <div className="text-[15px] gap-[15px] mt-[15px]" style={{ display: 'inline' }}>
                <p className="w-[100px] xs:w-[120px] float-left max-[460px]:float-none max-[460px]:mb-[10px]">
                  <b>Company:</b>
                </p>
                <span className="max-w-[800px] text-justify">{request?.company.name}</span>
              </div>
              <div className="text-[15px] gap-[15px] mt-[15px]" style={{ display: 'inline' }}>
                <p className="w-[100px] xs:w-[120px] float-left max-[460px]:float-none max-[460px]:mb-[10px]">
                  <b>Status:</b>
                </p>
                <span className="max-w-[800px] text-justify capitalize">{request?.status}</span>
              </div>
              <div className="text-[15px] gap-[15px] mt-[15px]" style={{ display: 'inline' }}>
                <p className="w-[100px] xs:w-[120px] pr-[30px] float-left max-[460px]:float-none max-[460px]:mb-[10px]">
                  <b>Description:</b>
                </p>
                <span className="text-justify ">{request?.description}</span>
              </div>
              <div className="text-[15px] mt-[15px] gap-[15px]" style={{ display: 'inline' }}>
                <p className="w-[100px] xs:w-[120px] float-left max-[460px]:float-none max-[460px]:mb-[10px]">
                  <b>Price:</b>
                </p>
                <input
                  type="number"
                  value={formData?.price || ''}
                  onChange={(e) => {
                    setFormData({
                      ...(formData || {}),
                      price: Number(e.target.value),
                    });
                  }}
                  required
                  min={0}
                  style={{ width: '180px' }}
                  placeholder="Price"
                />
              </div>
              <div className="text-[15px] gap-[15px] mt-[15px] items-end" style={{ display: 'inline' }}>
                <p className="w-[100px] xs:w-[120px] float-left max-[460px]:float-none max-[460px]:mb-[10px]">
                  <b>Page Amount:</b>
                </p>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData?.amount || ''}
                  onChange={(e) => {
                    setFormData({
                      ...(formData || {}),
                      amount: Number(e.target.value),
                    });
                  }}
                  style={{ width: '180px' }}
                  placeholder="Page amount"
                />
              </div>
              <div className="place-self-end bt-[30px] mt-[20px] max-[360px]:w-[95%] max-[360px]:text-center max-[460px]:w-[100%] max-[460px]:mr-[-40px] max-[330px]:mr-[-20px]">
                <button className="text-white bg-blue hover:bg-hoverblue rounded px-[10px] py-[10px] text-[12px] max-[360px]:w-[100%] max-[460px]:w-[100%] ">
                  Create Subscription
                </button>
              </div>
              {/* <div className='text-[15px] gap-[15px] mt-[40px] items-end' style={{display:'inline'}}>
            <p className="w-[100px] xs:w-[120px] float-left max-[460px]:float-none max-[460px]:mb-[10px]"><b>Payment link:</b></p>
            <CopyToClipboard text={request?.user.email} onCopy={() => {
              setCopy('Copied');
              setTimeout(() => {
                setCopy('')
              }, 2000)
            }}>
              <span className='relative'>
                <input value={request?.user.email} className="border" style={{ width: "180px" }} disabled />
                <span className='absolute ml-[-20px] mt-[5px]'><FaCopy /></span>
                <span className='absolute  transition ease-in-out duration-700 ml-[10px]'>{copy}</span>
              </span>
            </CopyToClipboard>
          </div> */}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
