import React, { useEffect, useState } from 'react';
import { axiosRequest, getToken, urlRequest } from '../../service/axios';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import userService from '../../service/auth';
// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
//     }
//   }
// }

interface IState {
  products?: any[];
  publishable?: string;
}

interface IProps {
  hiddenDescription?: boolean;
}

const Pricing = (props: IProps) => {
  const navigate = useNavigate();
  const [state, setState] = useState<IState>({});
  const [pendingRequest, setPendingRequest] = useState(null);
  const getProducts = async () => {
    try {
      const result = await axiosRequest('GET', '/api/v1/stripe/products', false);
      if (result.data) {
        setState(result.data);
      }
      const pr = await axiosRequest('GET', '/api/v1/sale-request/pending', true);
      setPendingRequest(pr.data);
    } catch(err) {}
  };
  const onSubscribe = (product: any) => {
    return async () => {
      const token = getToken()
      if (token) {
        try {
          const userInfo = await axiosRequest('GET', '/api/v1/auth/user/', true, null);
          if (!product.default_price) {
            navigate('/contact-sale');
            return;
          }
          if (userInfo && userInfo.user) {
            const url = `/api/v1/stripe/checkout?token=${token}&priceId=${product.default_price.id}`;
            urlRequest(url);
            return;
          }
          throw new Error('Invalid user');
        } catch (err) {
          userService.logout();
          navigate('/signin');
        }
        return;
      }
      navigate('/signup');
    };
  };
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div className={props.hiddenDescription ? '' : 'bg-[#F5F7FA]'} id='pricing'>
        <div className="container pb-[50px]">
          {!props.hiddenDescription ? (
            <>
              <h1 className="section-title">Simple And Transparent Pricing</h1>
              <p className="max-w-[780px] text-home-text text-center text-[16px] my-[10px] px-[30px] mx-auto tracking-[0.5px]">
                AI that helps you slash turn around times by extracting and organising data from delivery documents
              </p>
            </>
          ) : (
            <></>
          )}
          <div className="pricing-board w-full flex flex-wrap justify-between gap-[50px] my-[60px] max-[1210px]:px-[30px] max-[360px]:px-[10px]">
            {state && state.products && state.products.map((product, idx) => {
              return (
                <div
                  className={`w-full sm:w-[45%] relative bg-white xl:w-[29%] ${
                    props.hiddenDescription ? 'border-[1px] border-[#ddd]' : ''
                  }`}
                  key={idx}
                >
                  <div className="bg-flexblue py-[30px]">
                    <h3 className="text-white text-center font-extra text-[18px]">{product.name}</h3>
                    {product.default_price ? (
                      <p className="text-white text-center text-[18px]">
                        £<span className="text-[30px] font-bold">{product.default_price.unit_amount / 100} </span>/
                        {product.default_price.transform_quantity
                          ? `${product.default_price.transform_quantity.divide_by} pages`
                          : 'month'}
                      </p>
                    ) : (
                      <p className="text-white text-center text-[30px]">Contact Sale</p>
                    )}
                  </div>
                  {product.description ? <div className="pricing-list">{product.description}</div> : <></>}
                  <div className='pt-[30px] pb-[25px] text-center border-t'>
                  <button
                      disabled={!product.default_price && !!pendingRequest}
                      title={!product.default_price && !!pendingRequest ? 'Pending ...' : ''}
                      onClick={onSubscribe(product)}
                    >
                      {!!pendingRequest ? 'Pending ...' : product.default_price ? 'Subscribe' : 'Contact Sale'}
                    </button>
                  </div>
                  {product.metadata ? (
                    (Object.values(product.metadata) as string[]).map((meta: string) => (
                      <div className="pricing-list border-t" key={meta}>
                        {meta}
                      </div>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default Pricing;
