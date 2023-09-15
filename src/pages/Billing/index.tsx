/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';

import { axiosRequest, urlRequest } from '../../service/axios';
import Loading from '../../components/Loading/PageLoading';
import userService from '../../service/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pricing from '../../components/Pricing';
import { toast } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../../components/Billing/Checkout';
import Badge from '../../components/Utils/Badge';

const Billing = () => {
  const [subscribedResult, setSubscribedResult] = useState<{
    isSubscribed?: boolean;
    subscriber?: {
      email: string;
    };
    company: any;
    subscription?: any;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState<any>();
  const [subscriptionData, setSubscriptionData] = useState<{
    client_secret: string;
    publishable_key: string;
  } | null>(null);

  const billing = async () => {
    try {
      const ui = await axiosRequest('GET', '/api/v1/auth/user/', true, null);
      setUserInfo(ui);
      const result = await axiosRequest('GET', `/api/v1/stripe/subscription`, true, null);
      setSubscribedResult(result.data);
    } catch (err) {
      if ((err as any).response.status === 401) {
        userService.logout();
        navigate('/signin');
      } else {
        console.log((err as any).response.data?.error?.message || (err as Error).message);
      }
    }
  };

  const manage = () => {
    if (subscribedResult && userInfo && subscribedResult.isSubscribed) {
      urlRequest(`/api/v1/stripe/billing?userId=${userInfo.user.id}`);
    }
  };

  useEffect(() => {
    if (searchParams.get('client_secret') && searchParams.get('publishable_key')) {
      setSubscriptionData({
        client_secret: searchParams.get('client_secret') as string,
        publishable_key: searchParams.get('publishable_key') as string,
      });
    } else {
      billing();
    }
    if (searchParams.get('error')) {
      toast.error(searchParams.get('error'));
    }
  }, [searchParams]);

  return (
    <div className="main-board pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] pb-[60px] pr-[20px]">
      {subscriptionData ? (
        <>
          {subscriptionData.client_secret && subscriptionData.publishable_key ? (
            <>
              <h1 className="text-[20px] font-bold mb-[30px]">Subscription</h1>
              <div className="max-w-[576px] m-auto">
                <Elements
                  stripe={loadStripe(subscriptionData.publishable_key)}
                  options={{ clientSecret: subscriptionData.client_secret }}
                >
                  <CheckoutForm />
                </Elements>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : subscribedResult ? (
        subscribedResult.isSubscribed && subscribedResult.subscription ? (
          <>
            <h1 className="text-[20px] font-bold">Billing</h1>
            <h1 className="text-[16px] font-bold mt-[3rem]">Email</h1>
            <p className="mb-[10px]">Your billing information is associated with this email</p>
            <div className="detail">
              <div className="w-[100%]">
                <p className="w-[120px] xs:w-[150px]">Email</p>
                <input
                  type="text"
                  placeholder="Email"
                  value={subscribedResult.subscription.customer.email || ''}
                  disabled={true}
                />
              </div>
              <div className="w-[100%]">
                <p className="w-[120px] xs:w-[150px]">Company</p>
                <input type="text" placeholder="Company" value={subscribedResult.company.name || ''} disabled={true} />
              </div>
            </div>
            <div className='h-[1px] bg-black opacity-10 my-[30px]'></div>
            <h1 className="text-[16px] font-bold mb-[10px] mt-[3rem]">Subscription</h1>
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <p className="text-[18px] font-normal leading-[24px] text-neutral-500 max-[360px]:text-[14px]">
                  Your Plan <Badge type="success">Active</Badge>
                </p>
                <h1 className="text-[16px] mb-[10px]">
                  <span className="text-[18px] font-bold text-neutral-500">
                    {subscribedResult.subscription.plan.product.name}
                  </span>{' '}
                </h1>
              </div>
              <div className="max-[659px]:ml-[auto] text-neutral-500">
                {subscribedResult.subscriber ? (
                  <span>{subscribedResult.subscriber.email}</span>
                ) : (
                  <>
                    <div className="mb-[5px]">
                      <button
                        className="text-white w-[180px] bg-blue hover:bg-hoverblue border-[1px] border-blue rounded py-[10px] text-[14px]"
                        onClick={manage}
                      >
                        Manage
                      </button>
                    </div>
                    <div className="mt-[1rem]">
                      (
                      <span className="font-black text-black text-[18px]">
                        £{subscribedResult.subscription.plan.amount_decimal / 100}
                      </span>{' '}
                      <span className="text-black">
                        per{' '}
                        {subscribedResult.subscription.plan.transform_usage
                          ? `${subscribedResult.subscription.plan.transform_usage.divide_by} pages`
                          : 'month'}
                        )
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className='h-[1px] bg-black opacity-10 my-[30px]'></div>
            <div className="text-right mt-[2rem]">
              <button
                className="w-[180px] hover:bg-grey rounded text-blue py-[10px] text-[14px] "
                onClick={() => {
                  navigate('/contact-sale');
                }}
              >
                Contact Sale
              </button>
            </div>
          </>
        ) : (
          <Pricing hiddenDescription={true} />
        )
      ) : (
        <Loading size={40} />
      )}
    </div>
  );
};

export default Billing;
